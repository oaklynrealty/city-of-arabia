import { cp, mkdir, rm, writeFile, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { project as landingProject } from "../src/project-data.mjs";
import { renderGtmBody, renderGtmHead } from "../shared/gtm.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

let project = landingProject;
let company = project.brand;

const setProject = (nextProject) => {
  project = nextProject;
  company = project.brand;
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderHeadline = (value = "") =>
  escapeHtml(value)
    .split("\n")
    .join("<br>");

const json = (data) => JSON.stringify(data, null, 2).replaceAll("</script", "<\\/script");
const renderJsonLd = (data) => `<script type="application/ld+json">\n${json(data)}\n</script>`;
const trimSlashes = (value = "") => String(value).replace(/^\/+|\/+$/g, "");
const digitsOnly = (value = "") => String(value).replace(/[^\d]/g, "");

const getClientConfig = () => ({
  project_name: project.name,
  project_slug: project.slug,
  source_page: project.sourcePage,
  landing_page_url: project.landingPageUrl,
  thank_you_page_url: project.thankYouPageUrl,
  webhook_url: project.webhookUrl,
  blacklist_check_url: project.blacklistCheckUrl || "",
  blacklist_timeout_ms: Number(project.blacklistTimeoutMs) || 8000,
  blacklist_block_message: project.form.blacklistBlockedMessage || "Thank you. Your inquiry has already been received.",
  blacklist_error_message: project.form.blacklistErrorMessage || "We could not verify your enquiry right now. Please try again in a moment.",
  form_consent: project.form.consent,
  split_name: Boolean(project.form.splitName),
});

const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": "https://oaklynrealty.ae/#organization",
  name: company.legalName,
  alternateName: company.company,
  url: company.mainWebsite,
  logo: company.logo,
  image: company.logo,
  telephone: company.phoneHref,
  email: company.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.office,
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  identifier: [
    { "@type": "PropertyValue", propertyID: "DED Licence", value: "1589593" },
    { "@type": "PropertyValue", propertyID: "RERA ORN", value: "59210" },
  ],
});

const getWebpageSchema = (canonical) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: canonical,
  name: project.seo.title,
  description: project.seo.description,
  inLanguage: "en",
  about: { "@id": "https://oaklynrealty.ae/#organization" },
  publisher: { "@id": "https://oaklynrealty.ae/#organization" },
});

const getListingSchema = (canonical) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  url: canonical,
  name: project.name,
  description: project.seo.description,
  brokerage: { "@id": "https://oaklynrealty.ae/#organization" },
  broker: { "@id": "https://oaklynrealty.ae/#organization" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  regulator: {
    "@type": "GovernmentOrganization",
    name: "Dubai Land Department",
  },
  identifier: [
    {
      "@type": "PropertyValue",
      propertyID: "Trakheesi Permit",
      value: "[ADD TRAKHEESI PERMIT]",
    },
  ],
});

const getWhatsAppHref = () => {
  const phone = digitsOnly(company.phoneHref);
  const message =
    project.form.whatsappPrefill ||
    `Hello, I would like the latest details for ${project.name}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

const renderHead = ({ title, description, canonical, noindex = false, preloadImage = "" }) => `  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${noindex ? '<meta name="robots" content="noindex, nofollow">' : ""}
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${preloadImage ? `<link rel="preload" as="image" href="${escapeHtml(preloadImage)}">` : ""}
  ${renderGtmHead(project.tracking, escapeHtml)}
  ${renderJsonLd(getOrganizationSchema())}
  ${renderJsonLd(getWebpageSchema(canonical))}
  ${renderJsonLd(getListingSchema(canonical))}
  <link rel="stylesheet" href="/styles.css?v=${escapeHtml(project.assetVersion)}">`;

const renderNav = () => `
  <header class="topbar">
    <div class="shell nav">
      <a class="brand" href="/" aria-label="${escapeHtml(company.company)} ${escapeHtml(project.name)} landing page">
        <img src="${escapeHtml(company.logo)}" alt="${escapeHtml(company.company)}">
        <span>${escapeHtml(project.navLabel || project.name)}</span>
      </a>
      <div class="nav-actions">
        <a class="nav-phone" href="tel:${escapeHtml(company.phoneHref)}">${escapeHtml(company.phoneDisplay)}</a>
        <a class="btn btn-primary" href="#contact">Enquire</a>
      </div>
    </div>
  </header>`;

const renderFooter = () => `
  <footer class="site-footer">
    <div class="shell footer-panel" data-reveal>
      <div class="footer-grid">
        <div>
          <strong>${escapeHtml(company.company)}</strong>
          <p>${escapeHtml(company.company)} helps buyers review live launch pricing, payment-plan structure, and next-step guidance with a clearer Dubai real estate perspective.</p>
        </div>
        <div>
          <strong>Contact</strong>
          <p>${escapeHtml(company.office)}</p>
          <p><a href="tel:${escapeHtml(company.phoneHref)}">${escapeHtml(company.phoneDisplay)}</a><br><a href="mailto:${escapeHtml(company.email)}">${escapeHtml(company.email)}</a></p>
        </div>
        <div>
          <strong>Legal</strong>
          <div class="footer-links">
            <a href="${escapeHtml(company.contactUrl)}">Contact</a>
            <a href="${escapeHtml(company.privacyUrl)}">Privacy Policy</a>
            <a href="${escapeHtml(company.termsUrl)}">Terms & Conditions</a>
          </div>
        </div>
      </div>
      <p class="copyright">Copyright © ${new Date().getFullYear()} ${escapeHtml(company.legalName)}. All details remain subject to developer confirmation.</p>
    </div>
  </footer>`;

const renderHeroVisual = () => {
  const slides = project.heroSlides?.length ? project.heroSlides : [{ image: project.hero.background, label: project.hero.title }];
  return `<div class="hero-media" data-hero-slider data-hero-parallax>
      ${slides
        .map(
          (slide, index) => `<figure class="hero-slide${index === 0 ? " is-active" : ""}" aria-hidden="${index === 0 ? "false" : "true"}">
          <img src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.label)}" ${index === 0 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">
        </figure>`,
        )
        .join("\n      ")}
    </div>`;
};

const renderHeroBadges = () =>
  (project.hero.badges || [])
    .map((item) => `<span class="hero-badge">${escapeHtml(item)}</span>`)
    .join("");

const renderHeroPanel = () =>
  project.highlights
    .slice(0, 4)
    .map(
      (item) => `<article class="hero-panel-item">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </article>`,
    )
    .join("");

const renderHighlights = () =>
  project.highlights
    .slice(0, 4)
    .map(
      (item) => `<article class="highlight-card" data-reveal>
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </article>`,
    )
    .join("");

const renderFeatureItems = (items = []) =>
  items
    .map(
      (item) => `<article class="feature-card" data-reveal>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.text)}</p>
        </article>`,
    )
    .join("");

const renderPlanCards = () =>
  (project.paymentPlan?.steps || [])
    .map(
      (item) => `<article class="plan-card" data-reveal>
          <span>${escapeHtml(item.label)}</span>
          <strong class="plan-value">${escapeHtml(item.value)}</strong>
          <p>${escapeHtml(item.note)}</p>
        </article>`,
    )
    .join("");

const renderGallerySlides = () =>
  project.gallery.items
    .map(
      (item, index) => `<figure class="gallery-slide${index === 0 ? " is-active" : ""}" aria-hidden="${index === 0 ? "false" : "true"}" data-gallery-slide>
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" ${index === 0 ? 'loading="eager"' : 'loading="lazy"'} decoding="async">
            <figcaption class="gallery-caption">
              <span>${escapeHtml(item.eyebrow)}</span>
              <strong>${escapeHtml(item.title)}</strong>
            </figcaption>
          </figure>`,
    )
    .join("");

const renderGalleryDots = () =>
  project.gallery.items
    .map(
      (_, index) => `<button class="gallery-dot${index === 0 ? " is-active" : ""}" type="button" aria-label="Go to gallery image ${index + 1}" aria-pressed="${index === 0 ? "true" : "false"}" data-gallery-dot></button>`,
    )
    .join("");

const renderSnapshotItems = () =>
  project.snapshot.items
    .map(
      (item) => `<article class="amenity-card" data-reveal>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.text)}</p>
        </article>`,
    )
    .join("");

const renderLocationBullets = () =>
  project.location.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

const renderLocationHighlights = () =>
  (project.location.highlights || [])
    .map((item) => `<span class="location-pill">${escapeHtml(item)}</span>`)
    .join("");

const renderComplianceCards = () =>
  project.trustPoints
    .map(
      (item) => `<article class="trust-card" data-reveal>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.text)}</p>
        </article>`,
    )
    .join("");

const renderFaq = () => {
  if (!project.faq?.length) return "";
  return `<section class="section faq-section">
      <div class="shell">
        <div class="section-header section-header-centered" data-reveal>
          <span class="eyebrow">FAQ</span>
          <h2 class="section-title">Quick answers before you enquire</h2>
        </div>
        <div class="faq-grid">
          ${project.faq
            .map(
              (item) => `<article class="faq-card" data-reveal>
              <strong>${escapeHtml(item.question)}</strong>
              <p>${escapeHtml(item.answer)}</p>
            </article>`,
            )
            .join("")}
        </div>
      </div>
    </section>`;
};

const renderOptions = (items, placeholder = "") =>
  [
    placeholder ? `<option value="">${escapeHtml(placeholder)}</option>` : "",
    ...items.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`),
  ].join("");

const getDefaultPhoneCountry = () =>
  project.form.phoneCountries?.[0] || { flag: "🇦🇪", label: "United Arab Emirates", dialCode: "+971" };

const renderPhoneCountryPicker = () => {
  const defaultCountry = getDefaultPhoneCountry();

  return `<div class="country-picker" data-country-picker>
      <input id="landing_phone_country" name="phone_country_code" type="hidden" value="${escapeHtml(defaultCountry.dialCode)}">
      <button
        class="country-picker-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="false"
        data-country-picker-trigger
      >
        <span class="country-picker-current">
          <span class="country-picker-flag" data-country-picker-flag>${escapeHtml(defaultCountry.flag)}</span>
          <span class="country-picker-label" data-country-picker-label>${escapeHtml(defaultCountry.label)}</span>
          <span class="country-picker-code" data-country-picker-code>${escapeHtml(defaultCountry.dialCode)}</span>
        </span>
        <span class="country-picker-chevron" aria-hidden="true">▾</span>
      </button>
      <div class="country-picker-panel" data-country-picker-panel hidden>
        <label class="sr-only" for="landing_phone_country_search">Search country or code</label>
        <input
          id="landing_phone_country_search"
          class="country-picker-search"
          type="search"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          enterkeyhint="search"
          placeholder="Type exact code or country"
          data-country-picker-search
        >
        <div class="country-picker-list" role="listbox" data-country-picker-list>
          ${project.form.phoneCountries
            .map(
              (item, index) => `<button
              class="country-picker-option${index === 0 ? " is-selected" : ""}"
              type="button"
              role="option"
              aria-selected="${index === 0 ? "true" : "false"}"
              data-country-option
              data-country-flag="${escapeHtml(item.flag)}"
              data-country-label="${escapeHtml(item.label)}"
              data-country-code="${escapeHtml(item.dialCode)}"
              data-country-query="${escapeHtml(`${item.label} ${item.dialCode}`.toLowerCase())}"
            >
              <span class="country-picker-option-flag">${escapeHtml(item.flag)}</span>
              <span class="country-picker-option-label">${escapeHtml(item.label)}</span>
              <span class="country-picker-option-code">${escapeHtml(item.dialCode)}</span>
            </button>`,
            )
            .join("")}
        </div>
        <p class="country-picker-empty" data-country-picker-empty hidden>No country found.</p>
      </div>
    </div>`;
};

const renderProjectRequirementsField = (formLabels) =>
  `<div class="field" id="projectField">
      <label for="landing_preferred_project">${escapeHtml(formLabels.project)}</label>
      <select id="landing_preferred_project" name="preferred_project" required>
        ${renderOptions(project.form.preferredProjects || [], project.form.projectRequirementsPlaceholder || "Select an option")}
      </select>
      <div class="field-error">Please select the project requirement.</div>
    </div>`;

const renderBedroomField = (formLabels) =>
  `<div class="field" id="bedroomField">
      <label for="landing_bedrooms">${escapeHtml(formLabels.bedrooms || "How Many Bedrooms")}</label>
      <select id="landing_bedrooms" name="bedroom_requirement" required>
        ${renderOptions(project.form.bedroomOptions || [], project.form.bedroomPlaceholder || "Select bedroom requirement")}
      </select>
      <div class="field-error">Please select the bedroom requirement.</div>
    </div>`;

const renderMessageField = (formLabels) =>
  `<div class="field field-full" id="messageField">
      <label for="landing_message">${escapeHtml(formLabels.message)}</label>
      <textarea
        id="landing_message"
        name="message"
        rows="4"
        placeholder="${escapeHtml(project.form.messagePlaceholder || "")}"
      ></textarea>
      <div class="field-error">Please enter your comments.</div>
    </div>`;

const getFormLabels = () => ({
  name: "Full Name",
  firstName: "First Name",
  lastName: "Last Name",
  phone: "Phone",
  email: "Email",
  project: "Preferred Project",
  propertyType: "Property Type",
  ...(project.form.labels || {}),
});

const renderNameFields = (formLabels) => {
  if (!project.form.splitName) {
    return `<div class="field" id="nameField">
                <label for="landing_full_name">${escapeHtml(formLabels.name)}</label>
                <input id="landing_full_name" name="full_name" type="text" autocomplete="name" required>
                <div class="field-error">Please enter your name.</div>
              </div>`;
  }

  return `<div class="field" id="firstNameField">
                <label for="landing_first_name">${escapeHtml(formLabels.firstName)}</label>
                <input id="landing_first_name" name="first_name" type="text" autocomplete="given-name" required>
                <div class="field-error">Please enter your first name.</div>
              </div>
              <div class="field" id="lastNameField">
                <label for="landing_last_name">${escapeHtml(formLabels.lastName)}</label>
                <input id="landing_last_name" name="last_name" type="text" autocomplete="family-name" required>
                <div class="field-error">Please enter your last name.</div>
              </div>`;
};

const renderFormPoints = () =>
  (project.form.points || [])
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");

const renderLandingPage = (nextProject) => {
  setProject(nextProject);
  const formLabels = getFormLabels();
  const storyImage = project.gallery.items[6]?.image || project.hero.background;
  const whatsappHref = getWhatsAppHref();

  return `<!doctype html>
<html lang="en">
<head>
${renderHead({
  title: project.seo.title,
  description: project.seo.description,
  canonical: project.landingPageUrl,
  preloadImage: project.hero.background,
})}
  <script>window.OAKLYN_LANDING_CONFIG = ${json(getClientConfig())};</script>
</head>
<body>
${renderGtmBody(project.tracking, escapeHtml)}
${renderNav()}
  <main>
    <section class="hero">
      ${renderHeroVisual()}
      <div class="hero-overlay"></div>
      <div class="shell hero-grid">
        <div class="hero-copy" data-reveal>
          <span class="eyebrow">${escapeHtml(project.hero.eyebrow)}</span>
          <h1>${renderHeadline(project.hero.title)}</h1>
          <p>${escapeHtml(project.hero.subtitle)}</p>
          <div class="hero-badges">
            ${renderHeroBadges()}
          </div>
          <div class="cta-row">
            <a class="btn btn-primary" href="#contact">${escapeHtml(project.hero.primaryCta)}</a>
            <a class="btn btn-ghost" href="${escapeHtml(whatsappHref)}" target="_blank" rel="noopener">${escapeHtml(project.hero.secondaryCta)}</a>
          </div>
        </div>
        <aside class="hero-panel" data-reveal>
          <span class="panel-eyebrow">Launch Snapshot</span>
          <div class="hero-panel-grid">
            ${renderHeroPanel()}
          </div>
          <p>${escapeHtml(project.hero.panelText || "Request the latest price list, 60/40 payment plan, and current unit guidance from Oaklyn Realty.")}</p>
        </aside>
      </div>
    </section>

    <section class="section overview-section" id="vision">
      <div class="shell">
        <div class="section-header" data-reveal>
          <span class="eyebrow">${escapeHtml(project.about.eyebrow)}</span>
          <h2 class="section-title">${escapeHtml(project.about.title)}</h2>
          <p class="section-copy">${escapeHtml(project.about.text)}</p>
        </div>
        <div class="overview-grid">
          <div class="overview-stack">
            <div class="highlight-grid">
              ${renderHighlights()}
            </div>
            <div class="feature-grid compact-feature-grid">
              ${renderFeatureItems(project.residences.items)}
            </div>
          </div>
          <figure class="media-frame overview-media" data-reveal>
            <img src="${escapeHtml(storyImage)}" alt="Architectural detail of the BEYOND community" loading="lazy" decoding="async">
            <figcaption>
              <span>Architectural Feeling</span>
              <strong>Layered balconies, softer materials, and planted edges shape the premium identity.</strong>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section contact-section" id="contact">
      <div class="shell contact-shell">
        <div class="contact-copy" data-reveal>
          <span class="eyebrow">Private Enquiry</span>
          <h2 class="section-title">${escapeHtml(project.form.title)}</h2>
          <p class="section-copy">${escapeHtml(project.form.text)}</p>
          <div class="mini-compliance">
            ${renderFormPoints()}
          </div>
          <div class="contact-card">
            <strong>${escapeHtml(project.form.cardTitle || "Direct Oaklyn follow-up")}</strong>
            <p>${escapeHtml(project.form.cardText || "Your enquiry goes to Oaklyn Realty so you can receive current launch information, clearer next-step guidance, and help comparing available unit types.")}</p>
          </div>
        </div>
        <div class="form-panel" data-reveal>
          <form id="landingLeadForm" novalidate>
            <div class="field-grid">
              ${renderNameFields(formLabels)}
              <div class="field is-phone" id="phoneField">
                <label for="landing_phone">${escapeHtml(formLabels.phone)}</label>
                <div class="phone-input-row">
                  ${renderPhoneCountryPicker()}
                  <input id="landing_phone" name="phone" type="tel" inputmode="tel" autocomplete="off" autocorrect="off" spellcheck="false" maxlength="20" placeholder="050 123 4567" required>
                </div>
                <div class="field-error">Please enter a valid international phone number.</div>
              </div>
              <div class="field" id="emailField">
                <label for="landing_email">${escapeHtml(formLabels.email)}</label>
                <input id="landing_email" name="email" type="email" autocomplete="email" required>
                <div class="field-error">Please enter a valid email address.</div>
              </div>
              ${renderBedroomField(formLabels)}
              ${renderProjectRequirementsField(formLabels)}
              ${renderMessageField(formLabels)}
              <div class="field is-hidden" id="propertyTypeField">
                <input id="landing_property_type" name="property_type" type="hidden" value="${escapeHtml(project.location.title || "Dubailand")}">
              </div>
            </div>
            <input id="landing_gclid" name="gclid" type="hidden">
            <input id="landing_gbraid" name="gbraid" type="hidden">
            <input id="landing_wbraid" name="wbraid" type="hidden">
            <input id="landing_lead_id" name="lead_id" type="hidden">
            <input id="landing_website" class="hidden-field" name="landing_website" type="text" tabindex="-1" autocomplete="off">
            <p class="disclaimer">${escapeHtml(project.form.consent)}</p>
            <p class="disclaimer">${escapeHtml(project.form.sensitiveDataNotice)}</p>
            <p class="disclaimer">${escapeHtml(project.form.disclaimer)}</p>
            <button id="landingSubmitBtn" class="btn btn-primary" type="submit">${escapeHtml(project.form.submitLabel || "Request Project Information")}</button>
            <div id="landingFormError" class="form-error">We could not submit your enquiry. Please try again or contact Oaklyn Realty directly.</div>
          </form>
          <div id="landingSuccess" class="form-success">
            <h3>Thank you</h3>
            <p class="section-copy">Your enquiry has been received. Oaklyn Realty will contact you regarding ${escapeHtml(project.name)}.</p>
          </div>
        </div>
      </div>
    </section>

  </main>
  ${renderFooter()}
  <a class="whatsapp-float" href="${escapeHtml(whatsappHref)}" target="_blank" rel="noopener">WhatsApp</a>
  <div class="mobile-contact-bar">
    <a href="tel:${escapeHtml(company.phoneHref)}">Call</a>
    <a href="${escapeHtml(whatsappHref)}" target="_blank" rel="noopener">WhatsApp</a>
  </div>
  <script src="/client.js?v=${escapeHtml(project.assetVersion)}" defer></script>
</body>
</html>`;
};

const renderThankYouTracking = () => `<script>
(function () {
  var params = new URLSearchParams(window.location.search);
  var leadId = params.get('lead_id') || '';
  var eventId = leadId || (${JSON.stringify(project.slug)} + '_thank_you_' + Date.now());
  var trackingPayload = {
    project_name: ${JSON.stringify(project.name)},
    project_slug: ${JSON.stringify(project.slug)},
    source_page: ${JSON.stringify(project.sourcePage)},
    landing_page_url: ${JSON.stringify(project.landingPageUrl)},
    thank_you_page_url: ${JSON.stringify(project.thankYouPageUrl)},
    lead_id: leadId,
    event_id: eventId,
    gclid: params.get('gclid') || '',
    gbraid: params.get('gbraid') || '',
    wbraid: params.get('wbraid') || '',
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || ''
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: 'lead_thank_you_page_view' }, trackingPayload));
  window.dataLayer.push(Object.assign({ event: 'lead_conversion_thank_you' }, trackingPayload));
})();
</script>`;

const renderThankYouPage = ({ currentProject, canonical, backHref }) => {
  setProject(currentProject);
  const whatsappHref = getWhatsAppHref();
  return `<!doctype html>
<html lang="en">
<head>
${renderHead({
  title: `Thank You | ${project.name} | ${company.company}`,
  description: "Your Oaklyn Realty property enquiry has been received.",
  canonical,
  noindex: true,
  preloadImage: project.hero.background,
})}
</head>
<body>
${renderGtmBody(project.tracking, escapeHtml)}
${renderNav()}
  <main class="section thankyou-page">
    <div class="shell">
      <section class="thankyou-panel" data-reveal>
        <span class="eyebrow">Enquiry Received</span>
        <h1>Thank you. Our property consultant will contact you shortly.</h1>
        <p class="section-copy">Oaklyn Realty has received your enquiry for ${escapeHtml(project.name)}. We only request basic enquiry information and will follow up with the latest launch details.</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="${escapeHtml(backHref)}">Back to Project</a>
          <a class="btn btn-ghost" href="${escapeHtml(whatsappHref)}" target="_blank" rel="noopener">WhatsApp Oaklyn</a>
        </div>
      </section>
    </div>
  </main>
  ${renderFooter()}
  ${renderThankYouTracking()}
</body>
</html>`;
};

const writeGeneratedFile = async (relativePath, contents) => {
  const target = path.join(distDir, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
};

const copyRequiredAssets = async () => {
  const source = path.join(rootDir, "assets");
  const legacyCityUploadSource = path.join(rootDir, "city-of-arabia");
  const target = path.join(distDir, "assets");

  try {
    const sourceStat = await stat(source);
    if (!sourceStat.isDirectory()) {
      throw new Error("assets exists but is not a directory");
    }
  } catch (error) {
    if (landingProject.slug === "city-of-arabia") {
      try {
        const legacySourceStat = await stat(legacyCityUploadSource);
        if (!legacySourceStat.isDirectory()) {
          throw new Error("city-of-arabia exists but is not a directory");
        }
        await mkdir(path.join(target, "city-of-arabia"), { recursive: true });
        await cp(legacyCityUploadSource, path.join(target, "city-of-arabia"), { recursive: true });
        return;
      } catch (legacyError) {
        throw new Error("Missing required assets folder. Keep assets/city-of-arabia beside package.json before deploying to Vercel.");
      }
    }
    return;
  }

  if (landingProject.slug === "city-of-arabia") {
    const requiredFiles = [
      "city-of-arabia/01-hero-aerial-render.jpg",
      "city-of-arabia/15-gallery-lap-pool-athletic.jpg",
      "city-of-arabia/16-gallery-beach-lagoon-clubhouse.jpg",
    ];

    await Promise.all(
      requiredFiles.map(async (file) => {
        try {
          await stat(path.join(source, file));
        } catch (error) {
          throw new Error(`Missing required landing image: assets/${file}. Upload the full assets folder before deploying.`);
        }
      }),
    );
  }

  if (landingProject.slug === "beyond-global-village") {
    const requiredFiles = [
      "beyond-global-village/01-hero-community-view.jpg",
      "beyond-global-village/02-central-garden-crop.jpg",
      "beyond-global-village/03-balcony-crop.jpg",
      "beyond-global-village/04-residences-crop.jpg",
      "beyond-global-village/05-masterplan-sea-view.jpg",
      "beyond-global-village/06-arrival-fountain-walk.jpg",
      "beyond-global-village/07-facade-close-up.jpg",
    ];

    await Promise.all(
      requiredFiles.map(async (file) => {
        try {
          await stat(path.join(source, file));
        } catch (error) {
          throw new Error(`Missing required landing image: assets/${file}. Upload the full assets folder before deploying.`);
        }
      }),
    );
  }

  await cp(source, target, { recursive: true });
};

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await writeGeneratedFile("index.html", renderLandingPage(landingProject));

const routePath = trimSlashes(landingProject.routePath);
if (routePath) {
  await writeGeneratedFile(`${routePath}/index.html`, renderLandingPage(landingProject));
}

await writeGeneratedFile(
  "thank-you/index.html",
  renderThankYouPage({ currentProject: landingProject, canonical: landingProject.thankYouPageUrl, backHref: routePath ? `/${routePath}/` : "/" }),
);

const alternateThankYouPath = trimSlashes(landingProject.alternateThankYouPath);
if (alternateThankYouPath && alternateThankYouPath !== "thank-you") {
  await writeGeneratedFile(
    `${alternateThankYouPath}/index.html`,
    renderThankYouPage({
      currentProject: landingProject,
      canonical: `${landingProject.landingPageUrl.replace(/\/$/, "")}/${alternateThankYouPath}`,
      backHref: routePath ? `/${routePath}/` : "/",
    }),
  );
}

await copyFile(path.join(rootDir, "src", "styles.css"), path.join(distDir, "styles.css"));
await copyFile(path.join(rootDir, "src", "client.js"), path.join(distDir, "client.js"));
await copyRequiredAssets();

console.log(`Built ${landingProject.name} landing project in ${distDir}`);
