import { COLORS, defaultConfig, getDesign, type CardConfig } from "@/data/designs";
import { useI18n } from "@/lib/i18n";
import { WalletCard } from "./WalletCard";

/** Stylized phone with a generic digital-wallet UI. Visual simulation only. */
export function DevicePreview({ config }: { config: CardConfig }) {
  const { t } = useI18n();
  const glow = COLORS[config.color].hex;
  const others = [defaultConfig(getDesign("noir-matte")), defaultConfig(getDesign("minimal-white"))].map((c) => ({ ...c, text: "" }));
  return (
    <div className="relative mx-auto w-[min(78vw,310px)]">
      <div className="absolute -inset-16 -z-10 opacity-50 blur-3xl" style={{ background: `radial-gradient(closest-side, ${glow}, transparent)` }} />
      <div className="relative aspect-[9/19.5] rounded-[3rem] border border-border bg-graphite p-2.5 card-shadow">
        <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-background">
          <div className="absolute left-1/2 top-2.5 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-graphite" />
          <div className="flex items-center justify-between px-7 pt-3 font-mono text-[0.6rem] text-muted-foreground">
            <span>9:41</span><span>●●●</span>
          </div>
          <div className="px-5 pt-10">
            <div className="display text-2xl">{t("pv.wallet")}</div>
            <div className="relative mt-6">
              {others.map((c, i) => (
                <div key={i} className="absolute inset-x-0 opacity-60" style={{ top: `${(i + 1) * -0}px`, transform: `translateY(${180 + i * 34}px) scale(${0.96 - i * 0.02})` }}>
                  <WalletCard config={c} className="rounded-xl" />
                </div>
              ))}
              <div className="relative z-10 animate-rise">
                <WalletCard config={config} className="card-shadow" />
              </div>
            </div>
            <div className="mt-[130px] text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              {t("pv.demoCard")} · •••• 0000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
