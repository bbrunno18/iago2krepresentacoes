import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useSettings, waLink } from "@/lib/site";

export default function WhatsAppFloat() {
  const settings = useSettings();

  return (
    <motion.a
      href={waLink(settings)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float-btn"
      aria-label="Falar com um consultor no WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-ink text-gold flex items-center justify-center shadow-[0_8px_32px_rgba(15,23,42,0.35)] border border-gold/40 hover:bg-gold hover:text-ink transition-colors duration-300"
    >
      <MessageCircle size={24} strokeWidth={2} />
      <span className="absolute inset-0 -z-10 animate-ping bg-gold/20" style={{ animationDuration: "2.8s" }} />
    </motion.a>
  );
}
