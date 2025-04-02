
import React from 'react';
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

  // Don't show suggestions if password is perfect
  const shouldShowSuggestions = strength < 99;

  return (
    <div className="pt-2 space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Analysis Section */}
        <div className="cyber-card p-4 animate-fade-in">
          <StrengthAnalysis 
            password={password}
            strength={strength}
            personalDataIssues={personalDataIssues}
          />
        </div>
        
        {/* Time to Crack Section */}
        <div className="cyber-card p-4 animate-fade-in">
          <TimeToCrack crackTime={crackTime} strength={strength} />
        </div>
      </div>
      
      {/* Suggestions Section - Only show if not perfect */}
      {shouldShowSuggestions && (
        <div className="cyber-card p-4 animate-fade-in">
          <PasswordSuggestions 
            password={password} 
            strength={strength}
            userData={userData}
            onSelect={onSuggestionSelect}
          />
        </div>
      )}
    </div>
  );
};

export default PasswordFeedback;
