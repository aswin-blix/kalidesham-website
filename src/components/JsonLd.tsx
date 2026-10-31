import { config } from "@/config";

/** Structured data for search engines. Renders nothing when features.structuredData is off. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  if (!config.features.structuredData) return null;
  return (
    <script
      type="application/ld+json"
      // Built from our own config and content; escape "<" so it can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

