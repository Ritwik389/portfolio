import Scene from "@/components/Scene";
import { assetPath } from "@/lib/paths";

export default function Footer() {
  return (
    <footer className="relative px-6 pb-8 pt-6 md:px-12">
      <div className="gold-divider mx-auto mb-6 max-w-6xl" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5">
        <p className="max-w-xs font-body text-xs leading-relaxed text-espresso/50">© {new Date().getFullYear()} Made by Yours Truly — Ritwik Jain.</p>
        <div className="pointer-events-none h-24 w-24 shrink-0 md:h-32 md:w-32"><Scene scene={assetPath("/scenes/footer.splinecode")} /></div>
      </div>
    </footer>
  );
}
