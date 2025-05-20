
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Mail, Phone } from 'lucide-react';

interface RequestDetail {
  label: string;
  value: string;
}

interface RequestCardProps {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  requestDate: string;
  details: RequestDetail[];
  userId: string;
  onMessageClick: (userId: string, userName: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  id,
  userName,
  userEmail,
  userPhone,
  requestDate,
  details,
  userId,
  onMessageClick
}) => {
  return (
    <Card key={id} className="mb-4 overflow-hidden">
      <div className="flex items-center p-4 bg-gradient-to-r from-mdpc-blue/10 to-white dark:from-mdpc-blue-dark/20 dark:to-transparent">
        <div className="bg-mdpc-blue/20 dark:bg-mdpc-gold/20 rounded-full p-3 mr-3">
          <User className="h-5 w-5 text-mdpc-blue dark:text-mdpc-gold" />
        </div>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-xs text-gray-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> {requestDate}
          </p>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{userName}</CardTitle>
        <CardDescription>
          Submitted on {requestDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid gap-2">
          <div className="font-medium">Contact Information:</div>
          <div className="text-sm flex items-center">
            <Mail className="h-4 w-4 mr-2 text-mdpc-blue dark:text-mdpc-gold" /> 
            {userEmail}
          </div>
          <div className="text-sm flex items-center">
            <Phone className="h-4 w-4 mr-2 text-mdpc-blue dark:text-mdpc-gold" /> 
            {userPhone}
          </div>
        </div>
        <div className="grid gap-2 mt-4">
          <div className="font-medium">Request Details:</div>
          {details.map((detail, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium">{detail.label}: </span>
              {detail.value}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => onMessageClick(userId, userName)}
        >
          Send Message
        </Button>
        <Button variant="default">Mark as Processed</Button>
      </CardFooter>
    </Card>
  );
};

export default RequestCard;
