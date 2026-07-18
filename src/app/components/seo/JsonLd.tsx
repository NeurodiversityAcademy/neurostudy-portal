interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Renders JSON-LD; `JSON.stringify` plus `<` escape prevents script-breakout XSS. */
export default function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: json }} />;
}
