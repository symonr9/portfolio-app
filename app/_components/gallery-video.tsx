"use client";

import {
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";

type GalleryVideoProps = {
  height: number | null;
  title: string;
  url: string;
  width: number | null;
};

export function GalleryVideo({
  height,
  title,
  url,
  width,
}: GalleryVideoProps) {
  const [portrait, setPortrait] = useState(
    Boolean(width && height && height > width),
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video?.videoWidth && video.videoHeight) {
      setPortrait(video.videoHeight > video.videoWidth);
    }
  }, []);

  function handleLoadedMetadata(event: SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    setPortrait(video.videoHeight > video.videoWidth);
  }

  return (
    <div
      className={[
        "flex h-full min-h-0 w-full items-center justify-center bg-foreground/5",
        portrait ? "p-3" : "",
      ].join(" ")}
    >
      <video
        aria-label={title ? `${title} video` : "Gallery video"}
        className={
          portrait
            ? "h-full min-h-0 w-auto max-w-full rounded-sm object-contain"
            : "h-full min-h-0 w-full object-contain"
        }
        controls
        height={height ?? undefined}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
        ref={videoRef}
        src={url}
        width={width ?? undefined}
      >
        <a href={url}>Open video</a>
      </video>
    </div>
  );
}
