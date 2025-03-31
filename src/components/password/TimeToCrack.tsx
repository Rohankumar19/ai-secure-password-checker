
import React from 'react';
import { Clock, Cpu, Server, Zap, Shield, Lock } from 'lucide-react';

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

  // Visual indicator for time to crack based on strength
  const getTimeVisual = () => {
    if (strength < 30) {
      return (
        <div className="flex items-center justify-center py-3">
          <div className="animate-pulse flex space-x-1">
            <Lock size={16} className="text-strength-weak" />
            <Lock size={16} className="text-strength-weak" />
            <Lock size={16} className="text-strength-weak" />
            <Zap size={20} className="text-strength-weak" />
          </div>
          <p className="ml-2 text-xs text-strength-weak">Cracked instantly</p>
        </div>
      );
    } else if (strength < 60) {
      return (
        <div className="flex items-center justify-center py-3">
          <div className="animate-pulse flex space-x-1">
            <Lock size={16} className="text-strength-medium" />
            <Lock size={16} className="text-strength-medium" />
            <Cpu size={20} className="text-strength-medium" />
          </div>
          <p className="ml-2 text-xs text-strength-medium">Cracked in hours/days</p>
        </div>
      );
    } else if (strength < 80) {
      return (
        <div className="flex items-center justify-center py-3">
          <div className="flex space-x-1">
            <Lock size={16} className="text-strength-good" />
            <Lock size={16} className="text-strength-good" />
            <Server size={20} className="text-strength-good" />
          </div>
          <p className="ml-2 text-xs text-strength-good">Would take months/years</p>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center py-3">
          <div className="flex space-x-1">
            <Shield size={16} className="text-strength-strong" />
            <Lock size={16} className="text-strength-strong" />
            <Lock size={16} className="text-strength-strong" />
            <Shield size={16} className="text-strength-strong" />
          </div>
          <p className="ml-2 text-xs text-strength-strong">Would take centuries</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Clock size={20} className="text-cyber-accent" />
        <h3 className="text-base font-medium">Estimated Time to Crack</h3>
      </div>
      
      {/* Visual representation */}
      {getTimeVisual()}
      
      <div className="space-y-3">
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Using a typical home computer:</p>
            <Clock size={16} className="text-cyber-accent" />
          </div>
          <p className="text-lg font-bold text-foreground">{crackTime.regular}</p>
        </div>
        
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Using a powerful GPU cluster:</p>
            <Cpu size={16} className="text-cyber-accent" />
          </div>
          <p className="text-lg font-bold text-foreground">{crackTime.fastComputer}</p>
        </div>
        
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Using a supercomputer:</p>
            <Server size={16} className="text-cyber-accent" />
          </div>
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
    </div>
  );
};

export default TimeToCrack;
