import { draftMode } from "next/headers";
import type { ContentfulRequestOptions } from "./graphql";

export async function getContentfulDraftOptions(): Promise<ContentfulRequestOptions> {
  const { isEnabled } = await draftMode();

  return {
    preview: isEnabled,
    revalidate: isEnabled ? 0 : undefined,
  };
}
