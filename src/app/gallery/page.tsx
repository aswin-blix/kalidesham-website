import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { Photo, PhotoCredit } from "@/components/Photo";
import { NextPageLink, Section } from "@/components/blocks";
import { config } from "@/config";
import { content, imageText } from "@/content";
import { images } from "@/content/images";
import { pageMetadata, requirePage } from "@/lib/page";

export const metadata = pageMetadata("gallery");

export default function GalleryPage() {
  requirePage("gallery");
  const g = content.gallery;
  const { motion } = config.theme;
  const items = images
    .filter((image) => image.inGallery)
    .map((image, index) => ({
      id: image.id,
      category: image.category,
      title: imageText(image.id).title,
      // The first thumbnail is the page's largest above-the-fold image on phones.
      thumb: (
        <Photo id={image.id} sizes="(max-width: 40rem) 92vw, (max-width: 64rem) 46vw, 24rem" priority={index === 0} />
      ),
      full: <Photo id={image.id} cover sizes="90vw" />,
      credit: <PhotoCredit id={image.id} />,
    }));

  return (
    <>
      <PageHero page="gallery" />
      <Section id="photos">
        <GalleryGrid
          items={items}
          animate={motion.enabled && motion.gallery}
          speed={motion.speed}
          labels={{
            filter: g.filterLabel,
            all: g.all,
            categories: g.categories,
            close: g.close,
            previous: g.previous,
            next: g.next,
            counter: g.counter,
          }}
        />
      </Section>
      <NextPageLink current="gallery" />
    </>
  );
}
