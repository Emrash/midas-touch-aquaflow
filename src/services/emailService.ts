
// Email notification service
// This is a placeholder for server-side functionality 
// In a production environment, this would be handled by Firebase Cloud Functions or similar

export const sendEmail = async (subject: string, body: string) => {
  try {
    console.log("Email would be sent in production:");
    console.log("To: yekinirasheed2002@gmail.com");
    console.log("Subject:", subject);
    console.log("Body:", body);
    
    // In production, this would call a Firebase Cloud Function or EmailJS
    // For example:
    // await fetch('https://us-central1-your-project.cloudfunctions.net/sendEmail', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: 'yekinirasheed2002@gmail.com',
    //     subject,
    //     body
    //   })
    // });
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendServiceRequestNotification = async (
  requestType: "drilling" | "logistics", 
  name: string, 
  email: string,
  details: Record<string, any>
) => {
  const subject = `New ${requestType.charAt(0).toUpperCase() + requestType.slice(1)} Service Request from ${name}`;
  
  let body = `
    New service request submitted:
    
    Type: ${requestType.toUpperCase()}
    Name: ${name}
    Email: ${email}
  `;
  
  // Add other details
  Object.entries(details).forEach(([key, value]) => {
    if (value && key !== 'name' && key !== 'email') {
      // Format the key with spaces and capitalization
      const formattedKey = key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([a-z])([A-Z])/g, '$1 $2');
      
      body += `\n${formattedKey}: ${value}`;
    }
  });
  
  return sendEmail(subject, body);
};
