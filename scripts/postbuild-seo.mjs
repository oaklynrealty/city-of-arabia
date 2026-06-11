import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const seo = {
  canonical: "https://master-community.oaklynrealty.ae/",
  title: "Arancia Yards by BEYOND Dubai | EOI from AED 1M",
  description:
    "Review Arancia Yards by BEYOND in City of Arabia from AED 1M. EOI now open with AED 50K booking. Request details from Oaklyn Realty.",
  image:
    "https://master-community.oaklynrealty.ae/assets/arancia-yards/photos/16-gallery-beach-lagoon-clubhouse.jpg?v=20260610-arancia-yards-info-update",
  locale: "en_AE",
  productId: "arancia-yards-product",
  productName: "Arancia Yards by BEYOND",
  developer: "BEYOND Developments",
  location: "City of Arabia, Dubailand, Dubai",
  price: "1000000",
  currency: "AED",
  alternates: [
    { hreflang: "en-AE", href: "https://master-community.oaklynrealty.ae/" },
    { hreflang: "en", href: "https://master-community.oaklynrealty.ae/" },
    { hreflang: "x-default", href: "https://master-community.oaklynrealty.ae/" },
  ],
};

const landingFiles = ["index.html", "index-en.html", "index-ar.html", "arancia-yards/index.html"];
const targets = landingFiles.flatMap((file) => [path.join(rootDir, file), path.join(distDir, file)]);

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const upsertTag = (html, pattern, tag, afterPattern) =>
  pattern.test(html) ? html.replace(pattern, tag) : html.replace(afterPattern, `$&\n  ${tag}`);

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": "https://oaklynrealty.ae/#organization",
      name: "Oaklyn Realty",
      legalName: "Oaklyn Real Estate L.L.C.",
      url: "https://oaklynrealty.ae",
      logo: "https://oaklynrealty.com/wp-content/uploads/2026/05/logo_landscape.png",
      telephone: "+971585835230",
      email: "sales@oaklynrealty.ae",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Oxford Tower, Office 607, 6th Floor, Business Bay, Dubai, UAE",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
    },
    {
      "@type": "Product",
      "@id": `${seo.canonical}#${seo.productId}`,
      name: seo.productName,
      description: seo.description,
      image: seo.image,
      brand: {
        "@type": "Organization",
        name: seo.developer,
      },
      category: "Dubai real estate project",
      areaServed: {
        "@type": "Place",
        name: seo.location,
      },
      offers: {
        "@type": "Offer",
        url: seo.canonical,
        price: seo.price,
        priceCurrency: seo.currency,
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${seo.canonical}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Oaklyn Realty", item: "https://oaklynrealty.ae" },
        { "@type": "ListItem", position: 2, name: seo.productName, item: seo.canonical },
      ],
    },
  ],
};

const schemaHtml = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2).replaceAll("</script", "<\\/script")}\n</script>`;
const hreflangHtml = seo.alternates
  .map((item) => `<link rel="alternate" hreflang="${escapeHtml(item.hreflang)}" href="${escapeHtml(item.href)}">`)
  .join("\n  ");

const applySeo = (html) => {
  let next = html;
  next = upsertTag(next, /<meta name="robots" content="[^"]*">/, '<meta name="robots" content="index, follow">', /<meta name="viewport"[^>]*>/);
  next = upsertTag(next, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`, /<meta name="robots"[^>]*>|<meta name="viewport"[^>]*>/);
  next = upsertTag(
    next,
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    /<title>[\s\S]*?<\/title>/,
  );
  next = upsertTag(next, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${seo.canonical}">`, /<meta name="author"[^>]*>|<meta name="description"[^>]*>/);
  next = next.replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+">\n?/g, "\n");
  next = next.replace(/(<link rel="canonical" href="[^"]+">\s*)/, `$1\n  ${hreflangHtml}\n  `);
  next = upsertTag(next, /<meta property="og:type" content="[^"]*">/, '<meta property="og:type" content="website">', /<link rel="alternate"[^>]*>|<link rel="canonical"[^>]*>/);
  next = upsertTag(next, /<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="${seo.locale}">`, /<meta property="og:type"[^>]*>/);
  next = upsertTag(next, /<meta property="og:site_name" content="[^"]*">/, '<meta property="og:site_name" content="Oaklyn Realty">', /<meta property="og:locale"[^>]*>/);
  next = upsertTag(next, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(seo.title)}">`, /<meta property="og:site_name"[^>]*>/);
  next = upsertTag(next, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(seo.description)}">`, /<meta property="og:title"[^>]*>/);
  next = upsertTag(next, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${seo.canonical}">`, /<meta property="og:description"[^>]*>/);
  next = upsertTag(next, /<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${seo.image}">`, /<meta property="og:url"[^>]*>/);
  next = upsertTag(next, /<meta name="twitter:card" content="[^"]*">/, '<meta name="twitter:card" content="summary_large_image">', /<meta property="og:image"[^>]*>/);
  next = upsertTag(next, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`, /<meta name="twitter:card"[^>]*>/);
  next = upsertTag(next, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`, /<meta name="twitter:title"[^>]*>/);
  next = upsertTag(next, /<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${seo.image}">`, /<meta name="twitter:description"[^>]*>/);
  if (!next.includes(`#${seo.productId}`)) {
    next = next.replace(/(<link href="https:\/\/unpkg\.com\/boxicons@2\.1\.4\/css\/boxicons\.min\.css" rel="stylesheet">)/, `${schemaHtml}\n  $1`);
  }
  return next;
};

for (const target of targets) {
  try {
    await writeFile(target, applySeo(await readFile(target, "utf8")));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

console.log("Applied Arancia Yards SEO post-build fixes.");
