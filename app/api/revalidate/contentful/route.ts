import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

const CONTENTFUL_TAG = "contentful";

export async function POST(request: NextRequest) {
  const secret = process.env.CONTENTFUL_REVALIDATE_SECRET;

  if (!secret) {
    return Response.json(
      {
        revalidated: false,
        message: "Missing CONTENTFUL_REVALIDATE_SECRET.",
      },
      { status: 500 },
    );
  }

  if (!isAuthorized(request, secret)) {
    return Response.json(
      {
        revalidated: false,
        message: "Invalid revalidation secret.",
      },
      { status: 401 },
    );
  }

  revalidateTag(CONTENTFUL_TAG, { expire: 0 });

  return Response.json({
    revalidated: true,
    tag: CONTENTFUL_TAG,
    now: Date.now(),
  });
}

function isAuthorized(request: NextRequest, secret: string) {
  const authorization = request.headers.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
  const headerSecret = request.headers.get("x-contentful-webhook-secret");
  const querySecret = request.nextUrl.searchParams.get("secret");

  return [bearerToken, headerSecret, querySecret].some(
    (candidate) => candidate === secret,
  );
}
