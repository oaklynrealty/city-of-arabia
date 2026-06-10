import { phoneCountries } from "./country-codes.mjs";
import { getTrackingConfig } from "../shared/gtm.mjs";

const asset = (name) => `/assets/arancia-yards/${name}`;

const sharedProject = {
  name: "Arancia Yards by BEYOND",
  slug: "arancia-yards",
  sourcePage: "master-community.oaklynrealty.ae",
  landingPageUrl: "https://master-community.oaklynrealty.ae/",
  thankYouPageUrl: "https://master-community.oaklynrealty.ae/thank-you/",
  publicRoutePath: "/arancia-yards",
  publicThankYouPath: "/thank-you",
  routePath: "/__oaklyn-lang/en",
  alternateThankYouPath: "/__oaklyn-lang/en-thank-you",
  homeHref: "/",
  assetVersion: "20260610-arancia-yards-info-update",
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
      "Review Arancia Yards by BEYOND in City of Arabia. EOI now open, AED 50K booking amount, prices from AED 1M and 40/60 payment plan."
  },
  whatsappPrefill: "Hello Oaklyn Realty, I am interested in Arancia Yards by BEYOND",
  whatsappDirectUrl:
    "https://wa.me/971505886769?text=Hello%20Oaklyn%20Realty%2C%20I%20am%20interested%20in%20Arancia%20Yards%20by%20BEYOND",
  hero: {
    eyebrow: "Presented by Oaklyn Realty",
    title: "Arancia Yards by BEYOND",
    subtitle:
      "A design-led Phase 1 apartment launch in City of Arabia, with EOI now open, future metro connectivity, and a 40/60 payment plan.",
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
    { label: "ACD", value: "Q1 2029" },
    { label: "EOI Status", value: "Now Open" },
    { label: "Booking Amount", value: "AED 50K" }
  ],
  details: [
    { label: "Location", value: "City of Arabia, Dubailand, Dubai" },
    { label: "Developer", value: "BEYOND Developments" },
    { label: "Unit Types", value: "1, 2, and 3-bedroom apartments" },
    { label: "Starting Price", value: "From AED 1,000,000, subject to developer confirmation" },
    { label: "Payment Plan", value: "40% during construction / 60% on handover" },
    { label: "ACD", value: "Q1 2029, subject to developer confirmation" },
    { label: "EOI Status", value: "Now open, subject to developer confirmation" },
    { label: "Booking Amount", value: "AED 50,000, subject to developer confirmation" },
    { label: "Masterplan", value: "165,000 sqm | 2.3M sq ft GFA | 5 phases" },
    { label: "Buildings", value: "17 buildings, including 13 residential buildings" },
    { label: "Community", value: "Car-free pedestrian community with 70% greenery" },
    { label: "Retail & Commercial", value: "Retail pavilion, F&B, and commercial spaces" },
    { label: "Arancia Phase 1", value: "272 units across 3 buildings" },
    { label: "Building Profile", value: "G+7 and G+6 buildings with 3.1m floor-to-ceiling heights" },
    { label: "Ground Floor", value: "Ground-floor retail" },
    { label: "Design Team", value: "HBA UK, HBA Singapore, Dewan, Coopers Hill" }
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
        size: "Avg. 762 sq ft",
        price: "From AED 1,000,000",
        pricePerSqft: "Approx. AED 1,312"
      },
      {
        title: "2 Bedroom Apartment",
        size: "Avg. 1,170 sq ft",
        price: "From AED 2,100,000",
        pricePerSqft: "Approx. AED 1,795"
      },
      {
        title: "3 Bedroom Apartment",
        size: "Avg. 1,700 sq ft",
        price: "From AED 3,300,000",
        pricePerSqft: "Approx. AED 1,941"
      }
    ],
    note: "EOI is now open with a stated AED 50,000 booking amount. All unit sizes, pricing, payment-plan details, and availability remain subject to developer confirmation."
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
      title: "Future metro-led access",
        text: "City of Arabia is positioned for future metro connectivity, with 3 minutes to IMG Worlds of Adventure, 10 minutes to Global Village, 18 minutes to Dubai Design District, and 25 minutes to DXB."
      },
      {
        title: "Car-free green masterplan",
        text: "A 165,000 sqm, 2.3M sq ft GFA masterplan planned across 5 phases and 17 buildings, with 70% greenery, lagoons, clubhouse, lap pools, pavilions, and 2+ km jogging and cycling trails."
      },
      {
        title: "Phase 1 clarity",
        text: "Arancia Phase 1 includes 272 units across 3 buildings, G+7 and G+6 building profiles, 3.1m floor-to-ceiling heights, ground-floor retail, and a stated AED 50,000 booking amount."
      },
      {
        title: "International design team",
        text: "Architecture by HBA UK, interiors by HBA Singapore, lead consultancy by Dewan, and landscape design by Coopers Hill."
      }
    ]
  },
  about: {
    eyebrow: "About The Project",
    title: "Design-led apartments in a mature Dubailand setting",
    text:
      "Arancia Yards by BEYOND brings 1, 2, and 3-bedroom apartments to City of Arabia, a car-free pedestrian masterplan with 70% greenery, lagoons, clubhouse amenities, future metro connectivity, and retail, F&B, and commercial spaces. Oaklyn Realty helps you review Phase 1 pricing, unit sizes, EOI requirements, and payment-plan details before requesting updated availability.",
    image: asset("photos/17-gallery-office-plaza.jpg"),
    imageAlt: "Arancia Yards office plaza and landscaped walkways"
  },
  location: {
    eyebrow: "Location",
    title: "City of Arabia, Dubailand, Dubai",
    image: asset("photos/02-context-city-of-arabia-aerial.jpg"),
    bullets: [
      "Future Metro connectivity via City of Arabia.",
      "3 minutes to IMG Worlds of Adventure.",
      "10 minutes to Global Village.",
      "18 minutes to Dubai Design District.",
      "20 minutes to Downtown Dubai and Burj Khalifa.",
      "25 minutes to Dubai International Airport.",
      "Direct access to E311.",
      "2+ km jogging and cycling trails within the masterplan."
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
      answer: "1-bedroom apartments start from AED 1M. 2-bedroom apartments start from AED 2.1M and 3-bedroom apartments start from AED 3.3M, subject to developer confirmation."
    },
    {
      question: "What is included in Arancia Phase 1?",
      answer: "Phase 1 includes 272 units across 3 buildings with G+7 and G+6 building profiles, 3.1m floor-to-ceiling heights, and ground-floor retail."
    },
    {
      question: "What is the payment plan and ACD?",
      answer: "The stated structure is 40% during construction and 60% on handover. ACD is Q1 2029, subject to developer confirmation."
    },
    {
      question: "Is EOI open and what is the booking amount?",
      answer: "EOI is now open with a stated AED 50,000 booking amount. The final booking process, availability, and payment instructions should be reconfirmed with the developer or an Oaklyn Realty consultant."
    },
    {
      question: "What are the main community features?",
      answer: "The masterplan includes a car-free pedestrian environment, 70% greenery, lagoons, clubhouse, lap pools, pavilions, commercial gym, kids club, yoga, sports courts, 2+ km trails, retail pavilion, F&B, and commercial spaces."
    }
  ],
  form: {
    title: "Inquire Now",
    text: "Priority Access & Floorplans",
    splitName: false,
    labels: {
      name: "Full Name",
      phone: "Phone",
      email: "Email Address",
      project: "Preferred Unit",
      propertyType: "Inquiry Type"
    },
    phoneCountries,
    preferredProjects: ["1 Bedroom", "2 Bedroom", "3 Bedroom", "General Availability"],
    propertyTypes: ["Apartment", "Investment Review", "Payment Plan", "Not Sure Yet"],
    defaultPropertyType: "Apartment",
    whatsappAlternativeLabel: "",
    whatsappButtonLabel: "Chat on WhatsApp",
    privacyText:
      "Protected by SSL encryption. All details are kept confidential.",
    consent:
      "By submitting this form, you agree to be contacted by our property consultants regarding your inquiry.",
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
    form_submit: "Send Enquiry"
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
