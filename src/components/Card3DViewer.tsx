import { useRef, useState } from "react";
import { RotateCcw, Repeat2, Maximize2, X } from "lucide-react";
import type { CardConfig } from "@/data/designs";
import { CardBack, CardFront } from "./WalletCard";
import { useI18n } from "@/lib/i18n";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function Card3DViewer({ config, controls = true }: { config: CardConfig; controls?: boolean }) {
  const { t } = useI18n();
  const [rot, setRot] = useState({ x: 6, y: -12 });
  const [flipped, setFlipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(false);
  const start = useRef<{ x: number; y: number; rx: number; ry: number; locked?: "h" | "v" } | null>(null);

  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y };
  };
  const onMove = (e: React.PointerEvent) => {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    // On touch: only capture clearly horizontal drags so vertical page scroll keeps working.
    if (!s.locked && Math.abs(dx) + Math.abs(dy) > 6) {
      s.locked = e.pointerType === "touch" && Math.abs(dy) > Math.abs(dx) ? "v" : "h";
      if (s.locked === "h") { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setDragging(true); }
    }
    if (s.locked !== "h") return;
    setRot({ x: clamp(s.rx - dy * 0.25, -35, 35), y: clamp(s.ry + dx * 0.45, -60, 60) });
  };
  const onUp = () => { start.current = null; setDragging(false); };

  const ry = rot.y + (flipped ? 180 : 0);
  const glare = clamp(50 + rot.y * 1.2, 0, 100);

  const card = (big = false) => (
    <div className={`[perspective:1400px] ${big ? "w-[min(92vw,720px)]" : "w-full max-w-[460px]"}`}>
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`relative aspect-[1.586] w-full select-none [transform-style:preserve-3d] ${dragging ? "cursor-grabbing" : "cursor-grab transition-transform duration-700 ease-[var(--ease-lux)]"}`}
        style={{ transform: `rotateX(${rot.x}deg) rotateY(${ry}deg)`, touchAction: "pan-y" }}
      >
        <div className="card-shadow absolute inset-0 rounded-[4.6%/7.3%] [backface-visibility:hidden]">
          <CardFront config={config} glare={glare} />
        </div>
        <div className="card-shadow absolute inset-0 rounded-[4.6%/7.3%] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardBack config={config} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col items-center">
      {card()}
      {controls && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button className="chip" data-active={!flipped} onClick={() => setFlipped(false)}>{t("cz.front")}</button>
          <button className="chip" data-active={flipped} onClick={() => setFlipped(true)}>{t("cz.back")}</button>
          <button className="chip" aria-label={t("cz.flip")} onClick={() => setFlipped((f) => !f)}><Repeat2 className="size-3.5" /></button>
          <button className="chip" aria-label={t("cz.resetView")} onClick={() => { setRot({ x: 6, y: -12 }); setFlipped(false); }}><RotateCcw className="size-3.5" /></button>
          <button className="chip" aria-label={t("cz.zoom")} onClick={() => setZoom(true)}><Maximize2 className="size-3.5" /></button>
        </div>
      )}
      {zoom && (
        <div className="stage fixed inset-0 z-50 flex animate-in fade-in items-center justify-center duration-300" role="dialog">
          <button className="btn-ghost absolute right-5 top-5 h-11 w-11 p-0" aria-label="Close" onClick={() => setZoom(false)}><X className="size-4" /></button>
          {card(true)}
        </div>
      )}
    </div>
  );
}
