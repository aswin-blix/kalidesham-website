import Image from "next/image";
import { config } from "@/config";
import { content, imageText } from "@/content";
import { getImage, type ImageId } from "@/content/images";

type PhotoProps = {
  id: ImageId;
  /** Tell the browser how wide the image renders so it picks the right file. */
  sizes: string;
  className?: string;
  /** Fill the positioned parent instead of using the photo's own aspect ratio. */
  cover?: boolean;
  /**
   * The page's largest above-the-fold image (its LCP element). Loads eagerly at high
   * fetch priority so it isn't queued behind fonts and scripts.
   */
  priority?: boolean;
  /** Override the manifest alt text, or "" for purely decorative use. */
  alt?: string;
  objectPosition?: string;
};

/** Self-hosted Commons photo with blur placeholder and correct alt text. */
export function Photo({ id, sizes, className, cover, priority, alt, objectPosition }: PhotoProps) {
  const image = getImage(id);
  const altText = alt ?? imageText(id).alt;
  const shared = {
    src: image.localSrc,
    sizes,
    className,
    quality: priority ? config.theme.images.heroQuality : config.theme.images.quality,
    ...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {}),
    placeholder: image.blurDataURL ? ("blur" as const) : ("empty" as const),
    blurDataURL: image.blurDataURL,
    style: objectPosition ? { objectPosition } : undefined,
  };
  return cover ? (
    <Image {...shared} alt={altText} fill />
  ) : (
    <Image {...shared} alt={altText} width={image.width} height={image.height} />
  );
}

/**
 * Attribution required by the CC licences, linking to the Commons file page.
 * Hidden when features.inlinePhotoCredits is off (the credits page then carries it).
 */
export function PhotoCredit({ id, className }: { id: ImageId; className?: string }) {
  if (!config.features.inlinePhotoCredits) return null;
  const image = getImage(id);
  return (
    <p className={className ? `credit ${className}` : "credit"}>
      <a href={image.page} rel="noopener" target="_blank">
        {content.ui.photoCredit(image.author, image.license)}
      </a>
    </p>
  );
}
