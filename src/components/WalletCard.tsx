import { ACCENT_HEX, COLORS, ISSUERS, NETWORKS, getDesign, type CardConfig, type Material, type Pattern } from "@/data/designs";
import { BRAND } from "@/lib/i18n";

// Card faces are rendered from config data; inline styles carry product colors, not UI theme.
function surface(material: Material, base: string) {
  switch (material) {
    case "matte":
      return `radial-gradient(120% 90% at 15% 0%, rgba(255,255,255,.07), transparent 60%), radial-gradient(80% 80% at 100% 100%, rgba(0,0,0,.35), transparent 70%), ${base}`;
    case "brushed":
      return `repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 1px, rgba(0,0,0,.06) 1px 2px, transparent 2px 3px), linear-gradient(100deg, rgba(0,0,0,.18), rgba(255,255,255,.2) 42%, rgba(0,0,0,.12) 68%, rgba(255,255,255,.1)), ${base}`;
    case "polished":
      return `linear-gradient(115deg, rgba(255,255,255,0) 18%, rgba(255,255,255,.42) 34%, rgba(255,255,255,.04) 46%, rgba(255,255,255,.18) 58%, rgba(0,0,0,.3) 86%), ${base}`;
    case "carbon":
      return `repeating-linear-gradient(45deg, rgba(255,255,255,.07) 0 2px, transparent 2px 5px), repeating-linear-gradient(-45deg, rgba(0,0,0,.4) 0 2px, transparent 2px 5px), linear-gradient(160deg, rgba(255,255,255,.08), rgba(0,0,0,.3)), ${base}`;
    case "satin":
      return `linear-gradient(155deg, rgba(255,255,255,.2), rgba(255,255,255,.02) 45%, rgba(0,0,0,.28)), ${base}`;
  }
}

function PatternLayer({ pattern, color }: { pattern: Pattern; color: string }) {
  const o = 0.35;
  switch (pattern) {
    case "lines":
      return (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 316 200" preserveAspectRatio="none">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${150 + i * 26} 0 L${316} ${120 - i * 18}`} stroke={color} strokeOpacity={o - i * 0.04} strokeWidth=".6" fill="none" />
          ))}
        </svg>
      );
    case "geometric":
      return (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 316 200" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="geo" width="22" height="38" patternUnits="userSpaceOnUse">
              <path d="M11 0 L22 9.5 L22 28.5 L11 38 L0 28.5 L0 9.5 Z" stroke={color} strokeOpacity={o * 0.6} strokeWidth=".5" fill="none" />
            </pattern>
            <linearGradient id="geoFade" x1="0" x2="1"><stop offset="0.35" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" /></linearGradient>
            <mask id="geoMask"><rect width="316" height="200" fill="url(#geoFade)" /></mask>
          </defs>
          <rect width="316" height="200" fill="url(#geo)" mask="url(#geoMask)" />
        </svg>
      );
    case "industrial":
      return (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 316 200" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M12 0 L0 0 0 12" stroke={color} strokeOpacity={o * 0.35} strokeWidth=".4" fill="none" />
            </pattern>
          </defs>
          <rect x="196" y="0" width="120" height="200" fill="url(#grid)" />
          <rect x="196" y="0" width="0.8" height="200" fill={color} fillOpacity={o} />
          {[[206, 10], [306, 10], [206, 190], [306, 190]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" fill={color} fillOpacity={o + 0.1} />
          ))}
          <text x="300" y="104" fontSize="6" fill={color} fillOpacity={o + 0.15} fontFamily="monospace" textAnchor="end" letterSpacing="1.5">VT-07</text>
        </svg>
      );
    case "metallic":
      return (
        <div
          className="absolute inset-y-0 right-[14%] w-[9%]"
          style={{ background: `linear-gradient(90deg, transparent, ${color}55 30%, ${color}aa 50%, ${color}55 70%, transparent)` }}
        />
      );
    default:
      return null;
  }
}

const FONT_FAMILY = { sans: "var(--font-sans)", mono: "var(--font-mono)", serif: "'Instrument Serif', Georgia, serif" };

export function CardFront({ config, glare = 50 }: { config: CardConfig; glare?: number }) {
  const base = COLORS[config.color];
  const accent = ACCENT_HEX[config.accent];
  const ink = base.light ? "rgba(10,10,12,.82)" : "rgba(245,245,242,.9)";
  const design = getDesign(config.designId);
  const pos =
    config.textPos === "center"
      ? "inset-x-0 top-1/2 -translate-y-1/2 text-center"
      : config.textPos === "bottom-right"
        ? "right-[7%] bottom-[9%] text-right"
        : `left-[7%] ${config.lastFour ? "bottom-[18%]" : "bottom-[9%]"}`;

  if (design.name === "Daniel Vorcaro — Banco Master") {
    const tint = config.color === "gold" ? "sepia(.42) saturate(1.25)" : config.color === "silver" ? "grayscale(.65) brightness(1.12)" : config.color === "darkgreen" ? "hue-rotate(75deg) saturate(.78)" : config.color === "navy" ? "hue-rotate(165deg) saturate(.8)" : config.color === "black" || config.color === "graphite" ? "brightness(.68) saturate(.72)" : config.color === "darkpurple" ? "hue-rotate(35deg) saturate(.85)" : "none";
    const finish = config.material === "matte" ? "saturate(.82) contrast(.96)" : config.material === "polished" ? "contrast(1.12) saturate(1.08)" : config.material === "brushed" ? "contrast(1.08) saturate(.92)" : config.material === "carbon" ? "contrast(1.18) brightness(.88)" : "contrast(1.02)";
    return (
      <div className="@container absolute inset-0 overflow-hidden rounded-[4.6cqw] bg-[#080b10]">
        <img src="/daniel-vorcaro.png" alt="Daniel Vorcaro card artwork" className="absolute inset-0 h-full w-full object-cover" style={{ filter: `${tint} ${finish}`, transform: "scale(1.001)" }} />
        {config.issuer === "banco-master" && (
          <div className="absolute left-[0.5%] top-[7%] z-10 w-[52.8%]">
            <img src="/banco-master.png" alt="Banco Master" className="block h-auto w-full object-contain" style={{ mixBlendMode: "screen" }} />
          </div>
        )}
        {config.issuer !== "none" && config.issuer !== "banco-master" && (
          <div className="absolute left-[6%] top-[7%] z-10 text-[3.1cqw] font-semibold tracking-[0.12em] text-white drop-shadow-md">
            {ISSUERS.find((item) => item.id === config.issuer)?.label.toUpperCase()}
          </div>
        )}
        {config.network === "mastercard" && (
          <div className="absolute bottom-[3%] right-[1%] z-10 w-[50.4%]">
            <img src="/mastercard.png" alt="Mastercard" className="block h-auto w-full object-contain" style={{ mixBlendMode: "screen" }} />
          </div>
        )}
        {config.network !== "none" && config.network !== "mastercard" && (
          <div className="absolute bottom-[8%] right-[6%] z-10 text-[2.8cqw] font-semibold tracking-[0.1em] text-white drop-shadow-md">
            {NETWORKS.find((item) => item.id === config.network)?.label.toUpperCase()}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0" style={{ background: config.material === "polished" ? "linear-gradient(118deg,transparent 18%,rgba(255,255,255,.48) 34%,transparent 48%,rgba(255,255,255,.12) 62%,transparent 78%)" : config.material === "brushed" ? "repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0 1px,transparent 1px 4px)" : config.material === "carbon" ? "repeating-linear-gradient(45deg,rgba(0,0,0,.18) 0 2px,transparent 2px 5px)" : "linear-gradient(145deg,rgba(255,255,255,.10),transparent 35%,rgba(0,0,0,.15))", mixBlendMode: "soft-light" }} />
        {config.pattern !== "plain" && <PatternLayer pattern={config.pattern} color={accent} />}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ boxShadow: `inset 0 0 0 ${config.accent === "black" ? "1px" : "2px"} ${accent}aa, inset 0 0 0 5px rgba(0,0,0,.12), inset 0 -2px 5px rgba(0,0,0,.35)` }} />
        {config.text && <div className={`absolute z-10 ${pos} max-w-[86%] truncate px-2 text-[4.4cqw] tracking-[0.12em] uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,.9)]`} style={{ color: config.color === "silver" || config.color === "gold" ? "#fff8e8" : "#fff", fontFamily: FONT_FAMILY[config.font], fontSize: config.font === "serif" ? "6cqw" : undefined, letterSpacing: config.font === "serif" ? "0.02em" : undefined }}>{config.text}</div>}
        {config.lastFour && <div className="absolute bottom-[7%] left-[7%] z-10 whitespace-nowrap font-mono text-[4.5cqw] tracking-[0.11em] text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,.9)]">•••• {config.lastFour}</div>}
        <div className="pointer-events-none absolute inset-0" style={{ background: config.pattern === "metallic" ? `linear-gradient(110deg,transparent 28%,${accent}44 48%,transparent 68%)` : "transparent" }} />
      </div>
    );
  }

  return (
    <div className="@container absolute inset-0 overflow-hidden rounded-[4.6cqw]" style={{ background: surface(config.material, base.hex) }}>
      <PatternLayer pattern={config.pattern} color={accent} />
      {/* moving glare */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light transition-[background] duration-300"
        style={{ background: `radial-gradient(70% 90% at ${glare}% 0%, rgba(255,255,255,.45), transparent 60%)` }}
      />
      {/* edge */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.3)" }} />

      <div className="absolute left-[7%] top-[9%] text-[5cqw] font-semibold tracking-[0.22em]" style={{ color: ink }}>
        {config.issuer === "banco-master" ? <img src="/banco-master.png" alt="Banco Master" className="h-[12.6cqw] max-w-[48%] object-contain object-left" /> : config.issuer && config.issuer !== "none" ? ISSUERS.find((item) => item.id === config.issuer)?.label.toUpperCase() : BRAND}
      </div>
      <div className="absolute right-[7%] top-[10%] max-w-[42%] truncate text-right font-mono text-[2.4cqw] uppercase tracking-[0.12em]" style={{ color: ink, opacity: 0.7 }}>
        {config.network === "mastercard" ? <img src="/mastercard.png" alt="Mastercard" className="ml-auto h-[12.6cqw] max-w-[40.8%] object-contain object-right" /> : config.network && config.network !== "none" ? NETWORKS.find((item) => item.id === config.network)?.label : design.collection}
      </div>
      {config.text && (
        <div
          className={`absolute ${pos} max-w-[86%] truncate text-[4.4cqw] tracking-[0.12em] uppercase`}
          style={{ color: ink, fontFamily: FONT_FAMILY[config.font], textTransform: config.font === "serif" ? "none" : "uppercase", fontSize: config.font === "serif" ? "6cqw" : undefined, letterSpacing: config.font === "serif" ? "0.02em" : undefined }}
        >
          {config.text}
        </div>
      )}
      {config.lastFour && <div className="absolute bottom-[7%] left-[7%] z-10 whitespace-nowrap font-mono text-[3.8cqw] tracking-[0.13em] drop-shadow-[0_1px_3px_rgba(0,0,0,.9)]" style={{ color: ink }}>•••• {config.lastFour}</div>}
      {config.textPos !== "bottom-right" && (
        <div className="absolute bottom-[9%] right-[7%] font-mono text-[2.6cqw] tracking-[0.2em]" style={{ color: ink, opacity: 0.5 }}>
          DEMO
        </div>
      )}
    </div>
  );
}

export function CardBack({ config }: { config: CardConfig }) {
  const base = COLORS[config.color];
  const ink = base.light ? "rgba(10,10,12,.75)" : "rgba(245,245,242,.8)";
  return (
    <div className="@container absolute inset-0 overflow-hidden rounded-[4.6cqw]" style={{ background: surface(config.material, base.hex) }}>
      <div className="absolute inset-x-0 top-[12%] h-[17%]" style={{ background: "linear-gradient(180deg,#0a0a0b,#1b1c1f)" }} />
      <div className="absolute left-[7%] top-[40%] h-[11%] w-[60%] rounded-[1cqw]" style={{ background: "repeating-linear-gradient(90deg, rgba(255,255,255,.85) 0 3px, rgba(230,230,225,.85) 3px 6px)" }} />
      <div className="absolute left-[70%] top-[42%] font-mono text-[3cqw]" style={{ color: ink }}>•••</div>
      <div className="absolute bottom-[10%] left-[7%] font-mono text-[2.6cqw] leading-relaxed tracking-[0.15em]" style={{ color: ink }}>
        DEMONSTRATION ONLY · NOT A PAYMENT CARD
        <br />
        {BRAND} · {getDesign(config.designId).name.toUpperCase()}
      </div>
    </div>
  );
}

/** Static, flat card (for grids and thumbnails). */
export function WalletCard({ config, className = "" }: { config: CardConfig; className?: string }) {
  return (
    <div className={`relative aspect-[1.586] w-full ${className}`}>
      <CardFront config={config} />
    </div>
  );
}
