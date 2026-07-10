type GraphQLVariables = Record<string, string | number | boolean | null>;

type ContentfulFetchInit = RequestInit & {
  next?: {
    revalidate?: false | 0 | number;
    tags?: string[];
  };
};

export type ContentfulRequestOptions = {
  preview?: boolean;
  revalidate?: false | 0 | number;
  tags?: string[];
};

type GraphQLError = {
  message: string;
};

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLError[];
};

type ContentfulConfig = {
  accessToken: string;
  endpoint: string;
  revalidate: false | 0 | number;
};

const DEFAULT_ENVIRONMENT = "master";
const DEFAULT_REVALIDATE_SECONDS = 300;

export function isContentfulConfigured(preview = false) {
  return Boolean(
    process.env.CONTENTFUL_SPACE_ID &&
      (preview
        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
        : process.env.CONTENTFUL_ACCESS_TOKEN),
  );
}

export async function contentfulGraphQLFetch<TData>(
  query: string,
  variables: GraphQLVariables = {},
  options: ContentfulRequestOptions = {},
) {
  const config = getContentfulConfig(options.preview);
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        ...variables,
        preview: Boolean(options.preview),
      },
    }),
    next: {
      revalidate: options.revalidate ?? config.revalidate,
      tags: ["contentful", ...(options.tags ?? [])],
    },
  } satisfies ContentfulFetchInit);

  if (!response.ok) {
    const message = await readErrorMessage(response);

    throw new Error(
      `Contentful GraphQL request failed: ${response.status} ${response.statusText}${message}`,
    );
  }

  const payload = (await response.json()) as GraphQLResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(
      `Contentful GraphQL request failed: ${payload.errors
        .map((error) => error.message)
        .join("; ")}`,
    );
  }

  if (!payload.data) {
    throw new Error("Contentful GraphQL request returned no data.");
  }

  return payload.data;
}

function getContentfulConfig(preview = false): ContentfulConfig {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? DEFAULT_ENVIRONMENT;
  const accessToken = preview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    const tokenName = preview
      ? "CONTENTFUL_PREVIEW_ACCESS_TOKEN"
      : "CONTENTFUL_ACCESS_TOKEN";

    throw new Error(
      `Missing Contentful environment variables. Set CONTENTFUL_SPACE_ID and ${tokenName}.`,
    );
  }

  return {
    accessToken,
    endpoint: `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${environment}`,
    revalidate: getRevalidateSeconds(),
  };
}

function getRevalidateSeconds() {
  const value = process.env.CONTENTFUL_REVALIDATE_SECONDS;

  if (!value) {
    return DEFAULT_REVALIDATE_SECONDS;
  }

  if (value === "false") {
    return false;
  }

  const seconds = Number(value);

  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error(
      "CONTENTFUL_REVALIDATE_SECONDS must be a non-negative number or false.",
    );
  }

  return seconds;
}

async function readErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as {
      errors?: GraphQLError[];
      message?: string;
    };
    const errors = body.errors
      ?.map((error) => error.message)
      .filter(Boolean)
      .join("; ");

    if (errors) {
      return ` - ${errors}`;
    }

    return body.message ? ` - ${body.message}` : "";
  } catch {
    return "";
  }
}
