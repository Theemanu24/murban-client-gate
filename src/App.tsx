import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import Client from "./pages/Client";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  // Set to true to disable the portal
  const PORTAL_DISABLED = false;
  
  // If portal is disabled, always show 404
  if (PORTAL_DISABLED) {
    return (
      <div className="min-h-screen flex flex-col overflow-x-hidden pt-16 bg-background">
        <Navbar />
        <NotFound />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col overflow-x-hidden pt-16 ${
        isHome ? "" : "bg-background"
      }`}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/c/:slug" element={<Client />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
