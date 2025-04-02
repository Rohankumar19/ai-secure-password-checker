
import React from 'react';
import { Check, X, RefreshCw, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { generateStrongPassword } from '@/utils/passwordUtils';
import { useToast } from "@/hooks/use-toast";

interface FeedbackItemProps {
  text: string;
  fulfilled: boolean;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ text, fulfilled }) => (
  <div className="flex items-center space-x-2">
    <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${fulfilled ? 'bg-strength-good/20 text-strength-good' : 'bg-strength-weak/20 text-strength-weak'}`}>
      {fulfilled ? <Check size={12} /> : <X size={12} />}
    </div>
    <span className="text-sm">{text}</span>
  </div>
);

interface FeedbackProps {
  password: string;
}

const Feedback: React.FC<FeedbackProps> = ({ password }) => {
  const { toast } = useToast();
  const [suggestedPassword, setSuggestedPassword] = React.useState(() => 
    generateStrongPassword(password)
  );

  React.useEffect(() => {
    setSuggestedPassword(generateStrongPassword(password));
  }, [password]);

  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(suggestedPassword);
    toast({
      title: "Copied!",
      description: "Strong password copied to clipboard",
    });
  };

  const regeneratePassword = () => {
    const newPassword = generateStrongPassword(password);
    setSuggestedPassword(newPassword);
  };

  // Example transformation breakdown for educational purposes
  const getTransformationExample = () => {
    if (!password || password.length < 3) return null;
    
    return (
      <div className="mt-2 text-xs text-muted-foreground">
        <p>Why this suggestion is memorable:</p>
        <ul className="mt-1 space-y-1 list-disc pl-4">
          <li>Maintains familiar elements from your password</li>
          <li>Uses patterns that are easier to remember</li>
          <li>Adds complexity in a structured way</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <h4 className="text-sm font-medium mb-2">Password Requirements</h4>
        <div className="space-y-1">
          <FeedbackItem text="At least 8 characters long" fulfilled={hasLength} />
          <FeedbackItem text="Contains uppercase letters" fulfilled={hasUppercase} />
          <FeedbackItem text="Contains lowercase letters" fulfilled={hasLowercase} />
          <FeedbackItem text="Contains numbers" fulfilled={hasNumber} />
          <FeedbackItem text="Contains special characters" fulfilled={hasSpecial} />
        </div>
      </div>
      
      <div className="pt-3 border-t border-border/30">
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center">
            <span>Suggested Memorable Password</span>
          </h4>
          <div className="flex items-center space-x-2">
            <div className="bg-strength-good/10 text-strength-good border border-strength-good/20 rounded px-2 py-1 text-sm font-mono flex-1 truncate">
              {suggestedPassword}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground" 
              onClick={regeneratePassword}
              title="Generate new password"
            >
              <RefreshCw size={14} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground" 
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </Button>
          </div>
          {getTransformationExample()}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
