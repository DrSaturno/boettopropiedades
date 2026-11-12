import type { CSSProperties, ReactElement } from "react";
import { FLYER_COLORS as C, FLYER_SCALE as S, FLYER_SIGNATURE, FLYER_SIZES } from "./config";
import type { FlyerData } from "./types";

export interface PreparedPhoto {
  src: string;
}

export interface Slot {
  width: number;
  height: number;
}

const u = (value: number) => value * S;
const FONT = "Montserrat";

function PhotoBox({
  photo,
  slot,
  radius,
  border,
}: {
  photo: PreparedPhoto;
  slot: Slot;
  radius: number;
  border?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: u(slot.width),
        height: u(slot.height),
        borderRadius: u(radius),
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        src={photo.src}
        width={u(slot.width)}
        height={u(slot.height)}
        style={{ position: "absolute", top: 0, left: 0, width: u(slot.width), height: u(slot.height) }}
      />
      {border ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: u(slot.width),
            height: u(slot.height),
            borderRadius: u(radius),
            border: `${u(1.5)}px solid ${border}`,
          }}
        />
      ) : null}
    </div>
  );
}

function Logo({ width, src }: { width: number; src: string }) {
  const height = width / 0.9314;
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img src={src} width={u(width)} height={u(height)} style={{ width: u(width), height: u(height) }} />;
}

function Badge({ text, style }: { text: string; style: CSSProperties }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#8FA797",
        color: C.sageDark,
        fontFamily: FONT,
        fontWeight: 700,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {text}
    </div>
  );
}

function DotText({ text, gap, style }: { text: string; gap: number; style?: CSSProperties }) {
  const parts = text.split(" · ").filter(Boolean);
  return (
    <div style={{ display: "flex", alignItems: "center", ...style }}>
      {parts.map((part, i) => (
        <div key={i} style={{ display: "flex" }}>
          {i > 0 ? <span style={{ margin: `0 ${u(gap)}px` }}>·</span> : null}
          <span>{part}</span>
        </div>
      ))}
    </div>
  );
}

function Signature({ size, uniform }: { size: number; uniform?: boolean }) {
  if (uniform) {
    return (
      <DotText
        text={`${FLYER_SIGNATURE.name} · ${FLYER_SIGNATURE.details}`}
        gap={7}
        style={{ justifyContent: "center", fontFamily: FONT, fontSize: u(size), fontWeight: 500, color: "#DCD8CF" }}
      />
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        fontFamily: FONT,
        fontSize: u(size),
        letterSpacing: u(0.3),
        color: C.cream,
      }}
    >
      <span style={{ fontWeight: 700 }}>{FLYER_SIGNATURE.name}</span>
      <span style={{ fontWeight: 400, color: "#EFEADD", marginLeft: u(size * 0.3) }}>{`· ${FLYER_SIGNATURE.details}`}</span>
    </div>
  );
}

export const STORY_METRICS = {
  contentWidth: 628,
  bigHeights: [246, 241],
  smallHeight: 174,
  photoGap: 9,
  smallGap: 12,
};

export function renderStory(data: FlyerData, photos: PreparedPhoto[], logo: string, smallWidths: number[]): ReactElement {
  const { width, height } = FLYER_SIZES.story;
  const M = STORY_METRICS;
  const bigCount = Math.min(photos.length, 2);
  const bigs = photos.slice(0, bigCount);
  const smalls = photos.slice(2);
  const bigSlots: Slot[] =
    bigCount === 1
      ? [{ width: M.contentWidth, height: M.bigHeights[0] + M.photoGap + M.bigHeights[1] }]
      : M.bigHeights.map((h) => ({ width: M.contentWidth, height: h }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: u(width),
        height: u(height),
        backgroundColor: C.background,
        padding: `${u(40)}px ${u(46)}px ${u(30)}px`,
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", height: u(120), marginBottom: u(26) }}>
        <Logo width={109} src={logo} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Badge text={data.badge} style={{ width: u(118), height: u(38), borderRadius: u(6), fontSize: u(17), letterSpacing: u(4) }} />
          <div
            style={{
              display: "flex",
              marginTop: u(8),
              fontSize: u(40.4),
              fontWeight: 700,
              lineHeight: 1.1,
              color: C.cream,
              letterSpacing: u(-0.2),
            }}
          >
            {data.zone}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: u(6),
              fontSize: u(17.2),
              fontWeight: 400,
              letterSpacing: u(1.5),
              textTransform: "uppercase",
              color: C.grey,
            }}
          >
            {data.subtitle}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {bigs.map((photo, i) => (
          <div key={i} style={{ display: "flex", marginTop: i === 0 ? 0 : u(M.photoGap) }}>
            <PhotoBox photo={photo} slot={bigSlots[i]} radius={8} />
          </div>
        ))}
        {smalls.length > 0 ? (
          <div style={{ display: "flex", marginTop: u(M.photoGap) }}>
            {smalls.map((photo, i) => (
              <div key={i} style={{ display: "flex", marginLeft: i === 0 ? 0 : u(M.smallGap) }}>
                <PhotoBox photo={photo} slot={{ width: smallWidths[i], height: M.smallHeight }} radius={8} />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: u(19),
          padding: `${u(17)}px ${u(24)}px ${u(18)}px`,
          border: `${u(1)}px solid ${C.border}`,
          borderRadius: u(12),
        }}
      >
        <div style={{ display: "flex", fontSize: u(25.2), fontWeight: 700, lineHeight: 1.25, color: C.cream }}>
          <span>{data.headline}</span>
          {data.headlineAccent ? <span style={{ color: "#DCBEA8", marginLeft: u(7) }}>{data.headlineAccent}</span> : null}
        </div>
        {data.description ? (
          <div style={{ display: "flex", marginTop: u(5), fontSize: u(14.7), lineHeight: 1.4, color: C.greyText }}>
            {data.description}
          </div>
        ) : null}
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: u(8), marginRight: u(-8) }}>
          {data.chips.map((chip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                height: u(29),
                padding: `0 ${u(12)}px`,
                marginRight: u(8),
                marginTop: u(8),
                borderRadius: u(14.5),
                border: chip.highlight ? `${u(1.2)}px solid ${C.sage}` : `${u(1.2)}px solid rgba(244,240,230,0.55)`,
                backgroundColor: chip.highlight ? C.sage : "transparent",
                color: chip.highlight ? "#18261A" : C.creamSoft,
                fontSize: u(14.2),
                fontWeight: 500,
              }}
            >
              {chip.text}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexGrow: 1 }} />

      <div style={{ display: "flex", flexDirection: "column", borderTop: `${u(1)}px solid ${C.line}`, paddingTop: u(15), paddingBottom: u(3) }}>
        <Signature size={16.8} />
      </div>
    </div>
  );
}

export const PRICE_METRICS = {
  contentWidth: 848,
  mainHeight: 566,
  smallHeight: 186,
  smallGap: 9,
};

export function renderPrice(data: FlyerData, photos: PreparedPhoto[], logo: string, smallWidths: number[]): ReactElement {
  const { width, height } = FLYER_SIZES.price;
  const M = PRICE_METRICS;
  const main = photos[0];
  const smalls = photos.slice(1);
  const features = data.features.filter(Boolean).slice(0, 3);
  const cells = data.chips.slice(0, 6);
  const cellRows = [cells.slice(0, 2), cells.slice(2, 4), cells.slice(4, 6)].filter((row) => row.length > 0);
  const copperText = C.copperSoft;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: u(width),
        height: u(height),
        backgroundColor: C.background,
        padding: `${u(95)}px ${u(51)}px 0 ${u(50)}px`,
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", height: u(167), marginBottom: u(12) }}>
        <Logo width={153} src={logo} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Badge
            text={data.badge}
            style={{ width: u(145), height: u(37), marginTop: u(3), borderRadius: u(18.5), fontSize: u(15), fontWeight: 600, letterSpacing: u(6.4) }}
          />
          <div
            style={{
              display: "flex",
              marginTop: u(17),
              fontSize: u(57.8),
              fontWeight: 700,
              lineHeight: 1.1,
              color: C.cream,
              letterSpacing: u(-0.4),
            }}
          >
            {data.zone}
          </div>
          <DotText text={data.subtitle} gap={9} style={{ marginTop: u(3), fontSize: u(20), fontWeight: 400, color: C.copperSoft }} />
        </div>
      </div>

      <div style={{ display: "flex", position: "relative" }}>
        <PhotoBox photo={main} slot={{ width: M.contentWidth, height: M.mainHeight }} radius={4} border={C.copperLine} />
        {data.reserved ? (
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              width: u(M.contentWidth),
              height: u(M.mainHeight),
              borderRadius: u(4),
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: u(280),
                top: u(100),
                width: u(800),
                height: u(128),
                backgroundColor: "#2D2C29",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(45deg)",
              }}
            >
              <div style={{ position: "absolute", top: u(8), left: 0, width: u(800), height: u(1.5), backgroundColor: C.copperLine }} />
              <div style={{ position: "absolute", bottom: u(8), left: 0, width: u(800), height: u(1.5), backgroundColor: C.copperLine }} />
              <div
                style={{
                  display: "flex",
                  fontSize: u(52),
                  fontWeight: 700,
                  letterSpacing: u(5),
                  color: C.cream,
                }}
              >
                RESERVADO
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {smalls.length > 0 ? (
        <div style={{ display: "flex", marginTop: u(9) }}>
          {smalls.map((photo, i) => (
            <div key={i} style={{ display: "flex", marginLeft: i === 0 ? 0 : u(M.smallGap) }}>
              <PhotoBox photo={photo} slot={{ width: smallWidths[i], height: M.smallHeight }} radius={4} border={C.copperLine} />
            </div>
          ))}
        </div>
      ) : null}

      {features.length > 0 ? (
        <div style={{ display: "flex", marginTop: u(10) }}>
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                flexBasis: 0,
                height: u(75),
                marginLeft: i === 0 ? 0 : u(10),
                padding: `0 ${u(66)}px`,
                border: `${u(1.5)}px solid ${C.copperLine}`,
                borderRadius: u(12),
                color: copperText,
                fontSize: u(18),
                fontWeight: 700,
                lineHeight: 1.3,
                textAlign: "center",
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: u(11),
          height: u(300),
          padding: `${u(26)}px ${u(28)}px 0 ${u(25)}px`,
          backgroundColor: C.card,
          border: `${u(2)}px solid #BE9A81`,
          borderRadius: u(14),
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", flexDirection: "column", width: u(310), marginRight: u(29) }}>
            <div style={{ display: "flex", paddingLeft: u(3), fontSize: u(13), letterSpacing: u(4.5), fontWeight: 500, color: C.priceLabel }}>PRECIO</div>
            {data.price ? (
              <div style={{ display: "flex", flexDirection: "column", marginTop: u(4) }}>
                <div style={{ display: "flex", paddingLeft: u(3), fontSize: u(43.2), fontWeight: 700, lineHeight: 1.15, color: C.copper, letterSpacing: u(-0.5) }}>
                  {data.price}
                </div>
                <div style={{ display: "flex", height: u(3), marginTop: u(3), backgroundColor: "#C9A58B" }} />
              </div>
            ) : null}
            {data.priceNote ? (
              <DotText text={data.priceNote} gap={8} style={{ marginTop: u(12), paddingLeft: u(3), fontSize: u(17.4), color: C.detail }} />
            ) : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: u(-4) }}>
            {cellRows.map((row, r) => (
              <div key={r} style={{ display: "flex", marginTop: r === 0 ? 0 : u(10) }}>
                {row.map((chip, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: u(222),
                      height: u(38),
                      marginLeft: i === 0 ? 0 : u(11),
                      border: `${u(1.5)}px solid ${C.copperLine}`,
                      borderRadius: u(8),
                      color: copperText,
                      fontSize: u(16.4),
                      fontWeight: 700,
                    }}
                  >
                    {chip.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {data.description ? (
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: u(33),
              top: u(207),
              width: u(785),
              fontSize: u(17.4),
              fontStyle: "italic",
              lineHeight: 1.37,
              color: C.descPrice,
            }}
          >
            {data.description}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", marginTop: u(14), justifyContent: "center" }}>
        <Signature size={14.9} uniform />
      </div>
    </div>
  );
}
