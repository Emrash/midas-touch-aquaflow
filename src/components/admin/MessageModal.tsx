
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  messageText: string;
  setMessageText: (text: string) => void;
  sendUserMessage: () => void;
  sendingMessage: boolean;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onOpenChange,
  userName,
  messageText,
  setMessageText,
  sendUserMessage,
  sendingMessage
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Message to {userName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="message"
            placeholder="Type your message here..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="col-span-3"
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={sendingMessage}
          >
            Cancel
          </Button>
          <Button 
            onClick={sendUserMessage}
            disabled={sendingMessage || !messageText.trim()}
          >
            {sendingMessage ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
