
import React from 'react';
import { cn } from "@/lib/utils";

interface StrengthMeterProps {
  strength: number; // 0-100
}

const StrengthMeter: React.FC<StrengthMeterProps> = ({ strength }) => {
  // Determine the level based on strength
  const getLevel = () => {
    if (strength < 30) return 'weak';
    if (strength < 60) return 'medium';
    if (strength < 80) return 'good';
    return 'strong';
  };

  const getColor = () => {
    const level = getLevel();
    return {
      weak: 'bg-strength-weak',
      medium: 'bg-strength-medium',
      good: 'bg-strength-good',
      strong: 'bg-strength-strong',
    }[level];
  };

  const getText = () => {
    const level = getLevel();
    return {
      weak: 'Weak',
      medium: 'Medium',
      good: 'Good',
      strong: 'Strong',
    }[level];
  };

  const getTextColor = () => {
    const level = getLevel();
    return {
      weak: 'text-strength-weak',
      medium: 'text-strength-medium',
      good: 'text-strength-good',
      strong: 'text-strength-strong',
    }[level];
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Password Strength</span>
        <span className={cn("text-sm font-medium", getTextColor())}>{getText()}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500 ease-out", getColor())} 
          style={{ width: `${strength}%` }}
        />
      </div>
      <div className="grid grid-cols-4 gap-1">
        <div className={cn("h-1 rounded-full", strength >= 25 ? "bg-strength-weak" : "bg-muted")} />
        <div className={cn("h-1 rounded-full", strength >= 50 ? "bg-strength-medium" : "bg-muted")} />
        <div className={cn("h-1 rounded-full", strength >= 75 ? "bg-strength-good" : "bg-muted")} />
        <div className={cn("h-1 rounded-full", strength >= 90 ? "bg-strength-strong" : "bg-muted")} />
      </div>
    </div>
  );
};

export default StrengthMeter;
