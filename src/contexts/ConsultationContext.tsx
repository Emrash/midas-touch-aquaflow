
import React, { createContext, useState, useContext, ReactNode } from 'react';

type ServiceType = 'drilling' | 'logistics' | 'general';

interface ConsultationContextType {
  isModalOpen: boolean;
  serviceType: ServiceType;
  modalTitle: string;
  modalDescription: string;
  openModal: (service?: ServiceType, title?: string, description?: string) => void;
  closeModal: () => void;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const ConsultationProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('general');
  const [modalTitle, setModalTitle] = useState('Request a Consultation');
  const [modalDescription, setModalDescription] = useState("Fill in your details and we'll get back to you within 24 hours.");

  const openModal = (
    service: ServiceType = 'general',
    title = 'Request a Consultation',
    description = "Fill in your details and we'll get back to you within 24 hours."
  ) => {
    setServiceType(service);
    setModalTitle(title);
    setModalDescription(description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ConsultationContext.Provider
      value={{
        isModalOpen,
        serviceType,
        modalTitle,
        modalDescription,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = (): ConsultationContextType => {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error('useConsultation must be used within a ConsultationProvider');
  }
  return context;
};
