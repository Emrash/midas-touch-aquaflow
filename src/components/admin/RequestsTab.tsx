
import React from 'react';
import RequestCard from './RequestCard';

interface RequestDetail {
  label: string;
  value: string;
}

interface Request {
  id: string;
  userId: string;
  timestamp: any;
  name?: string;
  contactName?: string;
  fullName?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  contactPhone?: string;
  [key: string]: any;
}

interface RequestsTabProps {
  requests: Request[];
  type: 'consultation' | 'drilling' | 'logistics';
  onMessageClick: (userId: string, userName: string) => void;
}

const RequestsTab: React.FC<RequestsTabProps> = ({ requests, type, onMessageClick }) => {
  const formatRequestDetails = (request: Request, type: string): RequestDetail[] => {
    let details: RequestDetail[] = [];
    
    if (type === 'consultation') {
      details = [
        { label: 'Service Type', value: request.serviceType || 'General Consultation' },
        { label: 'Message', value: request.message || 'No message provided' }
      ];
    } else if (type === 'drilling') {
      details = [
        { label: 'Location', value: request.location || 'Not specified' },
        { label: 'Project Type', value: request.projectType || 'Not specified' },
        { label: 'Duration', value: request.estimatedDuration || 'Not specified' },
        { label: 'Notes', value: request.additionalNotes || 'No additional notes' }
      ];
    } else if (type === 'logistics') {
      details = [
        { label: 'Cargo Type', value: request.cargoType || 'Not specified' },
        { label: 'Origin', value: request.origin || 'Not specified' },
        { label: 'Destination', value: request.destination || 'Not specified' },
        { label: 'Notes', value: request.specialRequirements || 'No additional notes' }
      ];
    }

    return details;
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        {type.charAt(0).toUpperCase() + type.slice(1)} Requests
      </h2>
      {requests.length === 0 ? (
        <p>No {type} requests found.</p>
      ) : (
        requests.map(request => {
          const userName = request.name || request.contactName || request.fullName || 'Client';
          const userEmail = request.email || request.contactEmail || 'No email provided';
          const userPhone = request.phone || request.contactPhone || 'No phone provided';
          const requestDate = request.timestamp 
            ? new Date(request.timestamp.toDate()).toLocaleString() 
            : 'Unknown date';
          const details = formatRequestDetails(request, type);

          return (
            <RequestCard
              key={request.id}
              id={request.id}
              userName={userName}
              userEmail={userEmail}
              userPhone={userPhone}
              requestDate={requestDate}
              details={details}
              userId={request.userId}
              onMessageClick={onMessageClick}
            />
          );
        })
      )}
    </>
  );
};

export default RequestsTab;
