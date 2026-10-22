import { ACCENT_HEX, COLORS, getDesign, type CardConfig } from "@/data/designs";

export async function downloadCardPng(config: CardConfig, filename: string): Promise<"downloaded" | "opened"> {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // Safari on iOS often ignores programmatic downloads from blob URLs. Open a tab
  // during the original tap so the generated PNG can be shown as a saveable image.
  const previewWindow = isIOS ? window.open("about:blank", "_blank") : null;
  const width = 856;
  const height = 540;
  const scale = 2;
  const design = getDesign(config.designId);
  const base = COLORS[config.color];
  const accent = ACCENT_HEX[config.accent];
  const ink = base.light ? "#191a1d" : "#f5f5f2";
  const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);
  const textAnchor = config.textPos === "center" ? "middle" : config.textPos === "bottom-right" ? "end" : "start";
  const textX = config.textPos === "center" ? 428 : config.textPos === "bottom-right" ? 796 : 60;
  const textY = config.textPos === "center" ? 285 : 470;
  const font = config.font === "mono" ? "monospace" : config.font === "serif" ? "Georgia, serif" : "Arial, Helvetica, sans-serif";
  const defs = `
    <defs>
      <linearGradient id="topShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#08090b" stop-opacity=".72"/><stop offset="1" stop-color="#08090b" stop-opacity="0"/></linearGradient><linearGradient id="base" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${base.hex}"/><stop offset=".58" stop-color="${base.hex}"/><stop offset="1" stop-color="#08090b" stop-opacity=".7"/></linearGradient>
      <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".48" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
      <linearGradient id="shine" x1="0" y1="0" x2="1" y2=".5"><stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".34" stop-color="#fff" stop-opacity=".42"/><stop offset=".48" stop-color="#fff" stop-opacity=".04"/><stop offset=".7" stop-color="#000" stop-opacity=".2"/></linearGradient>
      <pattern id="brush" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 1H5M0 3H5" stroke="#fff" stroke-opacity=".1"/></pattern>
      <pattern id="carbon" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 0L10 10M10 0L0 10" stroke="#fff" stroke-opacity=".12" stroke-width="3"/></pattern>
      <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${accent}" stroke-opacity=".25"/></pattern>
      <clipPath id="clip"><rect width="${width}" height="${height}" rx="39"/></clipPath>
    </defs>`;
  let artwork = "";
  if (design.name === "Daniel Vorcaro — Banco Master") {
    const toDataUrl = async (path: string) => {
      const response = await fetch(path, { credentials: "same-origin" });
      if (!response.ok) throw new Error(`Não foi possível carregar ${path}.`);
      const blob = await response.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Não foi possível preparar a imagem."));
        reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
        reader.readAsDataURL(blob);
      });
    };
    const portrait = await toDataUrl("/daniel-vorcaro.png");
    artwork += `<image href="${portrait}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`;
    if (config.issuer === "banco-master") {
      const bankLogo = await toDataUrl("/banco-master.png");
      artwork += `<image href="${bankLogo}" x="51" y="38" width="240" height="96" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:screen"/>`;
    } else if (config.issuer !== "none") {
      const issuerLabel = config.issuer === "nubank" ? "NUBANK" : config.issuer === "inter" ? "INTER" : config.issuer === "c6" ? "C6 BANK" : config.issuer === "neon" ? "NEON" : config.issuer.toUpperCase();
      artwork += `<text x="52" y="86" fill="#fff" font-family="Arial, sans-serif" font-size="30" font-weight="600" letter-spacing="4">${escape(issuerLabel)}</text>`;
    }
    if (config.network === "mastercard") {
      const networkLogo = await toDataUrl("/mastercard.png");
      artwork += `<image href="${networkLogo}" x="641" y="420" width="222" height="104" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:screen"/>`;
    } else if (config.network !== "none") {
      const networkLabel = config.network.toUpperCase();
      artwork += `<text x="804" y="490" fill="#fff" font-family="Arial, sans-serif" font-size="21" font-weight="600" text-anchor="end" letter-spacing="2">${escape(networkLabel)}</text>`;
    }
  } else {
    artwork += `<rect width="${width}" height="${height}" fill="url(#base)"/>`;
  }
  if (config.material === "brushed") artwork += `<rect width="${width}" height="${height}" fill="url(#brush)"/>`;
  if (config.material === "carbon") artwork += `<rect width="${width}" height="${height}" fill="url(#carbon)"/>`;
  if (config.material === "polished") artwork += `<rect width="${width}" height="${height}" fill="url(#shine)"/>`;
  if (config.material === "matte" || config.material === "satin") artwork += `<rect width="${width}" height="${height}" fill="url(#sheen)"/>`;
  if (config.pattern === "lines") {
    for (let i = 0; i < 6; i++) artwork += `<path d="M${405 + i * 45} 0L856 ${324 - i * 48}" stroke="${accent}" stroke-opacity="${0.35 - i * 0.04}" stroke-width="1.6" fill="none"/>`;
  } else if (config.pattern === "geometric") {
    artwork += `<path d="M560 0L690 0 856 130 856 270 690 400 560 400 430 270 430 130Z M690 0L690 400 M430 130L856 270 M856 130L430 270" stroke="${accent}" stroke-opacity=".25" fill="none" stroke-width="2"/>`;
  } else if (config.pattern === "industrial") {
    artwork += `<rect x="530" width="326" height="540" fill="url(#grid)"/><path d="M530 0V540" stroke="${accent}" stroke-opacity=".35" stroke-width="2"/><text x="810" y="285" font-size="16" fill="${accent}" fill-opacity=".5" font-family="monospace" text-anchor="end" letter-spacing="4">VT-07</text>`;
  } else if (config.pattern === "metallic") {
    artwork += `<rect x="660" width="80" height="540" fill="${accent}" opacity=".22"/><rect x="685" width="28" height="540" fill="${accent}" opacity=".25"/>`;
  }
  const issuer = config.issuer !== "none" ? config.issuer.toUpperCase() : "VANTA";
  const network = config.network !== "none" ? config.network.toUpperCase() : design.collection.toUpperCase();
  const labels = design.name === "Daniel Vorcaro — Banco Master" ? "" : `<text x="60" y="95" fill="${ink}" font-family="Arial, sans-serif" font-size="34" font-weight="600" letter-spacing="7">${escape(issuer === "BANCO-MASTER" ? "BANCO MASTER" : issuer)}</text><text x="796" y="100" fill="${ink}" fill-opacity=".7" font-family="monospace" font-size="17" text-anchor="end" letter-spacing="2">${escape(network)}</text>`;
  const cardText = config.text ? `<text x="${textX}" y="${textY}" fill="${design.name === "Daniel Vorcaro — Banco Master" ? "#fff" : ink}" font-family="${font}" font-size="${config.font === "serif" ? 52 : 38}" text-anchor="${textAnchor}" letter-spacing="${config.font === "serif" ? 1 : 4}">${escape(config.font === "serif" ? config.text : config.text.toUpperCase())}</text>` : "";
  const demo = design.name === "Daniel Vorcaro — Banco Master" || config.textPos === "bottom-right" ? "" : `<text x="796" y="480" fill="${ink}" fill-opacity=".5" font-family="monospace" font-size="20" text-anchor="end" letter-spacing="4">DEMO</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${defs}<g clip-path="url(#clip)">${artwork}<rect x="2" y="2" width="852" height="536" rx="37" fill="none" stroke="${accent}" stroke-opacity=".55" stroke-width="3"/>${labels}${cardText}${demo}</g></svg>`;
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  let pngUrl: string | undefined;
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("O navegador não conseguiu renderizar o cartão SVG.")); image.src = svgUrl; });
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas indisponível neste navegador.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Não foi possível criar o PNG.")), "image/png"));
    pngUrl = URL.createObjectURL(png);
    if (isIOS) {
      if (previewWindow && !previewWindow.closed) {
        previewWindow.location.href = pngUrl;
        // Keep the object URL alive while the image is open for saving.
        return "opened";
      }
      throw new Error("O Safari bloqueou a abertura da imagem. Permita pop-ups e tente novamente.");
    }
    const link = document.createElement("a");
    link.href = pngUrl; link.download = filename; link.style.display = "none";
    document.body.appendChild(link); link.click(); link.remove();
    return "downloaded";
  } finally {
    URL.revokeObjectURL(svgUrl);
    if (pngUrl && !isIOS) window.setTimeout(() => URL.revokeObjectURL(pngUrl!), 5000);
  }
}
