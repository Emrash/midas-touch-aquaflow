
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ConsultationProvider } from "./contexts/ConsultationContext";
import ConsultationModal from "./components/ui/ConsultationModal";
import { useConsultation } from "./contexts/ConsultationContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Logistics from "./pages/Logistics";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import DrillingHome from "./pages/drilling/DrillingHome";
import LogisticsHome from "./pages/logistics/LogisticsHome";

// Components
import WhatsAppButton from "./components/ui/WhatsAppButton";

const queryClient = new QueryClient();

// Modal container component
const ModalContainer = () => {
  const { isModalOpen, closeModal, serviceType, modalTitle, modalDescription } = useConsultation();
  
  return (
    <ConsultationModal 
      isOpen={isModalOpen} 
      onClose={closeModal} 
      serviceType={serviceType}
      title={modalTitle}
      description={modalDescription}
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConsultationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <WhatsAppButton phoneNumber="2348001234567" />
            <ModalContainer />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Multi-domain Routes */}
              <Route path="/drilling" element={<DrillingHome />} />
              <Route path="/logistics-services" element={<LogisticsHome />} />
              
              {/* Protected Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* User Profile/Dashboard */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ConsultationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
