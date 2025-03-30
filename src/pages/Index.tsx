
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PasswordInput from '@/components/PasswordInput';
import StrengthMeter from '@/components/StrengthMeter';
import Feedback from '@/components/Feedback';
import TimeToCrack from '@/components/TimeToCrack';
import Suggestions from '@/components/Suggestions';
import { calculatePasswordStrength } from '@/utils/passwordUtils';
import { Shield } from 'lucide-react';

const Index = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    // Update password strength when password changes
    const calculatedStrength = calculatePasswordStrength(password);
    setStrength(calculatedStrength);
  }, [password]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto">
        <Header />
        
        <div className="cyber-card p-6 mb-6">
          <div className="space-y-6">
            <PasswordInput 
              password={password} 
              setPassword={setPassword} 
            />
            
            <StrengthMeter strength={strength} />
            
            {password && <Feedback password={password} />}
          </div>
        </div>
        
        {password && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimeToCrack password={password} strength={strength} />
            <Suggestions password={password} strength={strength} />
          </div>
        )}
        
        <footer className="mt-8 text-center text-xs text-muted-foreground flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-1">
            <Shield size={12} />
            <span>Your passwords are never stored or transmitted</span>
          </div>
          <p>AI Password Strength Analyzer © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
