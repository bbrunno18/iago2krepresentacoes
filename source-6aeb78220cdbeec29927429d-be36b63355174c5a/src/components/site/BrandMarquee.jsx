import Marquee from "react-fast-marquee";
import { Asterisk } from "lucide-react";

export default function BrandMarquee({ items = [], dark = false }) {
  if (!items.length) return null;

  return (
    <div
      data-testid="brand-marquee"
      className={`py-8 border-y overflow-hidden ${dark ? "bg-ink border-white/10 text-white" : "bg-[#FAFAFA] border-[#E2E8F0] text-ink"}`}
    >
      <Marquee speed={28} gradient={false} pauseOnHover aria-label="Marcas representadas">
        {items.map((name, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="font-display font-medium uppercase tracking-[0.18em] text-lg md:text-xl whitespace-nowrap opacity-70">
              {name}
            </span>
            <Asterisk size={20} className="mx-10 md:mx-16 text-gold shrink-0" aria-hidden="true" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
