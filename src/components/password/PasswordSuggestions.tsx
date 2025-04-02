
import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { generateStrongPassword } from '@/utils/passwordUtils';
import { UserData } from '@/components/registration/RegistrationFlow';

interface PasswordSuggestionsProps {
  password: string;
  strength: number;
  userData: UserData;
  onSelect: (password: string) => void;
}

const PasswordSuggestions: React.FC<PasswordSuggestionsProps> = ({ 
  password, 
  strength,
  userData,
  onSelect 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSuggestion, setPendingSuggestion] = useState<string | null>(null);
  const [suggestionStrengths, setSuggestionStrengths] = useState<number[]>([]);

  // Don't show suggestions if the password is already perfect
  const shouldShowSuggestions = strength < 99;

  // Generate suggestions when password changes or when explicitly requested
  useEffect(() => {
    if (password && shouldShowSuggestions) {
      generateSuggestions();
    }
  }, [password, shouldShowSuggestions]);

  const generateSuggestions = () => {
    if (!shouldShowSuggestions) {
      setSuggestions([]);
      setSuggestionStrengths([]);
      return;
    }

    const newSuggestions = [];
    const newStrengths = [];
    
    // Generate suggestions until we have 3 that are strong enough
    let attempts = 0;
    let count = 0;
    
    while (count < 3 && attempts < 10) {
      attempts++;
      const suggestion = generateStrongPassword(password);
      
      // Calculate the strength of this suggestion
      const calculateStrength = (pwd: string): number => {
        let score = 0;
        
        // Length (up to 30 points)
        const lengthScore = Math.min(30, pwd.length * 2);
        score += lengthScore;
        
        // Character variety (up to 40 points)
        if (/[A-Z]/.test(pwd)) score += 10; // Uppercase
        if (/[a-z]/.test(pwd)) score += 10; // Lowercase
        if (/[0-9]/.test(pwd)) score += 10; // Numbers
        if (/[^A-Za-z0-9]/.test(pwd)) score += 10; // Special chars
        
        // Complexity patterns
        const hasVariety = (/[A-Z]/.test(pwd) ? 1 : 0) +
                           (/[a-z]/.test(pwd) ? 1 : 0) +
                           (/[0-9]/.test(pwd) ? 1 : 0) +
                           (/[^A-Za-z0-9]/.test(pwd) ? 1 : 0);
        
        score += hasVariety * 7.5; // Up to 30
        
        // Length bonus for very long passwords
        if (pwd.length > 12) {
          score += Math.min(10, (pwd.length - 12));
        }
        
        // Return bounded score
        return Math.max(0, Math.min(100, Math.round(score)));
      };
      
      const suggestionStrength = calculateStrength(suggestion);
      
      // Only add if the suggestion is strong enough (score > 95)
      if (suggestionStrength > 95) {
        // Check if we already have this suggestion
        if (!newSuggestions.includes(suggestion)) {
          newSuggestions.push(suggestion);
          newStrengths.push(suggestionStrength);
          count++;
        }
      }
    }
    
    setSuggestions(newSuggestions);
    setSuggestionStrengths(newStrengths);
    setSelectedIndex(null);
    setShowConfirmation(false);
    setPendingSuggestion(null);
  };

  const handleSelectSuggestion = (index: number) => {
    setSelectedIndex(index);
    setPendingSuggestion(suggestions[index]);
    setShowConfirmation(true);
  };

  const handleConfirmSuggestion = () => {
    if (pendingSuggestion) {
      onSelect(pendingSuggestion);
      setShowConfirmation(false);
      setPendingSuggestion(null);
    }
  };

  const handleCancelSuggestion = () => {
    setShowConfirmation(false);
    setSelectedIndex(null);
    setPendingSuggestion(null);
  };

  // Display tips for why the password is memorable and strong
  const getPasswordAnalysis = (original: string, transformed: string, strength: number) => {
    if (!original || original.length < 3) return null;
    
    // Analyze how the password was transformed
    const analysis = [];
    
    // Check for leetspeak
    if (/[0-9@$!%*?&#]/.test(transformed)) {
      analysis.push("Uses leetspeak substitutions for better security");
    }
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(transformed)) {
      analysis.push("Contains special characters in unpredictable positions");
    }
    
    // Check for mixed case
    if (/[A-Z]/.test(transformed) && /[a-z]/.test(transformed)) {
      analysis.push("Uses mixed case for increased complexity");
    }
    
    // Check for sufficient length
    if (transformed.length >= 12) {
      analysis.push("Has good length (12+ characters)");
    }
    
    // Check for added suffix
    if (transformed.length > original.length + 2) {
      analysis.push("Includes unique suffix for added security");
    }
    
    // Mention pattern/structure for memorability
    analysis.push("Structure makes it easier to remember while being secure");
    
    return (
      <div className="space-y-2 text-xs mt-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">Password Strength:</span>
          <span className="font-medium text-strength-good">{strength}/100</span>
        </div>
        
        <div className="mt-1">
          <span className="text-muted-foreground">Why it's strong & memorable:</span>
          <ul className="pl-4 mt-1 list-disc space-y-1">
            {analysis.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-2 flex items-center text-muted-foreground">
          <AlertTriangle size={12} className="mr-1" /> 
          <span>Remember to store this securely after creation</span>
        </div>
      </div>
    );
  };

  // If we shouldn't show suggestions, return null
  if (!shouldShowSuggestions) {
    return (
      <div className="p-3 rounded-md bg-strength-good/10 border border-strength-good/20">
        <div className="flex items-center space-x-2">
          <Check size={16} className="text-strength-good" />
          <h3 className="text-sm font-medium">Perfect Password</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your password is extremely strong and no further suggestions are needed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Stronger Password Suggestions</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={generateSuggestions}
          className="h-8 px-2"
        >
          <RefreshCw size={14} className="mr-1" /> Regenerate
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {strength >= 80 
          ? "Your password is already good, but here are even stronger alternatives:" 
          : "Try one of these stronger yet memorable passwords:"}
      </p>
      
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className={`
              rounded-md border p-3 cursor-pointer transition-colors
              ${selectedIndex === index 
                ? 'bg-strength-good/10 border-strength-good/30' 
                : 'border-border hover:border-primary/30 hover:bg-muted/30'}
            `}
            onClick={() => handleSelectSuggestion(index)}
          >
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm break-all pr-2">{suggestion}</div>
              {selectedIndex === index && (
                <Check size={18} className="text-strength-good flex-shrink-0" />
              )}
            </div>
            {selectedIndex === index && getPasswordAnalysis(password, suggestion, suggestionStrengths[index] || 95)}
          </div>
        ))}
      </div>

      {showConfirmation && pendingSuggestion && (
        <div className="mt-4 p-4 bg-muted/30 rounded-md border border-primary/20">
          <h4 className="text-sm font-medium mb-2">Confirm Password Change</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to use this suggested password? Make sure to save it securely.
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelSuggestion}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleConfirmSuggestion}
            >
              Use This Password
            </Button>
          </div>
        </div>
      )}
      
      <div className="text-sm mt-2">
        <p className="text-muted-foreground text-xs">
          These suggestions use leetspeak, random symbol placement, and secure patterns while maintaining some memorability based on your original input.
        </p>
      </div>
    </div>
  );
};

export default PasswordSuggestions;
