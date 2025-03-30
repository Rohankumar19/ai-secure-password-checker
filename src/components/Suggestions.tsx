
import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

interface SuggestionsProps {
  password: string;
  strength: number;
}

const Suggestions: React.FC<SuggestionsProps> = ({ password, strength }) => {
  if (!password) {
    return null;
  }

  const getSuggestions = (): string[] => {
    const suggestions: string[] = [];
    
    if (password.length < 12) {
      suggestions.push("Make your password longer (aim for at least 12 characters)");
    }
    
    if (!/[A-Z]/.test(password)) {
      suggestions.push("Add uppercase letters");
    }
    
    if (!/[a-z]/.test(password)) {
      suggestions.push("Add lowercase letters");
    }
    
    if (!/[0-9]/.test(password)) {
      suggestions.push("Add numbers");
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      suggestions.push("Add special characters (!@#$%^&*)");
    }
    
    if (/(.)\1\1/.test(password)) {
      suggestions.push("Avoid repeating characters (e.g., 'aaa')");
    }
    
    if (/^(password|admin|user|123456)$/i.test(password)) {
      suggestions.push("Avoid commonly used passwords");
    }
    
    if (password.length > 0 && strength >= 80) {
      suggestions.push("Your password is strong! Remember to use unique passwords for different accounts.");
    }
    
    return suggestions;
  };

  const suggestions = getSuggestions();

  return (
    <div className="cyber-card p-4 animate-fade-in">
      <div className="flex items-center space-x-2 mb-3">
        {strength >= 75 ? (
          <Shield size={16} className="text-strength-good" />
        ) : (
          <AlertTriangle size={16} className="text-strength-medium" />
        )}
        <h3 className="text-sm font-medium">
          {strength >= 75 ? 'Security Tips' : 'Improvement Suggestions'}
        </h3>
      </div>
      
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-sm flex items-start space-x-2">
            <span className="text-cyber-accent mt-0.5">•</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
