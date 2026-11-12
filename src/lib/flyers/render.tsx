import { ImageResponse } from "next/og";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import {
  LOGO_VERTICAL_PNG,
  MONTSERRAT_400,
  MONTSERRAT_400I,
  MONTSERRAT_500,
  MONTSERRAT_600,
  MONTSERRAT_700,
} from "./assets/embedded";
import { FLYER_SCALE as S, FLYER_SIZES } from "./config";
import { PRICE_METRICS, renderPrice, renderStory, STORY_METRICS, type PreparedPhoto } from "./templates";
import { FLYER_MAX_PHOTOS, type FlyerData } from "./types";

export type PhotoLoader = (url: string) => Promise<Buffer>;

interface Decoded {
  buffer: Buffer;
  width: number;
  height: number;
}

const toArrayBuffer = (base64: string) => {
  const buffer = Buffer.from(base64, "base64");
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
};

let fontCache: { name: string; data: ArrayBuffer; weight: 400 | 500 | 600 | 700; style: "normal" | "italic" }[] | null = null;

function fonts() {
  fontCache ??= [
    { name: "Montserrat", data: toArrayBuffer(MONTSERRAT_400), weight: 400, style: "normal" },
    { name: "Montserrat", data: toArrayBuffer(MONTSERRAT_500), weight: 500, style: "normal" },
    { name: "Montserrat", data: toArrayBuffer(MONTSERRAT_600), weight: 600, style: "normal" },
    { name: "Montserrat", data: toArrayBuffer(MONTSERRAT_700), weight: 700, style: "normal" },
    { name: "Montserrat", data: toArrayBuffer(MONTSERRAT_400I), weight: 400, style: "italic" },
  ];
  return fontCache;
}

export const MAX_PHOTO_BYTES = 20 * 1024 * 1024;

export function createRemoteLoader(origin: string): PhotoLoader {
  return async (url) => {
    const target = new URL(url, origin);
    if (target.protocol !== "https:" && target.protocol !== "http:") throw new Error("Foto con dirección inválida");
    const response = await fetch(target, {
      signal: AbortSignal.timeout(20000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BoettoFlyer/1.0)" },
    });
    if (!response.ok) throw new Error(`No se pudo descargar una foto (código ${response.status})`);
    const length = Number(response.headers.get("content-length") || 0);
    if (length > MAX_PHOTO_BYTES) throw new Error("Una foto es demasiado pesada");
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > MAX_PHOTO_BYTES) throw new Error("Una foto es demasiado pesada");
    return bytes;
  };
}

async function decode(buffer: Buffer): Promise<Decoded> {
  const { data, info } = await sharp(buffer).rotate().toBuffer({ resolveWithObject: true });
  return { buffer: data, width: info.width, height: info.height };
}

async function cover(photo: Decoded, width: number, height: number): Promise<PreparedPhoto> {
  const jpeg = await sharp(photo.buffer)
    .resize(Math.round(width * S), Math.round(height * S), { fit: "cover", position: "centre" })
    .flatten({ background: "#2D2C28" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  return { src: `data:image/jpeg;base64,${jpeg.toString("base64")}` };
}

// Splits a row of the given width among photos in proportion to their shapes.
function proportionalWidths(photos: Decoded[], total: number, gap: number) {
  const usable = total - gap * (photos.length - 1);
  const shapes = photos.map((photo) => Math.min(2, Math.max(0.7, photo.width / photo.height)));
  const sum = shapes.reduce((acc, shape) => acc + shape, 0);
  return shapes.map((shape) => (shape / sum) * usable);
}

function equalWidths(count: number, total: number, gap: number) {
  const width = (total - gap * (count - 1)) / count;
  return Array.from({ length: count }, () => width);
}

export interface RenderedFlyer {
  jpeg: Buffer;
  width: number;
  height: number;
}

export async function renderFlyer(data: FlyerData, loadPhoto: PhotoLoader): Promise<RenderedFlyer> {
  const size = FLYER_SIZES[data.template];
  const urls = data.photos.slice(0, FLYER_MAX_PHOTOS[data.template]);
  const decoded = await Promise.all(urls.map(async (url) => decode(await loadPhoto(url))));
  const logo = `data:image/png;base64,${LOGO_VERTICAL_PNG}`;

  let element;
  let prepared: PreparedPhoto[];

  if (data.template === "story") {
    const M = STORY_METRICS;
    const bigCount = Math.min(decoded.length, 2);
    const bigSlots = bigCount === 1 ? [M.bigHeights[0] + M.photoGap + M.bigHeights[1]] : M.bigHeights;
    const smalls = decoded.slice(2);
    const smallWidths = proportionalWidths(smalls, M.contentWidth, M.smallGap);
    prepared = await Promise.all([
      ...decoded.slice(0, bigCount).map((photo, i) => cover(photo, M.contentWidth, bigSlots[i])),
      ...smalls.map((photo, i) => cover(photo, smallWidths[i], M.smallHeight)),
    ]);
    element = renderStory(data, prepared, logo, smallWidths);
  } else {
    const M = PRICE_METRICS;
    const smalls = decoded.slice(1);
    const smallWidths = equalWidths(Math.max(smalls.length, 1), M.contentWidth, M.smallGap);
    prepared = await Promise.all([
      cover(decoded[0], M.contentWidth, M.mainHeight),
      ...smalls.map((photo, i) => cover(photo, smallWidths[i], M.smallHeight)),
    ]);
    element = renderPrice(data, prepared, logo, smallWidths);
  }

  const response = new ImageResponse(element, {
    width: size.width * S,
    height: size.height * S,
    fonts: fonts(),
  });
  const png = Buffer.from(await response.arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 93, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();
  return { jpeg, width: size.width * S, height: size.height * S };
}

export async function flyerToPdf(flyer: RenderedFlyer, title: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setAuthor("Boetto Propiedades");
  pdf.setCreator("Boetto Propiedades");
  const image = await pdf.embedJpg(flyer.jpeg);
  const page = pdf.addPage([flyer.width / S, flyer.height / S]);
  page.drawImage(image, { x: 0, y: 0, width: flyer.width / S, height: flyer.height / S });
  return pdf.save();
}
