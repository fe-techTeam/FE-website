/**
 * Shared office locations + street addresses + local contacts.
 * Used by About, Contact, and Home location cards.
 */

export type OfficeContact = {
  name: string;
  email: string;
  phone: string;
  phoneHref: string;
};

export type OfficeLocation = {
  slug: string;
  city: string;
  isHq?: boolean;
  /** Short marketing line for About / Home cards */
  description: string;
  /** Full street / location line */
  address: string;
  contact?: OfficeContact;
  image: {
    src: string;
    alt: string;
  };
};

export const officeLocations: OfficeLocation[] = [
  {
    slug: "mumbai",
    city: "Mumbai",
    isHq: true,
    description: "The financial capital of India.",
    address:
      "Plot No. 240, 240/1 to 8, 2nd Floor, Office No. 205 & 206, Neelkanth Corporate IT Park, Kirol Road, Vidya Vihar West, Mumbai 400086",
    image: {
      src: "/images/about/locations/mumbai.jpg",
      alt: "Gateway of India and the Taj Mahal Palace, Mumbai",
    },
  },
  {
    slug: "bengaluru",
    city: "Bengaluru",
    description: "The Silicon Valley of India.",
    address: "Bengaluru, Karnataka",
    contact: {
      name: "Megha Mathur",
      email: "megha@firsteconomy.com",
      phone: "+91 86960 23191",
      phoneHref: "tel:+918696023191",
    },
    image: {
      src: "/images/about/locations/bengaluru.jpg",
      alt: "Bengaluru skyline above tree canopy",
    },
  },
  {
    slug: "aurangabad",
    city: "Chhatrapati Sambhaji Nagar",
    description: "Heritage city. Emerging tomorrow.",
    address:
      "Office 101, First Floor, Vastu Elite Square, Beed Bypass, Chhatrapati Sambhaji Nagar (Aurangabad), 431001",
    image: {
      src: "/images/about/locations/aurangabad.jpg",
      alt: "Historic monument and gardens in Chhatrapati Sambhaji Nagar",
    },
  },
  {
    slug: "pune",
    city: "Pune",
    description: "A hub for innovation and education.",
    address: "WeWork, Kalyani Nagar, Pune",
    contact: {
      name: "Deep Ajmera",
      email: "deepajmera@firsteconomy.com",
      phone: "+91 99870 22040",
      phoneHref: "tel:+919987022040",
    },
    image: {
      src: "/images/about/locations/pune.jpg",
      alt: "Shaniwar Wada gateway in Pune",
    },
  },
];
