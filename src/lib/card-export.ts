import { toBlob } from "html-to-image";

export async function downloadCardPng(
  element: HTMLElement,
  filename: string,
): Promise<"downloaded" | "opened" | "shared"> {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // Open the iOS destination synchronously during the tap; Safari may block
  // popups opened only after the asynchronous DOM capture finishes.
  const previewWindow = isIOS ? window.open("about:blank", "_blank") : null;

  try {
    // Export the actual React-rendered card, not a separately reconstructed SVG.
    // This preserves the same artwork filters, material overlays, pattern,
    // accent, typography and border that the user sees in the live preview.
    const png = await toBlob(element, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#08090b",
      width: element.getBoundingClientRect().width,
    });

    if (!png) throw new Error("Não foi possível gerar o PNG do cartão.");

    if (isIOS) {
      const file = new File([png], filename, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        if (previewWindow && !previewWindow.closed) previewWindow.close();
        await navigator.share({ files: [file], title: filename });
        return "shared";
      }
      const pngUrl = URL.createObjectURL(png);
      if (previewWindow && !previewWindow.closed) {
        previewWindow.document.open();
        previewWindow.document.write('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>VANTA PNG</title><style>html,body{margin:0;min-height:100%;background:#08090b}body{display:flex;align-items:center;justify-content:center}img{display:block;width:100%;height:auto;object-fit:contain}</style></head><body><img src="' + pngUrl + '" alt="VANTA customized card"></body></html>');
        previewWindow.document.close();
        // Keep the object URL alive while Safari displays the image.
        window.setTimeout(() => URL.revokeObjectURL(pngUrl), 120_000);
        return "opened";
      }
      URL.revokeObjectURL(pngUrl);
      throw new Error("O Safari bloqueou a abertura da imagem. Permita pop-ups e tente novamente.");
    }

    const pngUrl = URL.createObjectURL(png);
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(pngUrl), 5_000);
    return "downloaded";
  } catch (error) {
    if (previewWindow && !previewWindow.closed) previewWindow.close();
    throw error;
  }
}
