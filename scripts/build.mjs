import { cp, mkdir, rm, writeFile, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { project as landingProject } from "../src/project-data.mjs";

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

const json = (data) => JSON.stringify(data, null, 2).replaceAll("</script", "<\\/script");
const renderJsonLd = (data) => `<script type="application/ld+json">\n${json(data)}\n</script>`;
const trimSlashes = (value = "") => String(value).replace(/^\/+|\/+$/g, "");

const getClientConfig = () => ({
  project_name: project.name,
  project_slug: project.slug,
  source_page: project.sourcePage,
  landing_page_url: project.landingPageUrl,
  thank_you_page_url: project.thankYouPageUrl,
  webhook_url: project.webhookUrl,
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

const renderGtmHead = () => {
  const gtmId = project.tracking?.gtmId;
  if (!gtmId) return "";
  return `<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${escapeHtml(gtmId)}');
</script>`;
};

const renderGtmBody = () => {
  const gtmId = project.tracking?.gtmId;
  if (!gtmId) return "";
  return `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${escapeHtml(gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
};

const renderHead = ({ title, description, canonical, noindex = false }) => `  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${noindex ? '<meta name="robots" content="noindex, nofollow">' : ""}
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  ${renderGtmHead()}
  ${renderJsonLd(getOrganizationSchema())}
  ${renderJsonLd(getWebpageSchema(canonical))}
  ${renderJsonLd(getListingSchema(canonical))}
  <link rel="stylesheet" href="/styles.css?v=${escapeHtml(project.assetVersion)}">`;

const renderNav = () => `
  <header class="topbar">
    <div class="shell nav">
      <a class="brand" href="/" aria-label="${escapeHtml(company.company)} ${escapeHtml(project.name)} landing page">
        <img src="${escapeHtml(company.logo)}" alt="${escapeHtml(company.company)}">
        <span>${escapeHtml(project.name)}</span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        <a href="#overview">Overview</a>
        <a href="#gallery">Gallery</a>
        <a href="#location">Location</a>
        <a href="#contact">Contact</a>
        <a href="${escapeHtml(company.mainWebsite)}">Oaklyn Website</a>
      </nav>
      <div class="nav-actions">
        <a class="nav-phone" href="tel:${escapeHtml(company.phoneHref)}">${escapeHtml(company.phoneDisplay)}</a>
        <a class="btn btn-primary" href="#contact">Request Details</a>
      </div>
      <button class="mobile-menu-button" type="button" aria-label="Open menu" aria-expanded="false" data-mobile-menu-button>Menu</button>
    </div>
    <nav class="mobile-menu" aria-label="Mobile navigation" data-mobile-menu>
      <a href="#overview">Overview</a>
      <a href="#gallery">Gallery</a>
      <a href="#location">Location</a>
      <a href="#contact">Contact</a>
      <a href="${escapeHtml(company.mainWebsite)}">Oaklyn Website</a>
    </nav>
  </header>`;

const renderFooter = () => `
  <footer class="section">
    <div class="shell footer-panel">
      <div class="footer-grid">
        <div>
          <strong>${escapeHtml(company.company)}</strong>
          <p>Oaklyn Realty is a Dubai real estate brokerage helping you review project details, availability, and enquiry next steps with clear communication.</p>
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
    </div>
  </footer>`;

const renderHighlights = () =>
  project.highlights
    .map(
      (item) => `
          <article class="highlight-card">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
          </article>`,
    )
    .join("");

const renderHeroVisual = () => {
  const slides = project.heroSlides?.length ? project.heroSlides : [{ image: project.hero.background, label: project.hero.title }];
  if (slides.length === 1) {
    return `<div class="hero-bg" style="background-image: url('${escapeHtml(slides[0].image)}');"></div>`;
  }
  return `<div class="hero-slider" data-hero-slider>
        ${slides
          .map(
            (slide, index) =>
              `<div class="hero-bg hero-slide${index === 0 ? " is-active" : ""}" style="background-image: url('${escapeHtml(slide.image)}');" aria-label="${escapeHtml(slide.label)}"></div>`,
          )
          .join("\n        ")}
      </div>`;
};

const renderGallerySlides = () =>
  project.gallery.items
    .map(
      (item) => `
            <article class="gallery-slide" data-gallery-slide>
              <div class="gallery-image" style="background-image: url('${escapeHtml(item.image)}');">
                <div class="gallery-caption">
                  <span>${escapeHtml(item.eyebrow)}</span>
                  <strong>${escapeHtml(item.title)}</strong>
                </div>
              </div>
            </article>`,
    )
    .join("");

const renderGalleryDots = () =>
  project.gallery.items
    .map(
      (_, index) => `
          <button class="gallery-dot${index === 0 ? " is-active" : ""}" type="button" aria-label="Go to gallery image ${index + 1}" aria-pressed="${index === 0 ? "true" : "false"}" data-gallery-dot></button>`,
    )
    .join("");

const renderSnapshotItems = () =>
  project.snapshot.items
    .map(
      (item) => `
          <article class="why-card">
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.text)}</p>
          </article>`,
    )
    .join("");

const renderLocationBullets = () =>
  project.location.bullets
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

const renderComplianceCards = () =>
  project.trustPoints
    .map(
      (item) => `
          <article class="compliance-card">
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.text)}</p>
          </article>`,
    )
    .join("");

const renderFaq = () => {
  if (!project.faq?.length) return "";
  return `<section class="section faq-section">
      <div class="shell">
        <div class="section-kicker">
          <span class="eyebrow">FAQ</span>
          <h2 class="section-title">Quick answers</h2>
        </div>
        <div class="faq-grid">
          ${project.faq
            .map(
              (item) => `<article class="faq-card">
            <strong>${escapeHtml(item.question)}</strong>
            <p>${escapeHtml(item.answer)}</p>
          </article>`,
            )
            .join("")}
        </div>
      </div>
    </section>`;
};

const renderOptions = (items) =>
  items.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");

const renderPhoneCountryOptions = () =>
  project.form.phoneCountries
    .map(
      (item, index) =>
        `<option value="${escapeHtml(item.dialCode)}"${index === 0 ? " selected" : ""}>${escapeHtml(item.flag)} ${escapeHtml(item.label)} ${escapeHtml(item.dialCode)}</option>`,
    )
    .join("");

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

const renderAbout = () => {
  if (!project.about) return "";
  return `<section class="section about-community">
      <div class="shell about-panel">
        <span class="eyebrow">${escapeHtml(project.about.eyebrow)}</span>
        <h2 class="section-title">${escapeHtml(project.about.title)}</h2>
        <p class="section-copy">${escapeHtml(project.about.text)}</p>
      </div>
    </section>`;
};

const renderLandingPage = (nextProject) => {
  setProject(nextProject);
  const formLabels = getFormLabels();
  return `<!doctype html>
<html lang="en">
<head>
${renderHead({
  title: project.seo.title,
  description: project.seo.description,
  canonical: project.landingPageUrl,
})}
  <script>window.OAKLYN_LANDING_CONFIG = ${json(getClientConfig())};</script>
</head>
<body>
${renderGtmBody()}
${renderNav()}
  <main>
    <section class="hero">
      ${renderHeroVisual()}
      <div class="hero-shade"></div>
      <div class="shell hero-content">
        <span class="eyebrow">${escapeHtml(project.hero.eyebrow)}</span>
        <h1>${escapeHtml(project.hero.title)}</h1>
        <p>${escapeHtml(project.hero.subtitle)}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#contact">${escapeHtml(project.hero.primaryCta)}</a>
          <a class="btn btn-ghost" href="#contact">${escapeHtml(project.hero.secondaryCta)}</a>
        </div>
      </div>
    </section>

    <section class="section quick-highlights" id="overview">
      <div class="shell">
        <div class="section-kicker">
          <span class="eyebrow">Quick Investment Highlights</span>
          <h2 class="section-title">Project facts at a glance</h2>
        </div>
        <div class="highlight-grid">
          ${renderHighlights()}
        </div>
      </div>
    </section>

    ${renderAbout()}

    <section class="section gallery-section" id="gallery">
      <div class="shell">
        <div class="gallery-header section-kicker">
          <span class="eyebrow">${escapeHtml(project.gallery.eyebrow)}</span>
          <h2 class="section-title">${escapeHtml(project.gallery.title)}</h2>
          <p class="section-copy">${escapeHtml(project.gallery.text)}</p>
        </div>
        <div class="gallery glass-card" data-gallery>
          <div class="gallery-track" data-gallery-track>
            ${renderGallerySlides()}
          </div>
        </div>
        <div class="gallery-controls">
          <div class="gallery-dots">${renderGalleryDots()}</div>
          <div class="gallery-arrows">
            <button class="gallery-arrow" type="button" aria-label="Previous gallery image" data-gallery-prev>←</button>
            <button class="gallery-arrow" type="button" aria-label="Next gallery image" data-gallery-next>→</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section why-section">
      <div class="shell">
        <div class="section-kicker">
          <span class="eyebrow">${escapeHtml(project.snapshot.eyebrow)}</span>
          <h2 class="section-title">${escapeHtml(project.snapshot.title)}</h2>
        </div>
        <div class="why-grid">${renderSnapshotItems()}</div>
      </div>
    </section>

    <section class="section" id="location">
      <div class="shell location-panel">
        <div>
          <span class="eyebrow">${escapeHtml(project.location.eyebrow)}</span>
          <h2 class="section-title">${escapeHtml(project.location.title)}</h2>
        </div>
        <ul class="location-list">
          ${renderLocationBullets()}
        </ul>
      </div>
    </section>

    <section class="section" id="contact">
      <div class="shell contact-layout">
        <div class="form-intro compact-intro">
          <span class="eyebrow">Request Information</span>
          <h2 class="section-title">${escapeHtml(project.form.title)}</h2>
          <p class="section-copy">${escapeHtml(project.form.text)}</p>
          <div class="mini-compliance">
            <span>Basic enquiry details only</span>
            <span>Subject to developer confirmation</span>
            <span>No guaranteed investment returns</span>
          </div>
        </div>
        <div class="form-panel">
          <form id="landingLeadForm" novalidate>
            <div class="field-grid">
              ${renderNameFields(formLabels)}
              <div class="field is-phone" id="phoneField">
                <label for="landing_phone">${escapeHtml(formLabels.phone)}</label>
                <div class="phone-input-row">
                  <select id="landing_phone_country" name="phone_country_code" aria-label="Country code">${renderPhoneCountryOptions()}</select>
                  <input id="landing_phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="58 583 5230" required>
                </div>
                <div class="field-error">Please enter a valid phone number.</div>
              </div>
              <div class="field" id="emailField">
                <label for="landing_email">${escapeHtml(formLabels.email)}</label>
                <input id="landing_email" name="email" type="email" autocomplete="email" required>
                <div class="field-error">Please enter a valid email address.</div>
              </div>
              <div class="field" id="projectField">
                <label for="landing_preferred_project">${escapeHtml(formLabels.project)}</label>
                <select id="landing_preferred_project" name="preferred_project" required>${renderOptions(project.form.preferredProjects)}</select>
                <div class="field-error">Please select an option.</div>
              </div>
              <div class="field" id="propertyTypeField">
                <label for="landing_property_type">${escapeHtml(formLabels.propertyType)}</label>
                <select id="landing_property_type" name="property_type" required>${renderOptions(project.form.propertyTypes)}</select>
                <div class="field-error">Please select an enquiry type.</div>
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
            <button id="landingSubmitBtn" class="btn btn-primary" type="submit">Request Project Information</button>
            <div id="landingFormError" class="form-error">We could not submit your enquiry. Please try again or contact Oaklyn Realty directly.</div>
          </form>
          <div id="landingSuccess" class="form-success">
            <h3>Thank you</h3>
            <p class="section-copy">Your enquiry has been received. Oaklyn Realty will contact you regarding ${escapeHtml(project.name)}.</p>
          </div>
        </div>
      </div>
    </section>

    ${renderFaq()}

    <section class="section trust-compliance">
      <div class="shell">
        <div class="section-kicker">
          <span class="eyebrow">Trust & Compliance</span>
          <h2 class="section-title">Clear, compliant enquiry process</h2>
        </div>
        <div class="compliance-grid">${renderComplianceCards()}</div>
        <p class="permit-note">Permit No. [ADD TRAKHEESI PERMIT] — Issued by Dubai Land Department</p>
      </div>
    </section>
  </main>
  ${renderFooter()}
  <div class="mobile-contact-bar">
    <a href="tel:${escapeHtml(company.phoneHref)}">Call</a>
    <a href="#contact">Enquire</a>
  </div>
  <script src="/client.js?v=${escapeHtml(project.assetVersion)}" defer></script>
</body>
</html>`;
};

const renderThankYouTracking = () => `<script>
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'lead_thank_you_page_view',
  project_name: ${JSON.stringify(project.name)},
  project_slug: ${JSON.stringify(project.slug)},
  source_page: ${JSON.stringify(project.sourcePage)},
  landing_page_url: ${JSON.stringify(project.landingPageUrl)},
  thank_you_page_url: ${JSON.stringify(project.thankYouPageUrl)}
});
</script>`;

const renderThankYouPage = ({ currentProject, canonical, backHref }) => {
  setProject(currentProject);
  return `<!doctype html>
<html lang="en">
<head>
${renderHead({
  title: `Thank You | ${project.name} | ${company.company}`,
  description: "Your Oaklyn Realty property enquiry has been received.",
  canonical,
  noindex: true,
})}
</head>
<body>
${renderGtmBody()}
${renderNav()}
  <main class="section">
    <div class="shell">
      <section class="form-panel">
        <span class="eyebrow">Enquiry Received</span>
        <h1>Thank you. Oaklyn Realty has received your enquiry.</h1>
        <p class="section-copy">A property advisor will review your request and contact you about ${escapeHtml(project.name)}. We will not ask for sensitive personal information through this form.</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="${escapeHtml(backHref)}">Back to Project</a>
          <a class="btn btn-ghost" href="${escapeHtml(company.contactUrl)}">Contact Oaklyn</a>
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
