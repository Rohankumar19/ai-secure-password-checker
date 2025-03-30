
import React from 'react';
import { Lock, Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center space-y-2 mb-8">
      <div className="h-16 w-16 rounded-full bg-cyber-primary/10 flex items-center justify-center cyber-glow">
        <Lock className="h-8 w-8 text-cyber-primary" />
      </div>
      <h1 className="text-3xl font-bold text-gradient">Password Strength Analyzer</h1>
      <p className="text-muted-foreground max-w-md text-center">
        Use AI-powered analysis to evaluate your password security and get personalized recommendations.
      </p>
    </header>
  );
};

export default Header;
