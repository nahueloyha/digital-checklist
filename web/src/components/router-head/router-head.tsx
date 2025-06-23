import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      {/* Basics */}
      <title>{head.title || 'Digital Checklist - Personal digital checklist to secure your digital life'}</title>
      <meta name="description" content="Personal digital checklist to secure your digital life" />
      
      {/* Site config */}
      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <meta name="theme-color" content="#6419e6" />
      <link rel="manifest" href="/manifest.json" />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="Digital Checklist" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://digital-defense.io/" />
      <meta property="og:title" content="Digital Checklist - Personal digital checklist to secure your digital life" />
      <meta property="og:description" content="A free, open source, community-maintained checklist of digital security best practices" />
      <meta property="og:image" content="https://i.ibb.co/rGQK71g/personal-security-checklist-6.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Lissy_Sykes" />
      <meta name="twitter:title" content="Digital Checklist - Personal digital checklist to secure your digital life" />
      <meta name="twitter:description" content="A free, open source, community-maintained checklist of digital security best practices" />
      <meta name="twitter:image" content="https://i.ibb.co/rGQK71g/personal-security-checklist-6.png" />
      <meta name="twitter:image:alt" content="Personal Security Checklist" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}

      {head.scripts.map((s) => (
        <script key={s.key} {...s.props} dangerouslySetInnerHTML={s.script} />
      ))}
      <script defer data-domain="digital-defense.io" src="https://no-track.as93.net/js/script.js"></script>
    </>
  );
});
