/**
 * Client logos — original embedded PNGs from creds deck slides 7–8.
 * Copied byte-for-byte from .pptx-extract/ppt/media/ (no crop, resize, or recompress).
 * Display uses contentBox (tight ink bounds) to frame artwork in CSS — PNG files are never modified.
 * See public/images/partners/clients/manifest.json for source mapping.
 */

import partnerManifest from "../../public/images/partners/clients/manifest.json";

export type PartnerLogo = {
  slug: string;
  name: string;
  src: string;
  width: number;
  height: number;
  sourceMedia: string;
  sourceSlide: number;
  /** When set, SVG frames to these ink bounds. Omit to show the full original image. */
  contentBox?: [number, number, number, number];
  index?: number;
};

export const clientLogos = partnerManifest as unknown as PartnerLogo[];
