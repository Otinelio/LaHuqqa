import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/contexts/SettingsContext";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "@/pages/Index";
import MenuPage from "@/pages/MenuPage";
import AmbiancePage from "@/pages/AmbiancePage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";
import CuisinePage from "@/pages/CuisinePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();
const HIDE_CHROME = ["/admin", "/cuisine", "/menu/scan"];

const PublicChrome = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hide = HIDE_CHROME.some((p) => location.pathname.startsWith(p));
  return (
    <>
      {!hide && <Navbar />}
      {children}
      {!hide && <Footer />}
      {!hide && <WhatsAppButton />}
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const handle = useCallback(() => setLoading(false), []);
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          {loading && <LoadingScreen onComplete={handle} />}
          <BrowserRouter>
            <PublicChrome>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<MenuPage scanMode={false} />} />
                <Route path="/menu/scan" element={<MenuPage scanMode={true} />} />
                <Route path="/ambiance" element={<AmbiancePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/cuisine" element={<CuisinePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PublicChrome>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};
export default App;
