
import React from 'react';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Shield className="h-10 w-10 text-cyber-primary" />
        <h1 className="text-2xl font-bold text-foreground">Password Strength Analyzer</h1>
      </div>
      <p className="text-muted-foreground max-w-lg mx-auto">
        Create a secure password and see how strong it is. Our AI-powered analyzer 
        will provide feedback and suggestions to help you create an unbreakable password.
      </p>
    </div>
  );
};

export default Header;
