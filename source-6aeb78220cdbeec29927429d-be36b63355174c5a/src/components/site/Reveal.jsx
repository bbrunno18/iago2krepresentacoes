import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MaskedLine({ children, delay = 0, className = "" }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SectionHead({ eyebrow, title, description, dark = false, align = "left" }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <Reveal>
          <p className={`text-xs font-semibold uppercase tracking-[0.28em] mb-5 flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${dark ? "text-gold" : "text-gold-dark"}`}>
            <span className={`inline-block w-8 h-px ${dark ? "bg-gold" : "bg-gold-dark"}`} />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className={`font-display font-extrabold tracking-tighter leading-[0.95] text-4xl md:text-5xl text-balance ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className={`mt-6 text-base md:text-lg leading-relaxed ${dark ? "text-white/60" : "text-slate2"}`}>{description}</p>
        </Reveal>
      )}
    </div>
  );
}
