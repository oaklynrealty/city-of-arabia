import { phoneCountries } from "./country-codes.mjs";

const asset = (name) => `/assets/city-of-arabia/${name}`;

export const project = {
  name: "City of Arabia – Phase 1",
  slug: "city-of-arabia",
  sourcePage: "city-of-arabia.oaklynrealty.ae",
  landingPageUrl: "https://city-of-arabia.oaklynrealty.ae/",
  thankYouPageUrl: "https://city-of-arabia.oaklynrealty.ae/thank-you",
  routePath: "/city-of-arabia",
  alternateThankYouPath: "/city-of-arabia-thank-you",
  assetVersion: "20260518-city-arabia-images-2",
  webhookUrl: "https://hooks.zapier.com/hooks/catch/27424919/uvzwm7a/",
  tracking: {
    gtmId: "GTM-NVD5VMG5"
  },
  brand: {
    company: "Oaklyn Realty",
    legalName: "Oaklyn Real Estate L.L.C.",
    phoneDisplay: "+971 58 583 5230",
    phoneHref: "+971585835230",
    email: "sales@oaklynrealty.ae",
    office: "Oxford Tower, Office 607, 6th Floor, Business Bay, Dubai, UAE",
    logo: "https://oaklynrealty.com/wp-content/uploads/2026/05/logo_landscape.png",
    mainWebsite: "https://oaklynrealty.ae",
    privacyUrl: "https://oaklynrealty.ae/privacy-policy",
    termsUrl: "https://oaklynrealty.ae/terms-and-conditions",
    contactUrl: "https://oaklynrealty.ae/contact"
  },
  seo: {
    title: "City of Arabia Phase 1 | Oaklyn Realty",
    description:
      "Review City of Arabia Phase 1 with Oaklyn Realty. Payment plan, starting price, location highlights, amenities, and availability guidance."
  },
  hero: {
    eyebrow: "Presented by Oaklyn Realty",
    title: "City of Arabia – Phase 1",
    subtitle: "Mediterranean-inspired living with lagoons, shaded paths, greenery, and wellness-led community design.",
    background: asset("01-hero-aerial-render.jpg"),
    primaryCta: "Request Details",
    secondaryCta: "Request Brochure"
  },
  heroSlides: [
    { image: asset("01-hero-aerial-render.jpg"), label: "City of Arabia aerial render" },
    { image: asset("16-gallery-beach-lagoon-clubhouse.jpg"), label: "Beach lagoon and clubhouse" },
    { image: asset("15-gallery-lap-pool-athletic.jpg"), label: "Lap pool and athletic zone" }
  ],
  highlights: [
    { label: "Payment Plan", value: "60 / 40" },
    { label: "Starting Price", value: "AED 1.4M" },
    { label: "EOI From", value: "AED 40K" },
    { label: "Location", value: "City of Arabia" },
    { label: "Lifestyle", value: "Lagoons & Greenery" },
    { label: "Unit Focus", value: "1 Bedroom" }
  ],
  details: [
    { label: "Location", value: "City of Arabia, Dubai" },
    { label: "Payment Plan", value: "60 / 40 (subject to developer confirmation)" },
    { label: "Starting Price", value: "1 Bedroom from AED 1.4M" },
    { label: "EOI", value: "Starting from AED 70K" },
    { label: "Lifestyle", value: "Green spine, lagoons, wellness, shaded walkways" },
    {
      label: "Permit No.",
      value: "[ADD TRAKHEESI PERMIT] (issued by Dubai Land Department)",
      wide: true
    }
  ],
  trustPoints: [
    {
      title: "Oaklyn Realty advisory",
      text: "A consultant follows up with project details and next steps."
    },
    {
      title: "Developer confirmation",
      text: "Pricing, payment plans, and availability may change."
    },
    {
      title: "No sensitive data",
      text: "The form only asks for basic enquiry details."
    }
  ],
  gallery: {
    eyebrow: "Masterplan Gallery",
    title: "A visual community story",
    text: "Selected visuals from the project brief showing lagoon, wellness, and masterplan lifestyle zones.",
    items: [
      {
        eyebrow: "Lagoon Living",
        title: "Beach lagoon and clubhouse",
        image: asset("16-gallery-beach-lagoon-clubhouse.jpg")
      },
      {
        eyebrow: "Wellness",
        title: "Lap pool and athletic zone",
        image: asset("15-gallery-lap-pool-athletic.jpg")
      },
      {
        eyebrow: "Arrival",
        title: "Arrival amphitheatre zone",
        image: asset("14-gallery-arrival-amphitheatre.jpg")
      },
      {
        eyebrow: "Urban Plaza",
        title: "Office plaza zone",
        image: asset("17-gallery-office-plaza.jpg")
      },
      {
        eyebrow: "Masterplan",
        title: "Clean community plan view",
        image: asset("09-masterplan-clean-plan-view.jpg")
      },
      {
        eyebrow: "Active Spine",
        title: "Walking, jogging, and green routes",
        image: asset("13-wellness-active-spine-loops.jpg")
      },
      {
        eyebrow: "Mediterranean Vision",
        title: "Life under the canopy",
        image: asset("10-vision-mediterranean-moodboard.jpg")
      },
      {
        eyebrow: "Connectivity",
        title: "Nearby landmarks and travel times",
        image: asset("06-connectivity-landmarks-radius.jpg")
      }
    ]
  },
  snapshot: {
    eyebrow: "Lifestyle & Amenities",
    title: "Green, walkable, wellness-led living",
    text: "",
    items: [
      {
        title: "Mediterranean-inspired landscape",
        text: "Orchards, shaded lanes, scented gardens, and outdoor gathering spaces."
      },
      {
        title: "Lagoon and clubhouse",
        text: "Water-focused amenities designed around a resort-style community feel."
      },
      {
        title: "Wellness and active spine",
        text: "Walking, jogging, pool, gym, and active lifestyle zones."
      },
      {
        title: "Community convenience",
        text: "Retail, F&B, family spaces, clinic, nursery, and lounges in the masterplan."
      }
    ]
  },
  about: {
    eyebrow: "About The Community",
    title: "A greener side of City of Arabia",
    text:
      "Phase 1 is planned around Mediterranean landscape ideas, shaded pedestrian routes, green links, lagoon spaces, and a walkable public realm connected to daily lifestyle amenities."
  },
  location: {
    eyebrow: "Location",
    title: "City of Arabia, Dubai",
    bullets: [
      "IMG World — approximately 3 minutes.",
      "Global Village — approximately 15 minutes.",
      "Downtown Dubai — approximately 27 minutes.",
      "Dubai International Airport — approximately 25 minutes.",
      "Al Maktoum International Airport (DWC) — approximately 38 minutes."
    ]
  },
  faq: [
    {
      question: "What is the payment plan?",
      answer: "The briefed payment plan is 60 / 40, subject to developer confirmation."
    },
    {
      question: "What is the starting price?",
      answer: "The provided starting price is AED 1.4M for 1 bedroom units."
    },
    {
      question: "Is the EOI amount fixed?",
      answer: "EOI is listed from AED 70K and should be confirmed before submission."
    },
    {
      question: "Does Oaklyn guarantee returns?",
      answer: "No. Oaklyn Realty does not guarantee ROI, rental income, or future resale value."
    }
  ],
  form: {
    title: "Request City of Arabia Details",
    text: "Share your details and Oaklyn Realty will follow up with current availability and payment-plan guidance.",
    splitName: true,
    labels: {
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      email: "Email",
      project: "Preferred Unit",
      propertyType: "Inquiry Type"
    },
    phoneCountries,
    preferredProjects: ["1 Bedroom", "2 Bedroom", "3 Bedroom", "General Availability"],
    propertyTypes: ["Request Details", "Request Brochure", "Availability", "Payment Plan"],
    consent:
      "By submitting this form, you agree to be contacted by Oaklyn Realty regarding your property inquiry.",
    sensitiveDataNotice:
      "We do not request sensitive personal information such as passport numbers, Emirates ID, salary information, nationality, religion, or health-related data through this form.",
    disclaimer:
      "All pricing, payment plans, and availability remain subject to developer confirmation."
  }
};
