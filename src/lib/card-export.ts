import { toBlob } from "html-to-image";

export async function downloadCardPng(
  element: HTMLElement,
  filename: string,
): Promise<"downloaded" | "shared"> {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // Capture the actual rendered card so its artwork, color filter, finish,
  // pattern, text and border all come from the same DOM the user customizes.
  const png = await toBlob(element, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#08090b",
    width: element.getBoundingClientRect().width,
  });

  if (!png) {
    throw new Error("Não foi possível gerar o PNG do cartão. Tente novamente.");
  }

  if (isIOS) {
    const file = new File([png], filename, { type: "image/png" });

    // iOS browsers often ignore download= for Blob URLs. Only report success
    // when the native share sheet actually accepts the PNG.
    if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: filename });
      return "shared";
    }
    throw new Error("Este navegador não permite salvar o PNG diretamente. Abra o VANTA no Safari fora da prévia do Lovable e tente novamente.");
  }

  // Desktop browsers support direct Blob URL downloads.
  const pngUrl = URL.createObjectURL(png);
  const link = document.createElement("a");
  link.href = pngUrl;
  link.download = filename;
  link.style.position = "fixed";
  link.style.left = "-10000px";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(pngUrl), isIOS ? 60_000 : 5_000);
  return "downloaded";
}
