/** Shared device-mockup config for case studies with a live-site DeviceShowcase (hero and/or Execution section). */

export const MAHINDRA_MANULIFE_LIVE_URL = "https://www.mahindramanulife.com/";
export const MAHINDRA_MANULIFE_SCREENS = [
  { src: "/images/work/gallery/mahindra-manulife/website-full.png", alt: "Mahindra Manulife investor website", width: 2560, height: 4277 },
];

export const ORPAT_ERP_LAPTOP_SCREENS = [
  { src: "/images/work/gallery/orpat-erp/01.png", alt: "Orpat ERP — admin dashboard overview", width: 1517, height: 769 },
  { src: "/images/work/gallery/orpat-erp/02.png", alt: "Orpat ERP — CNF distributor panel", width: 1518, height: 770 },
  { src: "/images/work/gallery/orpat-erp/04.png", alt: "Orpat ERP — channel finance transaction details", width: 1152, height: 830 },
];
export const ORPAT_ERP_MOBILE_SCREENS = [
  { src: "/images/work/gallery/orpat-erp/03.png", alt: "Orpat ERP — purchase dashboard, scrolled view", width: 960, height: 1868 },
];

export const AMBASSADOR_HOTEL_PHONE_SCREENS = [
  { src: "/images/work/gallery/ambassador-hotel/01.png", alt: "The Ambassador Hotel — Brand Experience Brief 1", width: 953, height: 536 },
  { src: "/images/work/gallery/ambassador-hotel/02.png", alt: "The Ambassador Hotel — Brand Experience Brief 2", width: 1008, height: 576 },
  { src: "/images/work/gallery/ambassador-hotel/03.png", alt: "The Ambassador Hotel — On-Property Execution 1", width: 520, height: 658 },
  { src: "/images/work/gallery/ambassador-hotel/04.png", alt: "The Ambassador Hotel — On-Property Execution 2", width: 446, height: 579 },
  { src: "/images/work/gallery/ambassador-hotel/05.png", alt: "The Ambassador Hotel — On-Property Execution 3", width: 951, height: 534 },
  { src: "/images/work/gallery/ambassador-hotel/06.png", alt: "The Ambassador Hotel — On-Property Execution 4", width: 635, height: 604 },
  { src: "/images/work/gallery/ambassador-hotel/07.png", alt: "The Ambassador Hotel — Craft Outcomes", width: 912, height: 496 },
];

/** Screen bounds measured from the laptop mockup’s alpha channel (1536×1024) — the true transparent cutout, not the outer chassis. */
export const LAPTOP_SCREEN_INSET = { top: 9.86, left: 15.3, right: 15.17, bottom: 26.07 };
/**
 * Phone mockup screen bounds (941×1672 canvas) — usable screen 713×1450px at x:113, y:100,
 * with a small safety margin added on every side so content clips inside the frame’s own
 * rounded-corner curve instead of spilling onto the metal edge at the corners.
 * The Dynamic Island sits inside this area at the top, so live-site content there can be
 * partially covered — unavoidable for a live embed, just worth knowing.
 */
export const MOBILE_SCREEN_INSET = { top: 7, left: 13, right: 13.2, bottom: 8.3 };
