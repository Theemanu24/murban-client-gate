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

  return (
    <div
      className={`min-h-screen flex flex-col overflow-x-hidden ${
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
