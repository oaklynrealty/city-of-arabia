import { phoneCountries } from "./country-codes.mjs";
import { getTrackingConfig } from "../shared/gtm.mjs";

const asset = (name) => `/assets/beyond-global-village/${name}`;

export const project = {
  name: "BEYOND Master Community Near Global Village",
  navLabel: "Dubailand Launch",
  slug: "beyond-global-village",
  sourcePage: "beyond-global-village.oaklynrealty.ae",
  landingPageUrl: "https://beyond-global-village.oaklynrealty.ae/",
  thankYouPageUrl: "https://beyond-global-village.oaklynrealty.ae/thank-you",
  routePath: "/beyond-global-village",
  alternateThankYouPath: "/beyond-global-village-thank-you",
  assetVersion: "20260521-beyond-global-village-short-landing-2",
  webhookUrl: "https://hooks.zapier.com/hooks/catch/27424919/uvzwm7a/",
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
      "Explore 1 to 3 bedroom apartments by BEYOND in Dubailand next to Global Village. From AED 1.4M with 10% booking."
  },
  hero: {
    eyebrow: "Presented by Oaklyn Realty",
    title: "BEYOND's First Master community",
    subtitle:
      "Next to Global Village, this upcoming BEYOND launch introduces 1 to 3 bedroom apartments in a greener low-rise setting, from AED 1.4M with 10% booking, subject to developer confirmation.",
    background: asset("01-hero-community-view.jpg"),
    primaryCta: "Request Price List",
    secondaryCta: "Book a Callback",
    badges: ["1 to 3 bedroom apartments", "From AED 1.4M", "10% booking", "Dubailand next to Global Village"]
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
    { label: "Starting Price", value: "From AED 1.4M" },
    { label: "Booking Amount", value: "10% to Reserve" },
    { label: "Location", value: "Dubailand" },
    { label: "Payment Plan", value: "Flexible" },
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
      "The current brief indicates 10% to book, with the balance expected across flexible staged payments. Exact milestone dates remain subject to the latest developer release.",
    steps: [
      {
        label: "Reserve",
        value: "10% on booking",
        note: "Use the opening booking amount to secure a preferred unit while launch inventory is available."
      },
      {
        label: "During Construction",
        value: "Staged installments",
        note: "The balance is expected to be distributed across construction-linked milestones."
      },
      {
        label: "Before You Commit",
        value: "Request the latest schedule",
        note: "Ask for the most current payment plan, service-charge guidance, and availability before placing funds."
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
      answer: "The launch guidance shared for this page starts from AED 1.4M, subject to developer confirmation and unit selection."
    },
    {
      question: "How much do I need to book?",
      answer: "The page brief states a 10% booking amount. Always request the latest reservation terms before transferring funds."
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
    title: "Request current project details",
    text:
      "Share your details and Oaklyn Realty will send the current price list, available unit types, and latest payment-plan guidance for this release.",
    splitName: false,
    labels: {
      name: "Full Name",
      phone: "Phone Number",
      email: "Email Address",
      project: "Preferred Unit Type",
      propertyType: "Preferred Location",
      message: "Message or Inquiry"
    },
    phoneCountries,
    preferredProjects: ["1 Bedroom Apartment", "2 Bedroom Apartment", "3 Bedroom Apartment", "I need advice"],
    propertyTypes: ["Dubailand - Next to Global Village", "Dubailand", "I am exploring options"],
    messagePlaceholder: "Tell us if you want the price list, brochure, payment plan, or a callback.",
    points: ["Current price list", "Latest payment plan", "Consultant follow-up from Oaklyn Realty"],
    whatsappPrefill: "Hello, I would like the latest price list and payment plan for BEYOND in Dubailand next to Global Village.",
    consent:
      "By submitting this form, you agree to be contacted by our property consultants regarding your inquiry.",
    sensitiveDataNotice:
      "We only request basic enquiry details and do not ask for sensitive information such as passport numbers, Emirates ID, salary, nationality, religion, or health-related data through this form.",
    disclaimer:
      "All pricing, payment plans, inventory, and amenity details remain subject to developer confirmation."
  }
};
