import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/blocks";
import { config } from "@/config";
import { selectedFontKeys } from "@/config/theme-css";
import { content, fill, imageText } from "@/content";
import { fontRegistry, type FontKey } from "@/fonts";
import { images } from "@/content/images";
import { pageMetadata, requirePage } from "@/lib/page";
import styles from "./credits.module.css";

export const metadata = pageMetadata("credits");

/** "Arima (SIL Open Font License), Hind Madurai (…)" for the fonts the theme selects. */
function fontsInUse() {
  const entries = selectedFontKeys(config.theme).map((key) => fontRegistry[key as FontKey]);
  const unique = [...new Map(entries.map((e) => [e.name, e])).values()];
  return unique.map((e) => `${e.name} (${e.license})`).join(", ");
}

export default function CreditsPage() {
  requirePage("credits");
  const c = content.credits;
  return (
    <>
      <PageHero page="credits" />
      <Section id="photo-credits">
        <p className={styles.intro}>{c.intro}</p>
        <table className={styles.table} role="table">
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader">
                {c.columns.photo}
              </th>
              <th scope="col" role="columnheader">
                {c.columns.author}
              </th>
              <th scope="col" role="columnheader">
                {c.columns.licence}
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {images.map((image) => (
              <tr key={image.id} role="row">
                <td role="cell" data-label={c.columns.photo}>
                  <a href={image.page} target="_blank" rel="noopener">
                    {imageText(image.id).title}
                  </a>
                </td>
                <td role="cell" data-label={c.columns.author}>
                  {image.author}
                </td>
                <td role="cell" data-label={c.columns.licence}>
                  {image.licenseUrl ? (
                    <a href={image.licenseUrl} target="_blank" rel="noopener license">
                      {image.license}
                    </a>
                  ) : (
                    image.license
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.intro}>{fill(c.fonts, { fonts: fontsInUse() })}</p>
      </Section>
      <Section id="sources" title={c.sourcesTitle} tone="deep" defer>
        <ul className={styles.sources}>
          {content.sources.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
