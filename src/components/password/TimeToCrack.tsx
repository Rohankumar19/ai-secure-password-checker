
import React from 'react';
import { Clock, Cpu, Server, Zap } from 'lucide-react';

interface TimeToCrackProps {
  crackTime: {
    regular: string;
    fastComputer: string;
    superComputer: string;
  };
  strength: number;
}

const TimeToCrack: React.FC<TimeToCrackProps> = ({ crackTime, strength }) => {
  // Information about different hashing methods
  const hashingMethods = [
    {
      name: "bcrypt",
      description: "Slow hashing algorithm designed for passwords, uses salt and is highly resistant to brute-force attacks",
      multiplier: "1x (baseline)"
    },
    {
      name: "SHA-256",
      description: "Faster than bcrypt but still secure when properly implemented with salt",
      multiplier: "~1,000x faster than bcrypt"
    },
    {
      name: "MD5 (outdated)",
      description: "Very fast but considered cryptographically broken, should not be used for passwords",
      multiplier: "~10,000x faster than bcrypt"
    }
  ];

  // Generate explanations for different attack types
  const getAttackTypeExplanation = () => {
    if (strength < 40) {
      return {
        title: "Dictionary Attack",
        description: "Your password could be vulnerable to a dictionary attack, where attackers use lists of common passwords and words to guess your password.",
        icon: <Zap size={18} />
      };
    } else if (strength < 70) {
      return {
        title: "Rainbow Table Attack",
        description: "Medium-strength passwords may be vulnerable to rainbow table attacks, which use precomputed tables to crack password hashes more efficiently.",
        icon: <Cpu size={18} />
      };
    } else {
      return {
        title: "Brute Force Attack",
        description: "Strong passwords can only be cracked through brute force, where attackers try every possible combination - which can take an extremely long time.",
        icon: <Server size={18} />
      };
    }
  };

  const attackType = getAttackTypeExplanation();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Clock size={20} className="text-cyber-accent" />
        <h3 className="text-base font-medium">Estimated Time to Crack</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-muted/30 p-3 rounded-md">
          <p className="text-sm font-medium mb-1">Using a typical home computer:</p>
          <p className="text-lg font-bold text-foreground">{crackTime.regular}</p>
        </div>
        
        <div className="bg-muted/30 p-3 rounded-md">
          <p className="text-sm font-medium mb-1">Using a powerful GPU cluster:</p>
          <p className="text-lg font-bold text-foreground">{crackTime.fastComputer}</p>
        </div>
        
        <div className="bg-muted/30 p-3 rounded-md">
          <p className="text-sm font-medium mb-1">Using a supercomputer:</p>
          <p className="text-lg font-bold text-foreground">{crackTime.superComputer}</p>
        </div>
      </div>
      
      <div className="pt-2 border-t border-border/30">
        <div className="flex items-center space-x-2 mb-2">
          {attackType.icon}
          <h4 className="text-sm font-medium">{attackType.title}</h4>
        </div>
        <p className="text-sm text-muted-foreground">{attackType.description}</p>
      </div>
      
      <div className="pt-2 border-t border-border/30">
        <h4 className="text-sm font-medium mb-2">Hashing methods and their security</h4>
        <div className="space-y-2">
          {hashingMethods.map((method, index) => (
            <div key={index} className="text-sm">
              <p className="font-medium">{method.name} <span className="text-xs text-muted-foreground">({method.multiplier})</span></p>
              <p className="text-muted-foreground text-xs">{method.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeToCrack;
