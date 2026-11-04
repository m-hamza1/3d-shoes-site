import React from "react";
import ShoeScroll from "@/components/ShoeScroll";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#ECECEC] text-black antialiased selection:bg-black selection:text-white">
      {/* Minimalist Editorial Header */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 sm:px-12 py-6 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="text-sm font-semibold tracking-tighter uppercase text-black/90">
            AETHER // 01
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 pointer-events-auto text-[11px] font-mono uppercase tracking-[0.18em] text-black/60">
          <a href="#overview" className="hover:text-black transition-colors">
            Overview
          </a>
          <a href="#engineering" className="hover:text-black transition-colors">
            Engineering
          </a>
          <a href="#specifications" className="hover:text-black transition-colors">
            Specifications
          </a>
        </nav>

        <div className="pointer-events-auto flex items-center gap-4">
          <button className="text-xs font-mono uppercase tracking-[0.15em] text-black/80 hover:text-black border-b border-black/30 hover:border-black pb-0.5 transition-all">
            Pre-Order
          </button>
        </div>
      </header>

      {/* Scrollytelling Canvas Engine (400vh scroll) */}
      <ShoeScroll />

      {/* Specifications & Editorial Details Section */}
      <section
        id="specifications"
        className="relative z-10 bg-[#ECECEC] px-6 sm:px-12 md:px-24 py-32 border-t border-black/10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-black/40 block mb-3">
                Specification // 01
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-black/90 mb-3">
                Seamless Knitted Mesh
              </h3>
              <p className="text-sm text-black/60 leading-relaxed">
                Hydrophobic micro-filament knit adapts dynamically to foot morphology while maintaining structural rigidity at lateral stress points.
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-black/40 block mb-3">
                Specification // 02
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-black/90 mb-3">
                Kinetic Carbon Mid-Plate
              </h3>
              <p className="text-sm text-black/60 leading-relaxed">
                Engineered between dual foam densities to maximize energy rebound and ensure seamless heel-to-toe transition.
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-black/40 block mb-3">
                Specification // 03
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-black/90 mb-3">
                Zero-Slip Sock Collar
              </h3>
              <p className="text-sm text-black/60 leading-relaxed">
                Anatomic ribbed collar with low-profile dual pull tabs delivers frictionless entry and instant lockdown.
              </p>
            </div>
          </div>

          <div className="mt-32 pt-12 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono uppercase tracking-[0.15em] text-black/40 gap-4">
            <span>© 2026 AETHER FOOTWEAR LABS</span>
            <div className="flex gap-6">
              <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-black cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-black cursor-pointer transition-colors">Documentation</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
