
import React from 'react';
import { Clock } from 'lucide-react';

interface TimeToCrackProps {
  password: string;
  strength: number;
}

const TimeToCrack: React.FC<TimeToCrackProps> = ({ password, strength }) => {
  // Calculate approximate time to crack based on password strength
  // This is a very simplified calculation for demonstration purposes
  const calculateTimeToCrack = (): string => {
    if (!password) return 'Instantly';
    
    if (strength < 20) return 'Instantly';
    if (strength < 40) return 'A few minutes';
    if (strength < 60) return 'A few hours';
    if (strength < 75) return 'A few days';
    if (strength < 85) return 'A few months';
    if (strength < 95) return 'A few years';
    return 'Centuries';
  };

  return (
    <div className="cyber-card p-4 animate-fade-in">
      <div className="flex items-center space-x-2 mb-2">
        <Clock size={16} className="text-cyber-accent" />
        <h3 className="text-sm font-medium">Estimated Time to Crack</h3>
      </div>
      <p className="text-2xl font-bold text-gradient">{calculateTimeToCrack()}</p>
      <p className="text-xs text-muted-foreground mt-1">
        Time required for a computer to brute force your password
      </p>
    </div>
  );
};

export default TimeToCrack;
