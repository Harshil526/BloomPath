import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/auth/Login";
import RegisterBusiness from "./pages/auth/RegisterBusiness";
import RegisterWorker from "./pages/auth/RegisterWorker";
import EmployerDashboard from "./pages/EmployerDashboard";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import WorkerDashboard from "./pages/WorkerDashboard";

const queryClient = new QueryClient();

import { SaharaAssistant } from "./components/SaharaAssistant";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="bloompath-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/worker/*" element={<WorkerDashboard />} />
              <Route path="/employer/*" element={<EmployerDashboard />} />
              <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
              <Route path="/admin" element={<Login />} /> {/* Admin entry point */}
              <Route path="/login" element={<Login />} />
              <Route path="/register/worker" element={<RegisterWorker />} />
              <Route path="/register/business" element={<RegisterBusiness />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <SaharaAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
