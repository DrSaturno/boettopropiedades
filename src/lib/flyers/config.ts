import type { FlyerTemplate } from "./types";

// Layouts are drawn in the pixel units of the reference pieces and rendered at SCALE times that size.
export const FLYER_SCALE = 2;

export const FLYER_SIZES: Record<FlyerTemplate, { width: number; height: number }> = {
  story: { width: 720, height: 1280 },
  price: { width: 949, height: 1599 },
};

export const FLYER_COLORS = {
  background: "#2D2C28",
  cream: "#F8F1E1",
  creamSoft: "#F2EEE2",
  grey: "#9E9E96",
  greyText: "#97968E",
  line: "#4B4A46",
  border: "#484743",
  sage: "#92A999",
  sageDark: "#192117",
  copper: "#D8B297",
  copperSoft: "#C9AA92",
  copperLine: "#B09580",
  card: "#3A3532",
  priceLabel: "#928E86",
  descPrice: "#C1BDB4",
  detail: "#D5D0C7",
};

export const FLYER_SIGNATURE = {
  name: "Julio César Boetto",
  details: "Corredor Inmobiliario · CPI 9854 · CUCICBA",
};
