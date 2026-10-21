// Catalog data: kept separate from presentation. Values here are product content.
export type Material = "matte" | "brushed" | "polished" | "carbon" | "satin";
export type ColorId =
  | "black" | "graphite" | "silver" | "white" | "navy"
  | "metalblue" | "darkgreen" | "gold" | "rosegold" | "darkpurple";
export type Pattern = "lines" | "geometric" | "industrial" | "plain" | "metallic";
export type Accent = "silver" | "gold" | "black" | "neutral";
export type FontId = "sans" | "mono" | "serif";
export type TextPos = "bottom-left" | "bottom-right" | "center";
export type IssuerId = "none" | "nubank" | "inter" | "c6" | "neon";
export type NetworkId = "none" | "visa" | "mastercard" | "elo" | "amex";
export const ISSUERS: { id: IssuerId; label: string }[] = [
  { id: "none", label: "Sem emissor" }, { id: "nubank", label: "Nubank" },
  { id: "inter", label: "Inter" }, { id: "c6", label: "C6 Bank" }, { id: "neon", label: "Neon" },
];
export const NETWORKS: { id: NetworkId; label: string }[] = [
  { id: "none", label: "Sem bandeira" }, { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" }, { id: "elo", label: "Elo" }, { id: "amex", label: "American Express" },
];
export type Collection = "Titanium" | "Noir" | "Chrome" | "Minimal" | "Signature" | "Industrial";

export const MATERIALS: Material[] = ["matte", "brushed", "polished", "carbon", "satin"];
export const PATTERNS: Pattern[] = ["lines", "geometric", "industrial", "plain", "metallic"];
export const ACCENTS: Accent[] = ["silver", "gold", "black", "neutral"];
export const FONTS: FontId[] = ["sans", "mono", "serif"];
export const TEXT_POSITIONS: TextPos[] = ["bottom-left", "bottom-right", "center"];
export const COLLECTIONS: Collection[] = ["Titanium", "Noir", "Chrome", "Minimal", "Signature", "Industrial"];
export const TEXT_MAX = 22;

export const COLORS: Record<ColorId, { hex: string; light: boolean }> = {
  black: { hex: "#0b0c0e", light: false },
  graphite: { hex: "#2c2f35", light: false },
  silver: { hex: "#b9bec5", light: true },
  white: { hex: "#ecebe6", light: true },
  navy: { hex: "#141d33", light: false },
  metalblue: { hex: "#36557d", light: false },
  darkgreen: { hex: "#16302a", light: false },
  gold: { hex: "#b39257", light: true },
  rosegold: { hex: "#c39a8c", light: true },
  darkpurple: { hex: "#2a1c38", light: false },
};
export const COLOR_IDS = Object.keys(COLORS) as ColorId[];

export const ACCENT_HEX: Record<Accent, string> = {
  silver: "#d8dce1",
  gold: "#d6b56f",
  black: "#0a0a0b",
  neutral: "#8d9099",
};

export interface CardConfig {
  designId: string;
  material: Material;
  color: ColorId;
  pattern: Pattern;
  accent: Accent;
  text: string;
  font: FontId;
  textPos: TextPos;
  issuer: IssuerId;
  network: NetworkId;
}

export interface Design {
  id: string;
  name: string;
  collection: Collection;
  description: { pt: string; en: string };
  defaults: Omit<CardConfig, "designId" | "text" | "font" | "textPos">;
  allowed: { materials: Material[]; colors: ColorId[]; patterns: Pattern[]; accents: Accent[] };
  available: boolean;
  demo: boolean;
  order: number;
}

type Seed = [string, Collection, Material, ColorId, Pattern, Accent, string, string, Partial<Design["allowed"]>?, boolean?];

const DARK: ColorId[] = ["black", "graphite", "navy", "metalblue", "darkgreen", "darkpurple"];
const METALS: ColorId[] = ["silver", "graphite", "black", "metalblue", "gold", "rosegold"];

const seeds: Seed[] = [
  ["Spider-Man — Webline", "Signature", "satin", "darkpurple", "lines", "silver", "Arte original do Homem-Aranha com opções visuais dinâmicas.", "Original Spider-Man artwork with dynamic visual options.", { materials: ["matte", "satin", "polished"], colors: ["black", "graphite", "silver", "navy", "darkgreen", "gold", "darkpurple"], patterns: ["lines", "geometric", "plain"], accents: ["silver", "gold", "black", "neutral"] }],
  ["Titanium Silver", "Titanium", "brushed", "silver", "lines", "black", "Titânio escovado claro com linhas finas gravadas.", "Light brushed titanium with fine engraved lines.", { colors: METALS }],
  ["Titanium Black", "Titanium", "brushed", "black", "lines", "silver", "Titânio negro com reflexo frio e contido.", "Black titanium with a cold, restrained sheen.", { colors: DARK.concat("silver") }],
  ["Titanium Graphite", "Titanium", "satin", "graphite", "metallic", "silver", "Grafite acetinado com faixa metálica lateral.", "Satin graphite with a side metallic band.", { colors: METALS }],
  ["Titanium Blue", "Titanium", "brushed", "metalblue", "geometric", "silver", "Titânio anodizado azul com malha geométrica.", "Anodized blue titanium with a geometric mesh.", { colors: ["metalblue", "navy", "graphite", "silver"] }],
  ["Noir Matte", "Noir", "matte", "black", "plain", "neutral", "Preto absoluto, sem distrações.", "Absolute black, no distractions.", { colors: DARK }],
  ["Noir Obsidian", "Noir", "polished", "black", "geometric", "silver", "Obsidiana polida com facetas sutis.", "Polished obsidian with subtle facets.", { colors: DARK }],
  ["Noir Carbon", "Noir", "carbon", "black", "plain", "silver", "Trama de fibra de carbono em preto profundo.", "Carbon fiber weave in deep black.", { materials: ["carbon", "matte"], colors: ["black", "graphite", "navy"] }],
  ["Noir Eclipse", "Noir", "satin", "darkpurple", "lines", "gold", "Eclipse violeta com halo dourado.", "Violet eclipse with a gold halo.", { colors: DARK }],
  ["Chrome Silver", "Chrome", "polished", "silver", "plain", "black", "Cromo espelhado com reflexo diagonal.", "Mirror chrome with a diagonal reflection.", { colors: METALS }],
  ["Chrome Mirror", "Chrome", "polished", "white", "metallic", "silver", "Espelho claro com faixa líquida.", "Bright mirror with a liquid band.", { colors: ["white", "silver", "rosegold", "gold"] }],
  ["Chrome Dark", "Chrome", "polished", "graphite", "lines", "silver", "Cromo escurecido com linhas de luz.", "Smoked chrome with light lines.", { colors: DARK.concat("silver") }],
  ["Chrome Ice", "Chrome", "satin", "metalblue", "geometric", "silver", "Azul gelo acetinado e cristalino.", "Satin ice blue, crystalline.", { colors: ["metalblue", "silver", "white", "navy"] }],
  ["Minimal White", "Minimal", "matte", "white", "plain", "black", "Branco cerâmico, quieto e preciso.", "Ceramic white, quiet and precise.", { colors: ["white", "silver", "rosegold", "black"], materials: ["matte", "satin"] }],
  ["Minimal Stone", "Minimal", "matte", "silver", "lines", "black", "Pedra fria com uma única linha.", "Cold stone with a single line.", { colors: ["silver", "white", "graphite"], materials: ["matte", "satin"] }],
  ["Minimal Black", "Minimal", "matte", "black", "lines", "neutral", "Preto mínimo com tipografia discreta.", "Minimal black with discreet type.", { colors: DARK, materials: ["matte", "satin"] }],
  ["Minimal Sand", "Minimal", "satin", "rosegold", "plain", "black", "Tom areia quente e acetinado.", "Warm satin sand tone.", { colors: ["rosegold", "gold", "white", "silver"], materials: ["matte", "satin"] }],
  ["Signature Gold", "Signature", "brushed", "gold", "metallic", "black", "Ouro escovado com faixa assinatura.", "Brushed gold with a signature band.", { colors: ["gold", "rosegold", "black"] }, false],
  ["Signature Rose", "Signature", "polished", "rosegold", "lines", "gold", "Rose gold polido com linhas finas.", "Polished rose gold with fine lines.", { colors: ["rosegold", "gold", "white"] }, false],
  ["Signature Midnight", "Signature", "satin", "navy", "geometric", "gold", "Azul meia-noite com detalhes dourados.", "Midnight blue with gold details.", { colors: ["navy", "black", "darkpurple"] }, false],
  ["Signature Emerald", "Signature", "polished", "darkgreen", "metallic", "gold", "Esmeralda profunda e laca polida.", "Deep emerald, polished lacquer.", { colors: ["darkgreen", "black", "navy"] }, false],
  ["Industrial Steel", "Industrial", "brushed", "graphite", "industrial", "silver", "Aço com placa rebitada e grade técnica.", "Steel with riveted plate and tech grid.", { colors: ["graphite", "silver", "black"] }],
  ["Industrial Brushed", "Industrial", "brushed", "silver", "industrial", "black", "Alumínio escovado de usinagem.", "Machined brushed aluminum.", { colors: ["silver", "graphite", "white"] }],
  ["Industrial Carbon", "Industrial", "carbon", "graphite", "industrial", "silver", "Carbono técnico com marcações de série.", "Technical carbon with serial markings.", { materials: ["carbon", "matte"], colors: ["graphite", "black"] }],
  ["Industrial Titanium", "Industrial", "satin", "metalblue", "industrial", "silver", "Titânio de engenharia com grade de precisão.", "Engineering titanium with a precision grid.", { colors: ["metalblue", "graphite", "silver"] }],
];

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export const DESIGNS: Design[] = seeds.map(([name, collection, material, color, pattern, accent, pt, en, allowed, available], i) => ({
  id: slug(name),
  name,
  collection,
  description: { pt, en },
  defaults: { material, color, pattern, accent },
  allowed: {
    materials: allowed?.materials ?? MATERIALS.filter((m) => m !== "carbon" || material === "carbon"),
    colors: allowed?.colors ?? COLOR_IDS,
    patterns: allowed?.patterns ?? PATTERNS,
    accents: allowed?.accents ?? ACCENTS,
  },
  available: available ?? true,
  demo: true,
  order: i,
}));

export const getDesign = (id?: string): Design => DESIGNS.find((d) => d.id === id) ?? DESIGNS[0]!;

export const defaultConfig = (d: Design): CardConfig => ({
  designId: d.id,
  ...d.defaults,
  text: "VANTA MEMBER",
  font: "sans",
  textPos: "bottom-left",
  issuer: "none",
  network: "none",
});

/** Coerce a config so it only uses options the design allows. */
export function sanitizeConfig(c: CardConfig): CardConfig {
  const d = getDesign(c.designId);
  const pick = <T,>(v: T, list: T[], fb: T) => (list.includes(v) ? v : fb);
  return {
    ...c,
    designId: d.id,
    material: pick(c.material, d.allowed.materials, d.defaults.material),
    color: pick(c.color, d.allowed.colors, d.defaults.color),
    pattern: pick(c.pattern, d.allowed.patterns, d.defaults.pattern),
    accent: pick(c.accent, d.allowed.accents, d.defaults.accent),
    text: (c.text ?? "").slice(0, TEXT_MAX),
    issuer: ISSUERS.some((item) => item.id === c.issuer) ? c.issuer : "none",
    network: NETWORKS.some((item) => item.id === c.network) ? c.network : "none",
  };
}
