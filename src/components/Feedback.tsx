
import React from 'react';
import { Check, X } from 'lucide-react';

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
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return (
    <div className="space-y-2 animate-fade-in">
      <h4 className="text-sm font-medium mb-2">Password Requirements</h4>
      <div className="space-y-1">
        <FeedbackItem text="At least 8 characters long" fulfilled={hasLength} />
        <FeedbackItem text="Contains uppercase letters" fulfilled={hasUppercase} />
        <FeedbackItem text="Contains lowercase letters" fulfilled={hasLowercase} />
        <FeedbackItem text="Contains numbers" fulfilled={hasNumber} />
        <FeedbackItem text="Contains special characters" fulfilled={hasSpecial} />
      </div>
    </div>
  );
};

export default Feedback;
