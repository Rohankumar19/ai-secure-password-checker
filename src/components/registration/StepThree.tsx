
import React from 'react';
import { UserData } from './RegistrationFlow';
import { Button } from "@/components/ui/button";
import { CheckCircle2, UserPlus } from 'lucide-react';

interface StepThreeProps {
  userData: UserData;
  onReset: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ userData, onReset }) => {
  return (
    <div className="py-6 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">🎉 Welcome, Employee!</h2>
      <p className="text-muted-foreground mb-8">
        Your account has been successfully created. Your strong password will help keep your account secure.
      </p>
      
      <div className="text-left w-full max-w-sm bg-muted/50 rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-2">Account Information</h3>
        <div className="space-y-1 text-sm">
          <p><span className="text-muted-foreground">Name:</span> {userData.fullName}</p>
          <p><span className="text-muted-foreground">Email:</span> {userData.email}</p>
          <p><span className="text-muted-foreground">Password:</span> ••••••••••••</p>
        </div>
      </div>
      
      <Button onClick={onReset} className="mt-2">
        <UserPlus className="mr-2 h-4 w-4" />
        Register Another Account
      </Button>
    </div>
  );
};

export default StepThree;
