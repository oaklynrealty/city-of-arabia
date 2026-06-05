import { phoneCountries } from "./country-codes.mjs";
import { getTrackingConfig } from "../shared/gtm.mjs";

const asset = (name) => `/assets/arancia-yards/${name}`;

const sharedProject = {
  name: "Arancia Yards by BEYOND",
  slug: "arancia-yards",
  sourcePage: "arancia-yards.oaklynrealty.ae",
  landingPageUrl: "https://arancia-yards.oaklynrealty.ae/",
  thankYouPageUrl: "https://arancia-yards.oaklynrealty.ae/thank-you/",
  publicRoutePath: "/arancia-yards",
  publicThankYouPath: "/thank-you",
  routePath: "/__oaklyn-lang/en",
  alternateThankYouPath: "/__oaklyn-lang/en-thank-you",
  homeHref: "/",
  assetVersion: "20260605-arancia-yards-1",
  webhookUrl: "https://hooks.zapier.com/hooks/catch/27424919/uvzwm7a/",
  whatsappWebhookUrl: "https://hooks.zapier.com/hooks/catch/27424919/4brjlen/",
  blacklistCheckUrl:
    "https://script.google.com/a/macros/oaklynrealty.ae/s/AKfycbxlrJjr1Up2ucBrAtOzkHA7gwITMLJEMAtPiAcmge1MkyIzsILTqTE7D3HK92rnuml2/exec?phone_number=%2B971501396674&email=mounir@oaklynrealty.ae&blacklisted=TRUE",
  blacklistTimeoutMs: 8000,
  tracking: getTrackingConfig(),
  showMobileMenu: false,
  brand: {
    company: "Oaklyn Realty",
    legalName: "Oaklyn Real Estate L.L.C.",
    phoneDisplay: "+971 58 583 5230",
    phoneHref: "+971585835230",
    whatsappDisplay: "+971 50 588 6769",
    whatsappHref: "+971505886769",
    email: "sales@oaklynrealty.ae",
    office: "Oxford Tower, Office 607, 6th Floor, Business Bay, Dubai, UAE",
    logo: "https://oaklynrealty.com/wp-content/uploads/2026/05/logo_landscape.png",
    mainWebsite: "https://oaklynrealty.ae",
    aboutUrl: "https://www.oaklynrealty.ae/about",
    privacyUrl: "https://oaklynrealty.ae/privacy-policy",
    termsUrl: "https://oaklynrealty.ae/terms-and-conditions",
    contactUrl: "https://oaklynrealty.ae/contact"
  },
  listing: {
    addressLocality: "City of Arabia, Dubailand",
    addressRegion: "Dubai",
    addressCountry: "AE",
    developer: "BEYOND Developments",
    regulator: "Dubai Land Department"
  },
  seo: {
    title: "Arancia Yards by BEYOND Dubai | Oaklyn Realty",
    description:
      "Review Arancia Yards by BEYOND in City of Arabia, Dubailand with Oaklyn Realty. Prices from AED 1M and 40/60 payment plan."
  },
  whatsappPrefill: "Hello Oaklyn Realty, I am interested in Arancia Yards by BEYOND",
  whatsappDirectUrl:
    "https://wa.me/971505886769?text=Hello%20Oaklyn%20Realty%2C%20I%20am%20interested%20in%20Arancia%20Yards%20by%20BEYOND",
  hero: {
    eyebrow: "Presented by Oaklyn Realty",
    title: "Arancia Yards by BEYOND",
    subtitle:
      "A design-led apartment launch in City of Arabia, Dubailand, with mature infrastructure, direct E311 access, and early-entry pricing guidance.",
    background: asset("photos/16-gallery-beach-lagoon-clubhouse.jpg"),
    primaryCta: "Request Details",
    secondaryCta: "Request Brochure"
  },
  highlights: [
    { label: "Starting Price", value: "From AED 1M" },
    { label: "Location", value: "City of Arabia" },
    { label: "Developer", value: "BEYOND Developments" },
    { label: "Unit Types", value: "1, 2 & 3BR" },
    { label: "Payment Plan", value: "40 / 60" },
    { label: "Launch Date", value: "8 June 2026" }
  ],
  details: [
    { label: "Location", value: "City of Arabia, Dubailand, Dubai" },
    { label: "Developer", value: "BEYOND Developments" },
    { label: "Unit Types", value: "1, 2, and 3-bedroom apartments" },
    { label: "Starting Price", value: "From AED 1,000,000, subject to developer confirmation" },
    { label: "Payment Plan", value: "40% during construction / 60% on handover" },
    { label: "Master Community", value: "City of Arabia — 14 million sq ft" }
  ],
  unitCardsSection: {
    eyebrow: "Unit Types & Sizes",
    title: "Apartment options at a glance",
    labels: {
      size: "Size",
      price: "Starting Price",
      pricePerSqft: "Approx. Price / Sq ft"
    },
    items: [
      {
        title: "1 Bedroom Apartment",
        size: "550-700 sq ft",
        price: "From AED 1,000,000",
        pricePerSqft: "AED 1,430-1,820"
      },
      {
        title: "2 Bedroom Apartment",
        size: "950-1,200 sq ft",
        price: "From AED 1,600,000",
        pricePerSqft: "AED 1,330-1,685"
      },
      {
        title: "3 Bedroom Apartment",
        size: "1,400-1,800 sq ft",
        price: "From AED 2,200,000",
        pricePerSqft: "AED 1,220-1,570"
      }
    ],
    note: "All unit sizes, pricing, and payment-plan details remain subject to developer confirmation."
  },
  trustPoints: [
    {
      title: "Oaklyn Realty advisory",
      text: "A consultant follows up with launch details, unit options, and next steps."
    },
    {
      title: "Developer confirmation",
      text: "Pricing, payment plans, inventory, launch dates, and handover timelines may change."
    },
    {
      title: "No sensitive data",
      text: "The form only asks for basic enquiry details."
    }
  ],
  gallery: {
    eyebrow: "Visual Experience",
    title: "Lagoon, gardens, plaza, and masterplan views",
    text:
      "Selected visuals for Arancia Yards by BEYOND, including the lagoon clubhouse, athletic pool, office plaza, arrival amphitheatre, and masterplan context.",
    items: [
      {
        eyebrow: "Lagoon Clubhouse",
        title: "Pool lagoon and residential buildings",
        image: asset("photos/16-gallery-beach-lagoon-clubhouse.jpg")
      },
      {
        eyebrow: "Athletic Amenities",
        title: "Lap pool and active facilities",
        image: asset("photos/15-gallery-lap-pool-athletic.jpg")
      },
      {
        eyebrow: "Office Plaza",
        title: "Walkways, offices, and orange trees",
        image: asset("photos/17-gallery-office-plaza.jpg")
      },
      {
        eyebrow: "Arrival Garden",
        title: "Sunset garden and amphitheatre",
        image: asset("photos/14-gallery-arrival-amphitheatre.jpg")
      },
      {
        eyebrow: "Masterplan",
        title: "City of Arabia community plan",
        image: asset("photos/09-masterplan-clean-plan-view.jpg")
      }
    ]
  },
  snapshot: {
    eyebrow: "Why This Project",
    title: "A measured way to review Arancia Yards",
    text: "",
    items: [
      {
        title: "Mature master community",
        text: "City of Arabia already benefits from roads, retail, schools, parks, and established surrounding infrastructure."
      },
      {
        title: "Early-entry pricing",
        text: "From AED 1M in a 14 million sq ft master community, with final availability confirmed before reservation."
      },
      {
        title: "Transport-led positioning",
        text: "Direct E311 access with Dubai Metro Blue Line confirmed on the E311 corridor."
      },
      {
        title: "Market reference, not a forecast",
        text: "Dubailand recorded 11.4% average YoY price growth in ValuStrat Q1 2026; future performance is not guaranteed."
      }
    ]
  },
  about: {
    eyebrow: "About The Project",
    title: "Design-led apartments in a mature Dubailand setting",
    text:
      "Arancia Yards by BEYOND brings 1, 2, and 3-bedroom apartments to City of Arabia, a large-scale Dubailand master community with existing access, nearby destinations, and a growing residential base. Oaklyn Realty helps you review the facts, pricing, and launch details before requesting updated availability.",
    image: asset("photos/17-gallery-office-plaza.jpg"),
    imageAlt: "Arancia Yards office plaza and landscaped walkways"
  },
  location: {
    eyebrow: "Location",
    title: "City of Arabia, Dubailand, Dubai",
    image: asset("photos/02-context-city-of-arabia-aerial.jpg"),
    bullets: [
      "5 minutes to Global Village.",
      "18 minutes to Dubai Silicon Oasis.",
      "25 minutes to Downtown Dubai.",
      "28 minutes to Dubai International Airport.",
      "Direct access to E311.",
      "Dubai Metro Blue Line confirmed on the E311 corridor."
    ]
  },
  aboutUsSection: {
    eyebrow: "About Oaklyn Realty",
    title: "Project guidance from Oaklyn Realty",
    text:
      "Oaklyn Realty helps buyers review Dubai launch projects with clear pricing guidance, compliant communication, and practical next steps before reservation.",
    href: "https://www.oaklynrealty.ae/about",
    ctaLabel: "About Oaklyn Realty"
  },
  faq: [
    {
      question: "What is the starting price?",
      answer: "Prices start from AED 1,000,000, subject to developer confirmation."
    },
    {
      question: "What unit types are available?",
      answer: "The current launch information includes 1, 2, and 3-bedroom apartments."
    },
    {
      question: "What is the payment plan?",
      answer: "The stated structure is 40% during construction and 60% on handover, subject to developer confirmation."
    },
    {
      question: "Is the market growth data a guarantee?",
      answer: "No. Historical market data and metro premiums are references only and do not guarantee ROI, rental income, or resale value."
    }
  ],
  form: {
    title: "Request Arancia Yards Details",
    text: "Share your details and Oaklyn Realty will follow up with the latest launch pricing, bedroom availability, and payment-plan guidance.",
    splitName: false,
    labels: {
      name: "Full Name",
      phone: "Phone Number",
      email: "Email",
      project: "Preferred Unit",
      propertyType: "Inquiry Type"
    },
    phoneCountries,
    preferredProjects: ["1 Bedroom", "2 Bedroom", "3 Bedroom", "General Availability"],
    propertyTypes: ["Apartment", "Investment Review", "Payment Plan", "Not Sure Yet"],
    whatsappAlternativeLabel: "Prefer WhatsApp?",
    whatsappButtonLabel: "Chat on WhatsApp",
    privacyText:
      "By submitting this form, you agree to our Privacy Policy and agree to be contacted by Oaklyn Realty.",
    consent:
      "By submitting this form, you agree to be contacted by Oaklyn Realty regarding your property inquiry.",
    sensitiveDataNotice:
      "We do not request sensitive personal information such as passport numbers, Emirates ID, salary information, nationality, religion, or health-related data through this form.",
    blacklistBlockedMessage:
      "Thank you. Your inquiry has already been received.",
    blacklistErrorMessage:
      "Something went wrong. Please try again.",
    disclaimer:
      "All pricing, payment plans, availability, launch dates, and handover dates remain subject to developer confirmation.",
    successText:
      "Your enquiry has been received. Oaklyn Realty will contact you regarding Arancia Yards by BEYOND.",
    thankYouText:
      "Oaklyn Realty has received your enquiry for Arancia Yards by BEYOND. We will not ask for sensitive personal information through this form."
  },
  footer: {
    company: "Oaklyn Realty",
    tagline: "Refined Living | Smart Investments",
    description:
      "Oaklyn Realty is a Dubai real estate brokerage helping clients review project details, availability, and enquiry next steps with clear communication.",
    address: "Oxford Tower, Office 607, 6th Floor, Business Bay, Dubai, UAE",
    license:
      "Oaklyn Real Estate L.L.C. — DED Licence 1589593 · RERA ORN 59210. Regulated by Dubai DET and Dubai Land Department.",
    copyright: "Copyright © 2026 Oaklyn Real Estate L.L.C. All rights reserved.",
    disclaimer:
      "All information on this page is provided for general guidance only. Property details, pricing, and availability are subject to change without prior notice."
  },
  uiText: {
    no_guaranteed_returns: "",
    form_submit: "Request Project Information"
  },
  linkHub: null
};

export const project = {
  ...sharedProject,
  languageCode: "en"
};

export const arabicProject = {
  ...sharedProject,
  languageCode: "ar",
  routePath: "/__oaklyn-lang/ar",
  alternateThankYouPath: "/__oaklyn-lang/ar-thank-you",
  locale: {
    lang: "ar",
    dir: "rtl"
  }
};
