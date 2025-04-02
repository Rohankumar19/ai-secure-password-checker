
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, 
  Shield, Lock, Zap, Database, 
  Server, Cpu, Users, Table, 
  BookOpen, Rocket, Award, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import StrengthMeter from '@/components/StrengthMeter';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 14;
  const navigate = useNavigate();

  const goToSlide = (slideNumber: number) => {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
      setCurrentSlide(slideNumber);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  // Cyberpunk-themed colors
  const colors = {
    primary: '#9b87f5',
    secondary: '#7E69AB',
    accent: '#F97316',
    dark: '#1A1F2C',
    highlight: '#D946EF'
  };

  return (
    <div className="min-h-screen bg-cyber-background flex flex-col">
      {/* Navigation */}
      <div className="p-4 flex justify-between items-center">
        <Button variant="outline" onClick={goToHome} className="text-xs">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to App
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={goToPrevSlide} disabled={currentSlide === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground px-2 py-1 bg-muted/20 rounded">
            {currentSlide} / {totalSlides}
          </div>
          <Button variant="outline" onClick={goToNextSlide} disabled={currentSlide === totalSlides}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Slide Content */}
      <div className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
        {currentSlide === 1 && (
          <div className="h-full flex flex-col items-center justify-center text-center slide-fade-in">
            <Shield className="h-24 w-24 text-cyber-accent mb-6 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gradient mb-6">
              PasswordGuardian AI
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
              Advanced Password Strength Analysis with AI-Powered Suggestions
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              <span className="bg-cyber-accent/10 px-3 py-1 rounded-full">Hackathon 2023 Winner</span>
              <span className="bg-cyber-primary/10 px-3 py-1 rounded-full">Team CyberShield</span>
              <span className="bg-cyber-primary/10 px-3 py-1 rounded-full">v1.0.0</span>
            </div>
          </div>
        )}
        
        {currentSlide === 2 && (
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-8 slide-fade-in">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gradient">
                Problem & Opportunity
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-strength-weak/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Lock className="h-5 w-5 text-strength-weak" />
                  </div>
                  <div>
                    <p className="font-medium">81% of breaches involve weak passwords</p>
                    <p className="text-sm text-muted-foreground">Most users still rely on easily guessable combinations</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-strength-medium/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Users className="h-5 w-5 text-strength-medium" />
                  </div>
                  <div>
                    <p className="font-medium">Existing checkers provide inadequate feedback</p>
                    <p className="text-sm text-muted-foreground">Simple progress bars without actionable suggestions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-strength-strong/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Zap className="h-5 w-5 text-strength-strong" />
                  </div>
                  <div>
                    <p className="font-medium">Users need personalized guidance</p>
                    <p className="text-sm text-muted-foreground">Not just "add symbols" but context-aware suggestions</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex justify-center items-center">
              <div className="bg-cyber-dark p-6 rounded-xl w-full max-w-md">
                <div className="aspect-video bg-cyber-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/lovable-uploads/9324fda1-c12b-4adc-8ba8-185f35959f34.png" 
                    alt="Password Security Issues" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-6">
                  <p className="text-xl font-bold text-center">What's broken in password security today?</p>
                  <div className="mt-4">
                    <StrengthMeter strength={30} />
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Most password checkers provide minimal feedback with no actionable guidance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentSlide === 3 && (
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-8 slide-fade-in">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gradient">
                Gaps in Current Tools
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="rounded-full bg-strength-weak/20 p-1.5 mr-3 mt-0.5">
                    <Check className="h-5 w-5 text-strength-weak" />
                  </div>
                  <div>
                    <p className="font-medium">Binary pass/fail approach</p>
                    <p className="text-sm text-muted-foreground">No nuanced analysis of actual password strength</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-strength-weak/20 p-1.5 mr-3 mt-0.5">
                    <Shield className="h-5 w-5 text-strength-weak" />
                  </div>
                  <div>
                    <p className="font-medium">Limited pattern recognition</p>
                    <p className="text-sm text-muted-foreground">Cannot detect subtle weaknesses or personal data</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-strength-weak/20 p-1.5 mr-3 mt-0.5">
                    <Zap className="h-5 w-5 text-strength-weak" />
                  </div>
                  <div>
                    <p className="font-medium">No context-aware suggestions</p>
                    <p className="text-sm text-muted-foreground">Generic tips instead of personalized recommendations</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-strength-weak/20 p-1.5 mr-3 mt-0.5">
                    <Database className="h-5 w-5 text-strength-weak" />
                  </div>
                  <div>
                    <p className="font-medium">No breach checking or simulation</p>
                    <p className="text-sm text-muted-foreground">Users don't understand real-world vulnerability</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="relative w-full max-w-md">
                <div className="bg-cyber-dark rounded-xl p-6 shadow-lg border border-cyber-primary/20">
                  <h3 className="text-xl font-bold mb-4 text-center">Common Password Checkers</h3>
                  <div className="space-y-6">
                    <div className="border border-border/30 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Basic Checker</span>
                        <div className="bg-strength-weak/20 px-2 py-0.5 rounded text-xs text-strength-weak">Weak</div>
                      </div>
                      <div className="mt-2 h-2 bg-muted rounded-full">
                        <div className="h-full bg-strength-weak rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Add a symbol</p>
                    </div>
                    
                    <div className="border border-border/30 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Checkbox Approach</span>
                        <div className="bg-strength-medium/20 px-2 py-0.5 rounded text-xs text-strength-medium">Medium</div>
                      </div>
                      <div className="mt-2 grid grid-cols-4 gap-1">
                        <div className="h-1 bg-strength-weak rounded-full"></div>
                        <div className="h-1 bg-strength-medium rounded-full"></div>
                        <div className="h-1 bg-muted rounded-full"></div>
                        <div className="h-1 bg-muted rounded-full"></div>
                      </div>
                      <ul className="mt-2 text-xs space-y-1">
                        <li className="flex items-center">
                          <Check className="h-3 w-3 mr-1 text-strength-good" /> 8+ characters
                        </li>
                        <li className="flex items-center">
                          <Check className="h-3 w-3 mr-1 text-strength-good" /> Has numbers
                        </li>
                        <li className="flex items-center text-muted-foreground">
                          <span className="h-3 w-3 mr-1">-</span> Need uppercase
                        </li>
                        <li className="flex items-center text-muted-foreground">
                          <span className="h-3 w-3 mr-1">-</span> Need symbol
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-6 text-center">
                    Existing solutions lack personalization and real security insights
                  </p>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-cyber-accent/20 rounded-xl p-6 transform rotate-6 -z-10 blur-md"></div>
                <div className="absolute -top-4 -left-4 bg-cyber-primary/20 rounded-xl p-6 transform -rotate-6 -z-10 blur-md"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Add remaining slides - we'll add a few more and make the rest available in a supplementary file */}
        {currentSlide === 4 && (
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-8 slide-fade-in">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gradient">
                Our Solution
              </h2>
              <p className="text-muted-foreground mb-6">
                PasswordGuardian AI provides comprehensive password analysis with intelligent, 
                personalized suggestions based on advanced ML and pattern recognition.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-cyber-primary/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Shield className="h-5 w-5 text-cyber-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Advanced Strength Analysis</p>
                    <p className="text-sm text-muted-foreground">Uses ML to identify subtle patterns and vulnerabilities</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-cyber-primary/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Cpu className="h-5 w-5 text-cyber-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Time-to-Crack Simulation</p>
                    <p className="text-sm text-muted-foreground">Shows real-world cracking scenarios with modern hardware</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-cyber-primary/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Rocket className="h-5 w-5 text-cyber-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Intelligent Suggestions</p>
                    <p className="text-sm text-muted-foreground">Personalized, memorable password alternatives</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-cyber-primary/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Users className="h-5 w-5 text-cyber-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Personal Data Detection</p>
                    <p className="text-sm text-muted-foreground">Identifies when passwords contain sensitive personal info</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-cyber-dark p-6 rounded-xl border border-cyber-primary/20 shadow-lg w-full max-w-md">
                <div className="aspect-video bg-cyber-dark rounded flex items-center justify-center overflow-hidden">
                  <div className="w-full space-y-4 p-3">
                    <div>
                      <label className="text-sm font-medium">Password</label>
                      <div className="mt-1 border border-border/30 rounded p-2 text-sm">
                        <code>Summer2024!</code>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">
                        <StrengthMeter strength={68} />
                      </div>
                    </div>
                    <div className="border border-border/30 rounded p-3 space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-cyber-accent" />
                        <span className="font-medium">Time to crack:</span>
                        <span className="ml-2 text-strength-medium">3 months</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Shield className="h-4 w-4 mr-2 text-cyber-accent" />
                        <span className="font-medium">Issue detected:</span>
                        <span className="ml-2 text-strength-weak">Contains year pattern</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Zap className="h-4 w-4 mr-2 text-cyber-accent" />
                        <span className="font-medium">Suggestion:</span>
                        <span className="ml-2 text-cyber-primary">5umm3r#X92Z!</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-center mb-2">Smart Password Analysis</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Provides comprehensive strength assessment with real-world cracking simulations
                    and intelligent, context-aware suggestions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentSlide === 5 && (
          <div className="h-full flex flex-col items-center justify-center slide-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gradient text-center">
              Architecture Diagram
            </h2>
            <div className="w-full max-w-4xl bg-cyber-dark p-6 rounded-xl border border-cyber-primary/20">
              <div className="aspect-[16/9] relative">
                <div className="absolute inset-0 grid grid-cols-3 gap-4">
                  {/* Frontend Layer */}
                  <div className="col-span-3 flex justify-center">
                    <div className="bg-cyber-primary/10 rounded-lg px-4 py-2 border border-cyber-primary/30 flex items-center">
                      <div className="mr-2">
                        <Cpu className="h-5 w-5 text-cyber-primary" />
                      </div>
                      <span className="font-medium">React Frontend - User Interface</span>
                    </div>
                  </div>
                  
                  {/* API Layer - Middle */}
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="h-8 w-0.5 bg-cyber-primary/30"></div>
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <div className="bg-cyber-accent/10 rounded-lg px-4 py-2 border border-cyber-accent/30 flex items-center">
                      <div className="mr-2">
                        <Server className="h-5 w-5 text-cyber-accent" />
                      </div>
                      <span className="font-medium">FastAPI Backend - Business Logic</span>
                    </div>
                  </div>
                  
                  {/* Machine Learning Layer */}
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="h-8 w-0.5 bg-cyber-accent/30"></div>
                  </div>
                  <div className="col-span-3 grid grid-cols-2 gap-4">
                    <div className="flex justify-center">
                      <div className="bg-purple-500/10 rounded-lg px-4 py-2 border border-purple-500/30 flex items-center">
                        <div className="mr-2">
                          <BookOpen className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className="font-medium">ML Classifier (PyTorch)</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-green-500/10 rounded-lg px-4 py-2 border border-green-500/30 flex items-center">
                        <div className="mr-2">
                          <Rocket className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="font-medium">LLM Suggestion Engine (Mistral 7B)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector Lines */}
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="h-8 w-0.5 bg-purple-500/30"></div>
                  </div>
                  
                  {/* Feedback Layer */}
                  <div className="col-span-3 flex justify-center">
                    <div className="bg-green-500/10 rounded-lg px-4 py-2 border border-green-500/30 flex items-center">
                      <div className="mr-2">
                        <Award className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="font-medium">Password Analysis & Feedback System</span>
                    </div>
                  </div>
                  
                  {/* Arrows */}
                  <div className="absolute left-1/2 top-[20%] h-8 w-8 -translate-x-1/2 -translate-y-1/2">
                    <Zap className="h-5 w-5 text-cyber-primary" />
                  </div>
                  <div className="absolute left-1/2 top-[42%] h-8 w-8 -translate-x-1/2 -translate-y-1/2">
                    <Zap className="h-5 w-5 text-cyber-accent" />
                  </div>
                  <div className="absolute left-1/2 top-[64%] h-8 w-8 -translate-x-1/2 -translate-y-1/2">
                    <Zap className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="absolute left-1/2 top-[85%] h-8 w-8 -translate-x-1/2 -translate-y-1/2">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6 max-w-2xl text-center">
              Our architecture integrates React frontend with FastAPI backend services, powered by
              PyTorch-based classification models and Mistral 7B LLM for intelligent password suggestions
            </p>
          </div>
        )}
        
        {/* Slides 6-14 would be implemented similarly */}
        
        {/* Add a default slide for any unimplemented slides */}
        {(currentSlide > 5 && currentSlide <= totalSlides) && (
          <div className="h-full flex flex-col items-center justify-center slide-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gradient">
              Slide {currentSlide}
            </h2>
            <div className="bg-cyber-dark p-8 rounded-xl max-w-md">
              <p className="text-muted-foreground text-center">
                Additional slides coming soon. This presentation is under development.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Navigation */}
      <div className="p-4 flex justify-between">
        <Button variant="ghost" size="sm" onClick={goToPrevSlide} disabled={currentSlide === 1}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <Button variant="ghost" size="sm" onClick={goToNextSlide} disabled={currentSlide === totalSlides}>
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Presentation;
