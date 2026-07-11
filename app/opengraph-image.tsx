import { ImageResponse } from "next/og";
import { defaultDescription, siteName } from "@/lib/site";
import { colorScheme } from "@/lib/theme";

export const alt = "Portfolio site preview";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: colorScheme.background,
          color: colorScheme.foreground,
          display: "flex",
          height: "100%",
          padding: 72,
          width: "100%",
        }}
      >
        <div
          style={{
            border: `2px solid ${colorScheme.borderStrong}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
            width: "100%",
          }}
        >
          <div
            style={{
              color: colorScheme.accentText,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {siteName}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                fontSize: 88,
                fontWeight: 700,
                lineHeight: 1,
                maxWidth: 860,
              }}
            >
              Personal portfolio
            </div>
            <div
              style={{
                color: colorScheme.muted,
                fontSize: 34,
                lineHeight: 1.35,
                maxWidth: 900,
              }}
            >
              {defaultDescription}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
