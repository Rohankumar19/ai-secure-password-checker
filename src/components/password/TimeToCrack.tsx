import React, { useState } from 'react';
import { Clock, Cpu, Server, Zap, Shield, Lock, Book, Table, Calendar, AlertTriangle, CheckCircle, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimeToCrackProps {
  crackTime: {
    regular: string;
    fastComputer: string;
    superComputer: string;
    hashcatResults?: {
      gpus: {
        name: string;
        algorithms: {
          name: string;
          timeInSeconds: number;
        }[];
      }[];
      attackModes: {
        name: string;
        description: string;
        effectiveness: string;
        estimatedTime: string;
        icon: string;
      }[];
    };
  };
  strength: number;
}

const TimeToCrack: React.FC<TimeToCrackProps> = ({ crackTime, strength }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  
  // Information about different hashing methods
  const hashingMethods = [
    {
      name: "bcrypt",
      description: "Slow hashing algorithm designed for passwords, uses salt and is highly resistant to brute-force attacks",
      multiplier: "1x (baseline)"
    },
    {
      name: "SHA-256",
      description: "Faster than bcrypt but still secure when properly implemented with salt",
      multiplier: "~1,000x faster than bcrypt"
    },
    {
      name: "MD5 (outdated)",
      description: "Very fast but considered cryptographically broken, should not be used for passwords",
      multiplier: "~10,000x faster than bcrypt"
    }
  ];

  // Generate explanations for different attack types
  const getAttackTypeExplanation = () => {
    if (strength < 40) {
      return {
        title: "Dictionary Attack",
        description: "Your password could be vulnerable to a dictionary attack, where attackers use lists of common passwords and words to guess your password.",
        icon: <Book size={18} />
      };
    } else if (strength < 70) {
      return {
        title: "Rainbow Table Attack",
        description: "Medium-strength passwords may be vulnerable to rainbow table attacks, which use precomputed tables to crack password hashes more efficiently.",
        icon: <Table size={18} />
      };
    } else {
      return {
        title: "Brute Force Attack",
        description: "Strong passwords can only be cracked through brute force, where attackers try every possible combination - which can take an extremely long time.",
        icon: <Server size={18} />
      };
    }
  };

  const attackType = getAttackTypeExplanation();

  // Visual indicator for time to crack based on strength
  const getTimeVisual = () => {
    if (strength < 30) {
      return (
        <div className="flex items-center justify-center py-3">
          <div className="animate-pulse flex space-x-1">
            <Lock size={16} className="text-strength-weak" />
            <Lock size={16} className="text-strength-weak" />
            <Lock size={16} className="text-strength-weak" />
            <Zap size={20} className="text-strength-weak" />
          </div>
          <p className="ml-2 text-xs text-strength-weak">Cracked instantly</p>
        </div>
      );
    } else if (strength < 60) {
      return (
        <div className="flex items-center justify-center py-3">
          <div className="animate-pulse flex space-x-1">
            <Lock size={16} className="text-strength-medium" />
            <Lock size={16} className="text-strength-medium" />
            <Cpu size={20} className="text-strength-medium" />
          </div>
          <p className="ml-2 text-xs text-strength-medium">Cracked in hours/days</p>
        </div>
      );
    } else if (strength < 80) {
      return (
        <div className="flex items-center justify-center py-3">
          <div className="flex space-x-1">
            <Lock size={16} className="text-strength-good" />
            <Lock size={16} className="text-strength-good" />
            <Server size={20} className="text-strength-good" />
          </div>
          <p className="ml-2 text-xs text-strength-good">Would take months/years</p>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center py-3">
          <div className="flex space-x-1">
            <Shield size={16} className="text-strength-strong" />
            <Lock size={16} className="text-strength-strong" />
            <Lock size={16} className="text-strength-strong" />
            <Shield size={16} className="text-strength-strong" />
          </div>
          <p className="ml-2 text-xs text-strength-strong">Would take centuries</p>
        </div>
      );
    }
  };

  // Format hashcat time results with appropriate units
  const formatHashcatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "Infinite";
    if (seconds < 1) return "Instantly";
    
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`;
    return "Millions of years";
  };

  // Get icon for attack mode
  const getAttackIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap size={16} className="text-cyber-accent" />;
      case 'book': return <Book size={16} className="text-cyber-accent" />;
      case 'table': return <Table size={16} className="text-cyber-accent" />;
      case 'combine': return <Cpu size={16} className="text-cyber-accent" />;
      default: return <Zap size={16} className="text-cyber-accent" />;
    }
  };

  // Determine color based on time to crack
  const getTimeColor = (timeString: string) => {
    if (timeString.includes("Instantly") || timeString.includes("seconds") || timeString.includes("minutes"))
      return "text-strength-weak";
    if (timeString.includes("hours") || timeString.includes("days"))
      return "text-strength-medium";
    if (timeString.includes("years") && !timeString.includes("Millions"))
      return "text-strength-good";
    return "text-strength-strong";
  };

  // Calculate password lifespan based on strength
  const getLifespanDetails = () => {
    if (strength < 30) {
      return {
        timespan: "Change Immediately",
        description: "This password is severely compromised and needs immediate replacement.",
        color: "text-strength-weak",
        recommendations: [
          "Change your password right now",
          "Enable two-factor authentication",
          "Check for account compromises"
        ],
        riskLevel: "Critical",
        riskColor: "text-red-500",
        icon: <AlertTriangle className="text-red-500" size={18} />
      };
    } else if (strength < 50) {
      return {
        timespan: "1 Month",
        description: "Weak passwords require very frequent changes to maintain security.",
        color: "text-strength-weak",
        recommendations: [
          "Change password monthly",
          "Use password manager",
          "Add special characters and numbers"
        ],
        riskLevel: "High",
        riskColor: "text-orange-500",
        icon: <History className="text-orange-500" size={18} />
      };
    } else if (strength < 70) {
      return {
        timespan: "3 Months",
        description: "Medium-strength passwords need regular updates to stay secure.",
        color: "text-strength-medium",
        recommendations: [
          "Change password quarterly",
          "Consider increasing length",
          "Mix different character types"
        ],
        riskLevel: "Medium",
        riskColor: "text-yellow-500",
        icon: <Clock className="text-yellow-500" size={18} />
      };
    } else if (strength < 85) {
      return {
        timespan: "6 Months",
        description: "Strong passwords benefit from semi-annual changes.",
        color: "text-strength-good",
        recommendations: [
          "Change password twice a year",
          "Maintain current complexity",
          "Monitor for data breaches"
        ],
        riskLevel: "Low",
        riskColor: "text-green-500",
        icon: <CheckCircle className="text-green-500" size={18} />
      };
    } else {
      return {
        timespan: "12 Months",
        description: "Very strong passwords can last longer, but annual changes are recommended.",
        color: "text-strength-strong",
        recommendations: [
          "Annual password rotation",
          "Keep using password manager",
          "Continue current practices"
        ],
        riskLevel: "Very Low",
        riskColor: "text-blue-500",
        icon: <Shield className="text-blue-500" size={18} />
      };
    }
  };

  const lifespan = getLifespanDetails();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Clock size={20} className="text-cyber-accent" />
        <h3 className="text-base font-medium">Time to Crack Simulation</h3>
      </div>
      
      {/* Visual representation */}
      {getTimeVisual()}
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-4 gap-2'} bg-cyber-dark p-1 rounded-lg border border-cyber-accent/10`}>
          <TabsTrigger 
            value="overview" 
            className={`
              relative px-2 py-1 rounded-md transition-all duration-200
              data-[state=active]:bg-cyber-accent/20 
              data-[state=active]:text-cyber-accent 
              data-[state=active]:shadow-[0_0_5px_rgba(0,255,255,0.1)]
              data-[state=active]:border-cyber-accent/30
              data-[state=active]:before:content-['']
              data-[state=active]:before:absolute
              data-[state=active]:before:bottom-0
              data-[state=active]:before:left-0
              data-[state=active]:before:w-full
              data-[state=active]:before:h-[1px]
              data-[state=active]:before:bg-cyber-accent
              hover:bg-cyber-accent/10
              border border-cyber-accent/5
            `}
          >
            <div className="flex items-center justify-center space-x-1">
              <Clock size={12} className="text-cyber-accent" />
              <span className="text-xs font-medium">Overview</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="hashcat" 
            className={`
              relative px-2 py-1 rounded-md transition-all duration-200
              data-[state=active]:bg-cyber-accent/20 
              data-[state=active]:text-cyber-accent 
              data-[state=active]:shadow-[0_0_5px_rgba(0,255,255,0.1)]
              data-[state=active]:border-cyber-accent/30
              data-[state=active]:before:content-['']
              data-[state=active]:before:absolute
              data-[state=active]:before:bottom-0
              data-[state=active]:before:left-0
              data-[state=active]:before:w-full
              data-[state=active]:before:h-[1px]
              data-[state=active]:before:bg-cyber-accent
              hover:bg-cyber-accent/10
              border border-cyber-accent/5
            `}
          >
            <div className="flex items-center justify-center space-x-1">
              <Cpu size={12} className="text-cyber-accent" />
              <span className="text-xs font-medium">Hashcat GPU</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="attacks" 
            className={`
              relative px-2 py-1 rounded-md transition-all duration-200
              data-[state=active]:bg-cyber-accent/20 
              data-[state=active]:text-cyber-accent 
              data-[state=active]:shadow-[0_0_5px_rgba(0,255,255,0.1)]
              data-[state=active]:border-cyber-accent/30
              data-[state=active]:before:content-['']
              data-[state=active]:before:absolute
              data-[state=active]:before:bottom-0
              data-[state=active]:before:left-0
              data-[state=active]:before:w-full
              data-[state=active]:before:h-[1px]
              data-[state=active]:before:bg-cyber-accent
              hover:bg-cyber-accent/10
              border border-cyber-accent/5
            `}
          >
            <div className="flex items-center justify-center space-x-1">
              <Shield size={12} className="text-cyber-accent" />
              <span className="text-xs font-medium">Attack Types</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="lifespan" 
            className={`
              relative px-2 py-1 rounded-md transition-all duration-200
              data-[state=active]:bg-cyber-accent/20 
              data-[state=active]:text-cyber-accent 
              data-[state=active]:shadow-[0_0_5px_rgba(0,255,255,0.1)]
              data-[state=active]:border-cyber-accent/30
              data-[state=active]:before:content-['']
              data-[state=active]:before:absolute
              data-[state=active]:before:bottom-0
              data-[state=active]:before:left-0
              data-[state=active]:before:w-full
              data-[state=active]:before:h-[1px]
              data-[state=active]:before:bg-cyber-accent
              hover:bg-cyber-accent/10
              border border-cyber-accent/5
            `}
          >
            <div className="flex items-center justify-center space-x-1">
              <Calendar size={12} className="text-cyber-accent" />
              <span className="text-xs font-medium">Lifespan</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 border border-cyber-accent/10 rounded-lg p-3 bg-cyber-dark/20 backdrop-blur-sm">
          <TabsContent value="overview" className="space-y-3">
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Using a typical home computer:</p>
                <Clock size={16} className="text-cyber-accent" />
              </div>
              <p className="text-lg font-bold text-foreground">{crackTime.regular}</p>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Using a powerful GPU cluster:</p>
                <Cpu size={16} className="text-cyber-accent" />
              </div>
              <p className="text-lg font-bold text-foreground">{crackTime.fastComputer}</p>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Using a supercomputer:</p>
                <Server size={16} className="text-cyber-accent" />
              </div>
              <p className="text-lg font-bold text-foreground">{crackTime.superComputer}</p>
            </div>
            
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center space-x-2 mb-2">
                {attackType.icon}
                <h4 className="text-sm font-medium">{attackType.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{attackType.description}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="hashcat" className="space-y-3">
            <div className="text-sm text-muted-foreground mb-2">
              <p>Real-world password cracking times with Hashcat on different GPUs:</p>
            </div>
            
            {crackTime.hashcatResults?.gpus.map((gpu, gpuIndex) => (
              <div key={gpuIndex} className="bg-muted/30 p-3 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{gpu.name}</p>
                  <Cpu size={16} className="text-cyber-accent" />
                </div>
                
                {gpu.algorithms.map((algo, algoIndex) => (
                  <div key={algoIndex} className="flex justify-between items-center border-t border-border/20 pt-1">
                    <span className="text-sm">{algo.name}:</span>
                    <span className={`text-sm font-medium ${getTimeColor(formatHashcatTime(algo.timeInSeconds))}`}>
                      {formatHashcatTime(algo.timeInSeconds)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            
            <div className="text-xs text-muted-foreground mt-2 bg-muted/20 p-2 rounded">
              <p>Hashcat is the world's fastest password recovery tool, commonly used in security audits and by attackers.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="attacks" className="space-y-3">
            {crackTime.hashcatResults?.attackModes.map((attack, index) => (
              <div key={index} className="bg-muted/30 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {getAttackIcon(attack.icon)}
                    <p className="font-medium">{attack.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    attack.effectiveness === "Low" ? "bg-green-500/20 text-green-500" : 
                    attack.effectiveness === "Medium" ? "bg-yellow-500/20 text-yellow-500" : 
                    "bg-red-500/20 text-red-500"
                  }`}>
                    {attack.effectiveness}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">{attack.description}</p>
                
                <div className="flex justify-between items-center mt-2 pt-1 border-t border-border/20">
                  <span className="text-sm">Est. Time:</span>
                  <span className={`text-sm font-medium ${getTimeColor(attack.estimatedTime)}`}>
                    {attack.estimatedTime}
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="lifespan" className="space-y-3">
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-cyber-accent" />
                  <h4 className="font-medium">Password Lifespan Analysis</h4>
                </div>
                <div className={`px-2 py-1 rounded flex items-center space-x-1 ${lifespan.riskColor} bg-opacity-20`}>
                  {lifespan.icon}
                  <span className="text-sm">{lifespan.riskLevel} Risk</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border/30 pb-2">
                  <span className="text-sm text-muted-foreground">Recommended Change Interval:</span>
                  <span className={`font-bold ${lifespan.color}`}>{lifespan.timespan}</span>
                </div>

                <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{lifespan.description}</p>
              
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Security Recommendations:</h5>
                    <ul className="space-y-2">
                      {lifespan.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle size={14} className="mt-1 text-cyber-accent" />
                          <span>{rec}</span>
                  </li>
                      ))}
                </ul>
              </div>
              
              <div className="mt-4 pt-3 border-t border-border/30">
                    <h5 className="text-sm font-medium mb-2">Password Aging Guidelines</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/20 p-2 rounded">
                        <div className="text-xs text-muted-foreground">Very Weak</div>
                        <div className="text-strength-weak">Immediate Change</div>
                      </div>
                      <div className="bg-muted/20 p-2 rounded">
                        <div className="text-xs text-muted-foreground">Weak</div>
                        <div className="text-strength-weak">1 Month</div>
                      </div>
                      <div className="bg-muted/20 p-2 rounded">
                        <div className="text-xs text-muted-foreground">Medium</div>
                        <div className="text-strength-medium">3 Months</div>
                      </div>
                      <div className="bg-muted/20 p-2 rounded">
                        <div className="text-xs text-muted-foreground">Strong</div>
                        <div className="text-strength-good">6 Months</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield size={14} className="text-cyber-accent" />
                      <h5 className="text-sm font-medium">Why Regular Changes Matter</h5>
                    </div>
                    <ul className="space-y-2">
                      <li className="text-xs text-muted-foreground flex items-start space-x-2">
                        <span className="text-cyber-accent mt-1">•</span>
                        <span>Protects against undiscovered data breaches</span>
                      </li>
                      <li className="text-xs text-muted-foreground flex items-start space-x-2">
                        <span className="text-cyber-accent mt-1">•</span>
                        <span>Counters increasing computing power of attackers</span>
                      </li>
                      <li className="text-xs text-muted-foreground flex items-start space-x-2">
                        <span className="text-cyber-accent mt-1">•</span>
                        <span>Reduces risk from password reuse across services</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TimeToCrack;
