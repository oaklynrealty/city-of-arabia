import { phoneCountries } from "./country-codes.mjs";
import { getTrackingConfig } from "../shared/gtm.mjs";

const asset = (name) => `/assets/beyond-global-village/${name}`;

export const project = {
  name: "BEYOND Master Community Near Global Village",
  navLabel: "Dubailand Launch",
  slug: "beyond-global-village",
  sourcePage: "master-community.oaklynrealty.ae",
  landingPageUrl: "https://master-community.oaklynrealty.ae/",
  thankYouPageUrl: "https://master-community.oaklynrealty.ae/thank-you",
  routePath: "/beyond-global-village",
  alternateThankYouPath: "/beyond-global-village-thank-you",
  assetVersion: "20260522-blacklist-post-api-1",
  webhookUrl: "https://hooks.zapier.com/hooks/catch/27424919/uvzwm7a/",
  blacklistCheckUrl: "https://script.google.com/a/macros/oaklynrealty.ae/s/AKfycbxlrJjr1Up2ucBrAtOzkHA7gwITMLJEMAtPiAcmge1MkyIzsILTqTE7D3HK92rnuml2/exec",
  blacklistTimeoutMs: 8000,
  tracking: getTrackingConfig(),
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
    title: "BEYOND Dubailand Apartments Near Global Village",
    description:
      "Explore 1 to 3 bedroom apartments by BEYOND in Dubailand next to Global Village. From AED 1.1M with 10% booking and a 60/40 payment plan."
  },
  hero: {
    eyebrow: "Presented by Oaklyn Realty",
    title: "BEYOND's\nfirst master community",
    subtitle:
      "Discover 1 to 3 bedroom apartments in BEYOND's first master community, next to Global Village in Dubailand, from AED 1.1M with 10% booking and a 60/40 payment plan.",
    background: asset("01-hero-community-view.jpg"),
    primaryCta: "Get Price List",
    secondaryCta: "WhatsApp Us",
    panelText: "Get the latest price list, 60/40 payment plan, and available unit guidance from Oaklyn Realty.",
    badges: ["1 to 3 bedroom apartments", "From AED 1.1M", "10% booking", "60/40 payment plan", "Dubailand next to Global Village"]
  },
  heroSlides: [
    { image: asset("01-hero-community-view.jpg"), label: "BEYOND master community hero view" },
    { image: asset("02-central-garden-crop.jpg"), label: "Central garden and water feature" },
    { image: asset("05-masterplan-sea-view.jpg"), label: "Masterplan view with sea beyond" },
    { image: asset("06-arrival-fountain-walk.jpg"), label: "Arrival promenade and fountain garden" },
    { image: asset("03-balcony-crop.jpg"), label: "Residence balcony and facade detail" },
    { image: asset("07-facade-close-up.jpg"), label: "Facade close-up with planting detail" }
  ],
  highlights: [
    { label: "Residence Types", value: "1 to 3 Beds" },
    { label: "Starting Price", value: "From AED 1.1M" },
    { label: "Booking Amount", value: "10% to Reserve" },
    { label: "Payment Plan", value: "60/40" },
    { label: "Location", value: "Dubailand" },
    { label: "Launch Angle", value: "Master Community" }
  ],
  about: {
    eyebrow: "Developer Credibility",
    title: "A more composed Dubailand community launch",
    text:
      "BEYOND is positioning this release as its first master community in Dubailand, shaped by landscaped courtyards, lower-rise massing, and a calmer residential rhythm near Global Village."
  },
  residences: {
    eyebrow: "Residences",
    title: "1 to 3 bedroom apartments",
    text:
      "The launch focuses on a clear range of apartment types, from one-bedroom layouts through to larger three-bedroom homes.",
    items: [
      {
        title: "1 Bedroom Apartments",
        text: "A cleaner entry point for buyers who want the address and the community concept at a lower starting level."
      },
      {
        title: "2 Bedroom Apartments",
        text: "Balanced layouts for couples, smaller families, and buyers who want more everyday flexibility."
      },
      {
        title: "3 Bedroom Apartments",
        text: "Larger homes for buyers prioritising space, hosting, and a stronger long-term living setup."
      }
    ]
  },
  paymentPlan: {
    eyebrow: "Payment Plan",
    title: "The launch essentials",
    text:
      "The current brief indicates 10% to book within a 60/40 payment plan structure. Exact milestone dates remain subject to the latest developer release.",
    steps: [
      {
        label: "Reserve",
        value: "10% on booking",
        note: "Use the opening booking amount to secure a preferred unit while launch inventory is available."
      },
      {
        label: "During Construction",
        value: "60% total",
        note: "The pre-handover portion is expected to sit within the 60% part of the payment plan."
      },
      {
        label: "On Handover",
        value: "40% balance",
        note: "Ask for the latest developer schedule, fee guidance, and exact milestone timing before placing funds."
      }
    ]
  },
  gallery: {
    eyebrow: "Lifestyle Imagery",
    title: "Warm architecture framed by landscaped courtyards",
    text:
      "The visual set moves from wide masterplan perspectives to close architectural details, helping buyers read both the overall community mood and the finer design language.",
    items: [
      {
        eyebrow: "Community View",
        title: "A master community built around shared outdoor space",
        image: asset("01-hero-community-view.jpg")
      },
      {
        eyebrow: "Central Landscape",
        title: "Water features and greener pedestrian zones",
        image: asset("02-central-garden-crop.jpg")
      },
      {
        eyebrow: "Residence Detail",
        title: "Large terraces and calmer private outlooks",
        image: asset("03-balcony-crop.jpg")
      },
      {
        eyebrow: "Architecture",
        title: "Refined mid-rise blocks with a softer premium character",
        image: asset("04-residences-crop.jpg")
      },
      {
        eyebrow: "Sea Outlook",
        title: "A broader view across the landscaped masterplan",
        image: asset("05-masterplan-sea-view.jpg")
      },
      {
        eyebrow: "Arrival Walk",
        title: "Fountain-led promenades and greener daily movement",
        image: asset("06-arrival-fountain-walk.jpg")
      },
      {
        eyebrow: "Facade Close-Up",
        title: "Layered balconies, planting, and warm material detailing",
        image: asset("07-facade-close-up.jpg")
      }
    ]
  },
  snapshot: {
    eyebrow: "Premium Amenities",
    title: "Spaces shaped around greenery, movement, and quieter daily living",
    text: "The current design direction suggests a master community built to feel softer, more walkable, and more composed than a typical tower-led launch.",
    items: [
      {
        title: "Landscaped central gardens",
        text: "The visual direction centres on planted courtyards, shaded pathways, and a more relaxed daily rhythm."
      },
      {
        title: "Water feature arrival spaces",
        text: "A central fountain and resort-inspired outdoor composition help shape a stronger sense of place."
      },
      {
        title: "Wellness-led shared areas",
        text: "The positioning suggests a lifestyle built around outdoor movement, leisure, and cleaner community circulation."
      },
      {
        title: "Family-friendly layout",
        text: "Low-rise massing, wider outdoor zones, and calmer shared areas make the project easier to understand for both residents and visiting buyers."
      }
    ]
  },
  location: {
    eyebrow: "Location",
    title: "Dubailand, next to Global Village",
    bullets: [
      "Located in Dubailand next to Global Village for a well-known leisure and family destination.",
      "Straightforward access toward Sheikh Mohammed Bin Zayed Road.",
      "Convenient reach toward Dubai Outlet Mall and surrounding growth corridors.",
      "Connected toward business districts, schools, and lifestyle destinations across Dubai.",
      "Ask Oaklyn Realty for the latest location map and route guidance for this specific release."
    ],
    highlights: [
      "Dubailand positioning",
      "Global Village adjacency",
      "Access toward key Dubai road networks",
      "Support from Oaklyn Realty for live availability and route guidance"
    ]
  },
  faq: [
    {
      question: "What unit types are available?",
      answer: "The current launch brief highlights 1, 2, and 3 bedroom apartments."
    },
    {
      question: "What is the starting price?",
      answer: "The launch guidance shared for this page starts from AED 1.1M, subject to developer confirmation and unit selection."
    },
    {
      question: "How much do I need to book?",
      answer: "The page brief states a 10% booking amount. Always request the latest reservation terms before transferring funds."
    },
    {
      question: "What is the payment plan?",
      answer: "The current launch guidance shared for this page indicates a 60/40 payment plan, subject to final developer confirmation."
    }
  ],
  trustPoints: [
    {
      title: "Current launch guidance",
      text: "We help you review the latest price list, release notes, and availability rather than relying on outdated ads or recycled marketplace listings."
    },
    {
      title: "Architectural positioning",
      text: "The launch narrative is built around a lower-rise community feel, landscaped courtyards, and a calmer premium identity rather than a louder high-density pitch."
    },
    {
      title: "Clear consultant follow-up",
      text: "Your enquiry is handled by Oaklyn Realty so you can compare unit types, booking requirements, and next steps with a straightforward Dubai-market explanation."
    }
  ],
  form: {
    title: "Get the price list and current availability",
    text:
      "Share your basic enquiry details so Oaklyn Realty can send the latest price list, payment-plan guidance, bedroom availability, and next-step support for this launch.",
    submitLabel: "Get Project Details",
    cardTitle: "Direct Oaklyn follow-up",
    cardText:
      "Your enquiry goes to Oaklyn Realty so you can receive current launch information, clearer next-step guidance, and help comparing available unit types.",
    splitName: true,
    labels: {
      name: "Full Name",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      email: "Email Address",
      bedrooms: "How Many Bedrooms",
      project: "Project Requirements",
      propertyType: "Preferred Location",
      message: "Comments"
    },
    phoneCountries,
    bedroomPlaceholder: "Select bedroom requirement",
    bedroomOptions: [
      "1 Bedroom",
      "2 Bedrooms",
      "3 Bedrooms",
      "Not Sure Yet"
    ],
    projectRequirementsPlaceholder: "Select project requirement",
    preferredProjects: [
      "Price List",
      "Payment Plan 60/40",
      "Brochure",
      "Availability Update",
      "Site Visit",
      "Call Back"
    ],
    propertyTypes: ["Dubailand - Next to Global Village", "Dubailand", "I am exploring options"],
    messagePlaceholder: "Add comments, preferred contact time, or any specific request.",
    points: ["First and last name", "Phone number with country code", "Valid email, bedroom choice, project requirements, and comments"],
    whatsappPrefill: "Hello, I would like the latest price list and 60/40 payment plan for BEYOND in Dubailand next to Global Village.",
    consent:
      "By submitting this form, you agree to be contacted by our property consultants regarding your inquiry.",
    sensitiveDataNotice:
      "We only collect the basic lead information needed for enquiry follow-up and do not ask for sensitive information such as passport numbers, Emirates ID, salary, nationality, religion, or health-related data through this form.",
    blacklistBlockedMessage:
      "Thank you. Your inquiry has already been received.",
    blacklistErrorMessage:
      "Something went wrong. Please try again.",
    disclaimer:
      "All pricing, payment-plan details, inventory, and amenity details remain subject to developer confirmation."
  }
};
