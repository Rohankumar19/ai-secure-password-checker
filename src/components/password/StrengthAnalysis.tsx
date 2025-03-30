
import React from 'react';
import { Shield, AlertTriangle, Check, X } from 'lucide-react';

interface StrengthAnalysisProps {
  password: string;
  strength: number;
  personalDataIssues: string[];
}

const StrengthAnalysis: React.FC<StrengthAnalysisProps> = ({ 
  password, 
  strength,
  personalDataIssues 
}) => {
  // Generate feedback based on strength
  const getStrengthFeedback = () => {
    if (strength < 30) {
      return "Your password is very weak and can be easily cracked through simple brute-force or dictionary attacks.";
    } else if (strength < 60) {
      return "Your password has medium strength but could still be vulnerable to advanced dictionary attacks or targeted brute-force attempts.";
    } else if (strength < 80) {
      return "Your password has good strength and would require significant resources to crack through brute-force methods.";
    } else {
      return "Your password is very strong and would be extremely difficult to crack even with advanced techniques.";
    }
  };

  // Check for common password patterns
  const commonPatterns = [
    { test: /^[0-9]+$/, message: "Using only numbers is very weak" },
    { test: /^[a-zA-Z]+$/, message: "Using only letters without numbers or special characters is weak" },
    { test: /(.)\1{2,}/, message: "Repeated characters (e.g., 'aaa') weaken your password" },
    { test: /^(password|admin|user|login).*$/i, message: "Your password contains common words that are easily guessed" },
    { test: /^(qwerty|asdfgh|zxcvbn).*$/i, message: "Your password contains keyboard patterns that are easily guessed" },
    { test: /^.{1,7}$/, message: "Your password is too short" },
  ];

  const patternIssues = commonPatterns
    .filter(pattern => pattern.test.test(password))
    .map(pattern => pattern.message);

  // Positive aspects of the password
  const getPositiveAspects = () => {
    const aspects = [];
    
    if (password.length >= 12) aspects.push("Good length (12+ characters)");
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) aspects.push("Mix of uppercase and lowercase letters");
    if (/[0-9]/.test(password)) aspects.push("Contains numbers");
    if (/[^A-Za-z0-9]/.test(password)) aspects.push("Contains special characters");
    if (!/(.)\1{2,}/.test(password)) aspects.push("No character repetition");
    if (strength >= 80) aspects.push("High entropy (randomness)");
    
    return aspects;
  };

  const positiveAspects = getPositiveAspects();
  const issues = [...patternIssues, ...personalDataIssues];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {strength >= 70 ? (
          <Shield size={20} className="text-strength-good" />
        ) : (
          <AlertTriangle size={20} className="text-strength-medium" />
        )}
        <h3 className="text-base font-medium">Password Analysis</h3>
      </div>
      
      <p className="text-sm">{getStrengthFeedback()}</p>
      
      {issues.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 text-strength-weak flex items-center">
            <AlertTriangle size={16} className="mr-1" /> Issues Found
          </h4>
          <ul className="space-y-1">
            {issues.map((issue, index) => (
              <li key={index} className="text-sm flex items-start">
                <X size={16} className="text-strength-weak mr-2 mt-0.5 flex-shrink-0" />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {positiveAspects.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 text-strength-good flex items-center">
            <Check size={16} className="mr-1" /> Strengths
          </h4>
          <ul className="space-y-1">
            {positiveAspects.map((aspect, index) => (
              <li key={index} className="text-sm flex items-start">
                <Check size={16} className="text-strength-good mr-2 mt-0.5 flex-shrink-0" />
                <span>{aspect}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StrengthAnalysis;
