import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { project, arabicProject } from "../src/project-data.mjs";
import { GTM_CONTAINER_ID } from "../shared/gtm.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const trimSlashes = (value = "") => String(value).replace(/^\/+|\/+$/g, "");

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const publicRoutePath = trimSlashes(project.publicRoutePath || project.routePath);
const publicThankYouPath = trimSlashes(project.publicThankYouPath || "thank-you");
const englishInternalRoutePath = trimSlashes(project.routePath);
const englishInternalThankYouPath = trimSlashes(project.alternateThankYouPath);
const arabicInternalRoutePath = trimSlashes(arabicProject.routePath);
const arabicInternalThankYouPath = trimSlashes(arabicProject.alternateThankYouPath);
const linkHubRoutePath = trimSlashes(project.linkHub?.routePath);

const requiredFiles = [
  "index.html",
  "index-en.html",
  "index-ar.html",
  "styles.css",
  "client.js",
  `${publicRoutePath}/index.html`,
  `${publicThankYouPath}/index.html`,
  `${englishInternalRoutePath}/index.html`,
  `${englishInternalThankYouPath}/index.html`,
  `${arabicInternalRoutePath}/index.html`,
  `${arabicInternalThankYouPath}/index.html`,
];

if (linkHubRoutePath) {
  requiredFiles.push(`${linkHubRoutePath}/index.html`);
}

for (const file of requiredFiles) {
  await stat(path.join(distDir, file));
}

for (const file of ["index.html", "index-en.html", "index-ar.html"]) {
  await stat(path.join(rootDir, file));
}

const clientJs = await readFile(path.join(distDir, "client.js"), "utf8");
const stylesCss = await readFile(path.join(distDir, "styles.css"), "utf8");
const genericConversionPushes = clientJs.match(/event:\s*"conversion"/g) || [];
assert(genericConversionPushes.length === 0, "client.js: generic conversion event should not be used for ad-platform conversions");
assert(!clientJs.includes('window.dataLayer.push({ event: "conversion" })'), "client.js: bare conversion push should not exist");

for (const term of [
  'event: "lead_success"',
  'conversion_action: "form_submission"',
  "lead_email",
  "lead_phone",
  "lead_first_name",
  "lead_last_name",
  "meta_advanced_matching",
  "form_submission_confirmed"
]) {
  assert(clientJs.includes(term), `client.js: missing confirmed Lead advanced matching term ${term}`);
}

assert(!clientJs.includes('event: "phone_call_click"'), "client.js: call tracking should not be enabled");
assert(!clientJs.includes("whatsappModalStatus"), "client.js: WhatsApp modal progress state should not exist");
assert(!clientJs.includes("startWhatsAppProgressState"), "client.js: WhatsApp should use full-screen verification instead of modal progress");
assert(!clientJs.includes("whatsapp_progress"), "client.js: WhatsApp modal progress config should not be used");
assert(clientJs.includes('event: "whatsapp_cta_conversion"'), "client.js: WhatsApp should push direct CTA conversion event");
assert(!clientJs.includes("openWhatsAppModal(target);"), "client.js: WhatsApp clicks should not open a modal");

const validateJsonLd = (html, file, minimumBlocks = 3) => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)];
  assert(blocks.length >= minimumBlocks, `${file}: expected at least ${minimumBlocks} JSON-LD block(s)`);
  for (const [, block] of blocks) JSON.parse(block);
};

const sharedTrackingTerms = [
  "project_name",
  "project_slug",
  "source_page",
  "landing_page_url",
  "thank_you_page_url",
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "lead_conversion_thank_you",
  "lead_blocked",
  "lead_blacklist_error",
  "dataLayer",
  "preferred_unit",
  "inquiry_type",
  "current_language",
  "fbclid",
  "ttclid",
  "ScCid",
  "li_fat_id",
  "rdt_cid",
];

const whatsappTrackingTerms = [
  "whatsapp_cta_click",
  "whatsapp_cta_conversion",
  "data-whatsapp-cta",
  "destination_url",
  "cta_location",
];

const requiredVisibleFields = [
  'name="phone"',
  'name="phone_country_code"',
  'name="email"',
  'name="preferred_project"',
  'name="property_type"',
];

const forbiddenSensitiveFields = [
  'name="passport"',
  'name="emirates_id"',
  'name="salary"',
  'name="dob"',
  'name="date_of_birth"',
  'name="nationality"',
  'name="religion"',
  'name="health"',
];

const standaloneRootHtml = await readFile(path.join(distDir, "index.html"), "utf8");
assert(standaloneRootHtml.includes("window.OAKLYN_LANDING_CONFIG"), "index.html: missing landing config");
assert(standaloneRootHtml.includes('lang="en"'), "index.html: root page should be English");
assert(standaloneRootHtml.includes('dir="ltr"'), "index.html: root page should be LTR");
assert(standaloneRootHtml.includes('"language_prompt_enabled": false'), "index.html: public page should not use language popup");
assert(standaloneRootHtml.includes('"language_switcher_enabled": false'), "index.html: language switcher should be disabled");
assert(standaloneRootHtml.includes('"language_routes"'), "index.html: missing language route config");
assert(standaloneRootHtml.includes('"/index.html"'), "index.html: missing standalone English route");
assert(standaloneRootHtml.includes('"/index-ar.html"'), "index.html: missing standalone Arabic route");
assert(standaloneRootHtml.includes(GTM_CONTAINER_ID), "index.html: missing GTM container");
assert(!standaloneRootHtml.includes("data-language-choice-overlay"), "index.html: public page should not render language popup");

const standaloneEnglishHtml = await readFile(path.join(distDir, "index-en.html"), "utf8");
assert(standaloneEnglishHtml.includes('lang="en"'), "index-en.html: missing lang=en");
assert(standaloneEnglishHtml.includes(project.name), "index-en.html: missing English project name");

for (const file of [`${publicRoutePath}/index.html`]) {
  const html = await readFile(path.join(distDir, file), "utf8");
  assert(html.includes("window.OAKLYN_LANDING_CONFIG"), `${file}: missing landing config`);
  assert(html.includes('"language_prompt_enabled": false'), `${file}: public page should not use language popup`);
  assert(html.includes('"language_switcher_enabled": false'), `${file}: language switcher should be disabled`);
  assert(html.includes('"language_routes"'), `${file}: missing language route config`);
  assert(html.includes(`/${englishInternalRoutePath}/`), `${file}: missing English internal route`);
  assert(html.includes(`/${arabicInternalRoutePath}/`), `${file}: missing Arabic internal route`);
  assert(html.includes(GTM_CONTAINER_ID), `${file}: missing GTM container`);
  assert(!html.includes("data-language-choice-overlay"), `${file}: public page should not render language popup`);
}

for (const file of [`${publicThankYouPath}/index.html`]) {
  const html = await readFile(path.join(distDir, file), "utf8");
  assert(html.includes(GTM_CONTAINER_ID), `${file}: missing public thank-you GTM container`);
  assert(html.includes("lead_thank_you_page_view"), `${file}: missing public thank-you pageview event`);
  assert(!html.includes("lead_conversion_thank_you"), `${file}: public thank-you page should not fire conversion for inline-success flow`);
}

const landingFiles = [
  "index.html",
  "index-ar.html",
  `${publicRoutePath}/index.html`,
  `${englishInternalRoutePath}/index.html`,
  `${arabicInternalRoutePath}/index.html`,
];

for (const file of landingFiles) {
  const html = await readFile(path.join(distDir, file), "utf8");
  assert(html.includes(project.webhookUrl), `${file}: missing form webhook URL`);
  assert(html.includes(project.whatsappWebhookUrl), `${file}: missing WhatsApp webhook URL`);
  assert(html.includes("wa.me/971505886769"), `${file}: missing correct WhatsApp number`);
  assert(!html.includes("wa.me/971585835230"), `${file}: WhatsApp should not use call number`);
  assert(!html.includes("whatsapp-modal-status"), `${file}: should not render WhatsApp modal progress section`);
  assert(!html.includes("whatsapp_progress"), `${file}: should not include unused WhatsApp progress config`);
  assert(html.includes(GTM_CONTAINER_ID), `${file}: missing GTM container`);
  assert(html.includes('name="full_name"'), `${file}: missing full name field`);

  for (const field of requiredVisibleFields) {
    assert(html.includes(field), `${file}: missing compliant form field ${field}`);
  }

  for (const field of forbiddenSensitiveFields) {
    assert(!html.toLowerCase().includes(field), `${file}: sensitive field should not exist ${field}`);
  }

  for (const term of sharedTrackingTerms) {
    assert(html.includes(term) || clientJs.includes(term), `${file}: missing tracking term ${term}`);
  }

  for (const term of whatsappTrackingTerms) {
    assert(html.includes(term) || clientJs.includes(term), `${file}: missing WhatsApp term ${term}`);
  }

  assert(html.includes('data-whatsapp-cta'), `${file}: missing WhatsApp CTA`);
  assert(!html.includes('data-whatsapp-modal'), `${file}: WhatsApp modal should not be rendered`);
  assert(html.includes('name="fbclid"'), `${file}: missing Meta click ID hidden field`);
  assert(html.includes('name="ttclid"'), `${file}: missing TikTok click ID hidden field`);
  assert(html.includes('name="ScCid"'), `${file}: missing Snapchat click ID hidden field`);
  assert(html.includes('name="li_fat_id"'), `${file}: missing LinkedIn click ID hidden field`);
  assert(html.includes('name="rdt_cid"'), `${file}: missing Reddit click ID hidden field`);
  assert(html.includes('"language_switcher_enabled": false'), `${file}: language switcher should be disabled`);
  validateJsonLd(html, file);
}

const englishLandingHtml = await readFile(path.join(distDir, `${englishInternalRoutePath}/index.html`), "utf8");
assert(englishLandingHtml.includes(project.name), "English internal route: missing project name");
assert(englishLandingHtml.includes(`lang="en"`), "English internal route: missing lang=en");
assert(englishLandingHtml.includes(project.landingPageUrl), "English internal route: missing public landing URL");

const arabicLandingHtml = await readFile(path.join(distDir, `${arabicInternalRoutePath}/index.html`), "utf8");
assert(arabicLandingHtml.includes(arabicProject.name), "Arabic internal route: missing Arabic project name");
assert(arabicLandingHtml.includes('lang="ar"'), "Arabic internal route: missing lang=ar");
assert(arabicLandingHtml.includes('dir="rtl"'), "Arabic internal route: missing dir=rtl");

const standaloneArabicHtml = await readFile(path.join(distDir, "index-ar.html"), "utf8");
assert(standaloneArabicHtml.includes('lang="ar"'), "Standalone Arabic file: missing lang=ar");
assert(standaloneArabicHtml.includes('dir="rtl"'), "Standalone Arabic file: missing dir=rtl");
assert(stylesCss.includes("Cairo"), "Stylesheet: missing Cairo font");
assert(standaloneArabicHtml.includes(project.name), "Standalone Arabic file: missing project title");
assert(standaloneArabicHtml.includes("Chat on WhatsApp"), "Standalone Arabic file: missing WhatsApp CTA");
assert(standaloneArabicHtml.includes("Verifying your information"), "Standalone Arabic file: missing verification copy");

for (const file of [`${publicThankYouPath}/index.html`, `${englishInternalThankYouPath}/index.html`, `${arabicInternalThankYouPath}/index.html`]) {
  const html = await readFile(path.join(distDir, file), "utf8");
  assert(html.includes(GTM_CONTAINER_ID), `${file}: missing GTM container`);
  assert(html.includes("lead_thank_you_page_view"), `${file}: missing thank-you pageview event`);
  assert(!html.includes("lead_conversion_thank_you"), `${file}: thank-you page should not fire conversion for inline-success flow`);
  assert(html.includes("event_id"), `${file}: missing event_id`);
  assert(html.includes("lead_id"), `${file}: missing lead_id`);
  validateJsonLd(html, file);
}

const arabicThankYouHtml = await readFile(path.join(distDir, `${arabicInternalThankYouPath}/index.html`), "utf8");
assert(arabicThankYouHtml.includes('lang="ar"'), "Arabic internal thank-you: missing lang=ar");
assert(arabicThankYouHtml.includes('dir="rtl"'), "Arabic internal thank-you: missing dir=rtl");

if (linkHubRoutePath) {
  const html = await readFile(path.join(distDir, `${linkHubRoutePath}/index.html`), "utf8");
  assert(html.includes(project.linkHub.seo.title), "Link hub: missing SEO title");
  assert(html.includes(project.linkHub.profile.title), "Link hub: missing heading");
  assert(html.includes("link-hub-card"), "Link hub: missing cards");
  validateJsonLd(html, `${linkHubRoutePath}/index.html`, 2);
}

console.log(`All checks passed for ${project.name} one-url bilingual build.`);
