
import { useState } from "react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

const WhatsAppButton = ({ 
  phoneNumber, 
  message = "Hi Midas Touch, I have an inquiry about your services."
}: WhatsAppButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the phone number to remove any spaces, dashes, etc.
  const formattedNumber = phoneNumber.replace(/\D/g, "");
  
  // Create the WhatsApp link with pre-filled message
  const whatsappLink = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <a 
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 group"
      style={{ 
        width: isHovered ? 'auto' : '60px', 
        height: '60px',
        paddingLeft: isHovered ? '16px' : '0',
        paddingRight: isHovered ? '16px' : '0',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg 
        viewBox="0 0 24 24" 
        width="24" 
        height="24" 
        fill="currentColor"
        className={isHovered ? "mr-2" : ""}
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
        <path d="M5.339 21.286l.415-1.507c-2.27-1.23-3.307-3.531-3.307-5.84 0-1.45.572-2.815 1.612-3.845 1.03-1.02 2.407-1.581 3.874-1.581 1.468 0 2.844.561 3.875 1.58 1.039 1.03 1.612 2.395 1.612 3.846 0 2.308-1.036 4.61-3.307 5.84l.414 1.507a13.726 13.726 0 01-4.586 0zm7.48-13.568a9.16 9.16 0 00-6.35-1.971 9.112 9.112 0 00-7.438 4.892 9.023 9.023 0 00-.82 7.5L0 24l5.81-1.521a9.15 9.15 0 007.502-.693 9.116 9.116 0 004.493-5.754c.913-3.36-.041-6.96-2.359-9.478l-2.628 1.164z"></path>
      </svg>
      {isHovered && (
        <span className="text-sm font-medium whitespace-nowrap">Chat with us</span>
      )}
    </a>
  );
};

export default WhatsAppButton;
