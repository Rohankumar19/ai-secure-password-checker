
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTimeToCrack } from '@/utils/passwordUtils';
import StrengthAnalysis from './StrengthAnalysis';
import TimeToCrack from './TimeToCrack';
import PasswordSuggestions from './PasswordSuggestions';
import { UserData } from '@/components/registration/RegistrationFlow';

interface PasswordFeedbackProps {
  password: string;
  strength: number;
  personalDataIssues: string[];
  userData: UserData;
  onSuggestionSelect: (password: string) => void;
}

const PasswordFeedback: React.FC<PasswordFeedbackProps> = ({
  password,
  strength,
  personalDataIssues,
  userData,
  onSuggestionSelect
}) => {
  const crackTime = calculateTimeToCrack(password, strength);

  return (
    <div className="pt-2">
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="timeToCrack">Time to Crack</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="mt-4">
          <StrengthAnalysis 
            password={password}
            strength={strength}
            personalDataIssues={personalDataIssues}
          />
        </TabsContent>
        
        <TabsContent value="timeToCrack" className="mt-4">
          <TimeToCrack crackTime={crackTime} strength={strength} />
        </TabsContent>
        
        <TabsContent value="suggestions" className="mt-4">
          <PasswordSuggestions 
            password={password} 
            strength={strength}
            userData={userData}
            onSelect={onSuggestionSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PasswordFeedback;
