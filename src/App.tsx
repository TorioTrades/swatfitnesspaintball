import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import PackageConfirmation from "./pages/PackageConfirmation";
import HalfDayConfirmation from "./pages/HalfDayConfirmation";
import Slider3DDemo from "./pages/Slider3DDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/package-confirmation" element={<PackageConfirmation />} />
          <Route path="/half-day-confirmation" element={<HalfDayConfirmation />} />
          <Route path="/slider3d" element={<Slider3DDemo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
