import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Home, LayoutGrid, SlidersHorizontal, Smartphone, Menu, X } from "lucide-react";
import { BRAND, useI18n, type TKey } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

const DESKTOP: [string, TKey][] = [
  ["/collection", "nav.collection"], ["/customize", "nav.customize"], ["/preview", "nav.preview"],
  ["/apply", "nav.apply"], ["/pricing", "nav.pricing"], ["/faq", "nav.faq"],
];

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:h-16 md:px-8">
        <Link to="/" className="text-sm font-semibold tracking-[0.4em]">{BRAND}</Link>
        <nav className="hidden items-center gap-7 md:flex">
          {DESKTOP.map(([to, k]) => (
            <Link key={to} to={to} className="text-sm text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
              {t(k)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/settings" className="hidden text-sm text-muted-foreground hover:text-foreground md:block">{t("nav.settings")}</Link>
          <button className="grid size-9 place-items-center rounded-full hairline md:hidden" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="animate-in fade-in slide-in-from-top-2 border-t border-border px-5 py-4 md:hidden">
          {(["/apply", "/pricing", "/faq", "/settings"] as const).map((to) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className="block py-3 text-2xl display">
              {t(({ "/apply": "nav.apply", "/pricing": "nav.pricing", "/faq": "nav.faq", "/settings": "nav.settings" } as const)[to])}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function BottomNav() {
  const { t } = useI18n();
  const items = [
    { to: "/", k: "nav.home", Icon: Home },
    { to: "/collection", k: "nav.collection", Icon: LayoutGrid },
    { to: "/customize", k: "nav.customize", Icon: SlidersHorizontal },
    { to: "/preview", k: "nav.preview", Icon: Smartphone },
  ] as const;
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-full border border-border bg-graphite/90 backdrop-blur-xl md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-4">
        {items.map(({ to, k, Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[0.65rem] text-muted-foreground transition-colors"
            activeProps={{ className: "text-foreground [&_svg]:text-signal" }}
          >
            <Icon className="size-[18px]" strokeWidth={1.6} />
            {t(k)}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-5 pb-32 pt-16 md:px-8 md:pb-12">
      <div className="flex flex-col justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
        <span className="tracking-[0.4em] text-foreground">{BRAND}</span>
        <span>Prototype · Not affiliated with Apple Inc. or any card issuer.</span>
      </div>
    </footer>
  );
}
