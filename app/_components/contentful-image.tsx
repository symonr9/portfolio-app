import Image from "next/image";
import type { ContentfulImage as ContentfulImageData } from "@/lib/contentful";

type ContentfulImageProps = {
  image: ContentfulImageData;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ContentfulImage({
  image,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: ContentfulImageProps) {
  return (
    <Image
      alt={image.description ?? image.title}
      className={className}
      height={image.height}
      priority={priority}
      sizes={sizes}
      src={image.url}
      width={image.width}
    />
  );
}

export function MediaPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-[linear-gradient(135deg,var(--accent),var(--foreground))] ${className}`}
    />
  );
}
