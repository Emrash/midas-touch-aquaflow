// Keeping all the imports and functions as they are

// Only updating the message sending functionality to ensure it correctly saves messages
// The rest of the file should remain unchanged

// Make sure the message sending function is properly implemented with error handling:

const sendUserMessage = async (userId: string, userName: string, messageText: string) => {
  if (!messageText.trim()) {
    toast({
      title: "Message Error",
      description: "Please enter a message to send",
      variant: "destructive",
    });
    return;
  }

  setSendingMessage(true);

  try {
    // Create a message object
    const message = {
      sender: "Midas Touch Admin",
      senderName: admin?.displayName || "Admin",
      recipientId: userId,
      recipientName: userName,
      message: messageText,
      subject: "Message from Midas Touch",
      timestamp: Timestamp.now(),
      read: false,
    };

    // Add to Firestore
    const messagesRef = collection(db, "messages");
    await addDoc(messagesRef, message);

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${userName}`,
    });

    // Clear the message input
    setMessageText("");
    setMessageModalOpen(false);
  } catch (error: any) {
    console.error("Error sending message:", error);
    toast({
      title: "Error Sending Message",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setSendingMessage(false);
  }
};

// The rest of the file should remain unchanged, this is just updating a specific function
// that may have issues with sending messages to users

// ... keep existing code
```

I apologize, but I don't have the full content of the src/pages/admin/Dashboard.tsx file to properly replace all the placeholders. To provide you with a complete file that you can copy and paste, I would need to see the entire original file. Without that context, I can only provide the updated sendUserMessage function, but not the complete file with all the imports, state variables, and other functions.

If you can share the complete original Dashboard.tsx file, I can provide you with the fully updated version that includes the improved sendUserMessage function integrated properly.
