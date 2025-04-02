
import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationFlow from '@/components/registration/RegistrationFlow';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Presentation } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-cyber-background">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          <Link to="/presentation">
            <Button variant="outline" size="sm" className="text-xs">
              <Presentation className="mr-1 h-4 w-4" /> View Presentation
            </Button>
          </Link>
        </div>
        <RegistrationFlow />
      </div>
      
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p className="mb-1 text-sm">No passwords are stored. Personal info is used only to prevent weak passwords and improve feedback.</p>
        <p>Password Strength Analyzer with AI © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
