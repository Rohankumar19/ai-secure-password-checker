
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import ProgressIndicator from './ProgressIndicator';

export interface UserData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  password?: string;
}

const RegistrationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    dateOfBirth: '',
    email: '',
  });

  const handleStepOneComplete = (data: Omit<UserData, 'password'>) => {
    setUserData({ ...userData, ...data });
    setCurrentStep(2);
  };

  const handleStepTwoComplete = (password: string) => {
    setUserData({ ...userData, password });
    setCurrentStep(3);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUserData({
      fullName: '',
      dateOfBirth: '',
      email: '',
    });
  };

  return (
    <div className="cyber-card p-6 md:p-8 animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="text-cyber-primary h-6 w-6" />
        <h1 className="text-xl font-bold text-foreground">Password Strength Analyzer with AI</h1>
      </div>

      <ProgressIndicator currentStep={currentStep} totalSteps={3} />

      <div className="mt-6">
        {currentStep === 1 && <StepOne userData={userData} onComplete={handleStepOneComplete} />}
        {currentStep === 2 && (
          <StepTwo 
            userData={userData} 
            onComplete={handleStepTwoComplete} 
            onBack={() => setCurrentStep(1)} 
          />
        )}
        {currentStep === 3 && <StepThree userData={userData} onReset={handleReset} />}
      </div>
    </div>
  );
};

export default RegistrationFlow;
