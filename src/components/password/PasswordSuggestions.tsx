
import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, ArrowRight } from 'lucide-react';
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

  // Generate suggestions when password changes
  useEffect(() => {
    if (password) {
      generateSuggestions();
    }
  }, [password]);

  const generateSuggestions = () => {
    const newSuggestions = [];
    
    // Generate 3 different suggestions
    for (let i = 0; i < 3; i++) {
      const suggestion = generateStrongPassword(password);
      newSuggestions.push(suggestion);
    }
    
    setSuggestions(newSuggestions);
    setSelectedIndex(null);
  };

  const handleSelectSuggestion = (index: number) => {
    setSelectedIndex(index);
    onSelect(suggestions[index]);
  };

  // Display the transformation details
  const getTransformationExample = (original: string, transformed: string) => {
    if (!original || original.length < 3) return null;
    
    let leetExample = original.replace(/[aeiosblt]/gi, m => {
      const replacement = { 'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 'b': '8', 'l': '1', 't': '7' }[m.toLowerCase()];
      return replacement || m;
    });
    
    return (
      <div className="space-y-1 text-xs mt-1">
        <div><span className="text-muted-foreground">Original:</span> {original}</div>
        <div className="flex items-center">
          <span className="text-muted-foreground mr-1">Transformations:</span> 
          <ArrowRight size={10} className="text-muted-foreground mx-1" />
          <span className="font-mono text-strength-good">{transformed}</span>
        </div>
      </div>
    );
  };

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
          ? "Your password is already strong, but here are some even stronger alternatives:" 
          : "Try one of these stronger passwords based on your input:"}
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
            {selectedIndex === index && getTransformationExample(password, suggestion)}
          </div>
        ))}
      </div>
      
      <div className="text-sm mt-2">
        <p className="text-muted-foreground text-xs">
          These suggestions follow best practices for secure passwords while maintaining some familiarity with your original input.
        </p>
      </div>
    </div>
  );
};

export default PasswordSuggestions;
