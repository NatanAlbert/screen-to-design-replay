import { toPng } from "html-to-image";

export async function downloadCardPng(
  element: HTMLElement,
  filename: string,
): Promise<"downloaded" | "shared"> {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // Render the live customized DOM as a PNG data URL. This keeps the artwork,
  // CSS filters, material overlays, pattern, text and border in one capture.
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#08090b",
    width: element.getBoundingClientRect().width,
  });

  if (!dataUrl.startsWith("data:image/png;base64,") || dataUrl.length < 1000) {
    throw new Error("A imagem PNG não foi gerada corretamente.");
  }

  const response = await fetch(dataUrl);
  const png = await response.blob();
  if (png.type !== "image/png" || png.size === 0) {
    throw new Error("O PNG gerado está vazio ou inválido.");
  }

  const file = new File([png], filename, { type: "image/png" });
  if (isIOS) {
    if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: filename });
      return "shared";
    }

    // No popup: show the generated image in the current tab so it can be
    // long-pressed and saved from Safari's native image context menu.
    window.location.href = dataUrl;
    return "downloaded";
  }

  const pngUrl = URL.createObjectURL(png);
  const link = document.createElement("a");
  link.href = pngUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(pngUrl), 30_000);
  return "downloaded";
}
