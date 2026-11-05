import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/lib/site";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import Home from "@/pages/Home";
import Sobre from "@/pages/Sobre";
import Marcas from "@/pages/Marcas";
import Produtos from "@/pages/Produtos";
import SolicitarCatalogo from "@/pages/SolicitarCatalogo";
import Contato from "@/pages/Contato";
import Faq from "@/pages/Faq";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminPanel from "@/pages/admin/AdminPanel";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/marcas" element={<Marcas />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/solicitar-catalogo" element={<SolicitarCatalogo />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
