
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card key={id} className="mb-4">
      <CardHeader>
        <CardTitle>{userName}</CardTitle>
        <CardDescription>
          Submitted on {requestDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid gap-2">
          <div className="font-medium">Contact Information:</div>
          <div className="text-sm">Email: {userEmail}</div>
          <div className="text-sm">Phone: {userPhone}</div>
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
