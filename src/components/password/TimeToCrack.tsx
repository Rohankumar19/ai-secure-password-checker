
import React, { useState } from 'react';
import { Clock, Cpu, Server, Zap, Shield, Lock, Book, Table } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Clock size={20} className="text-cyber-accent" />
        <h3 className="text-base font-medium">Time to Crack Simulation</h3>
      </div>
      
      {/* Visual representation */}
      {getTimeVisual()}
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-3'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hashcat">Hashcat GPU</TabsTrigger>
          <TabsTrigger value="attacks">Attack Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-3 mt-2">
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
        
        <TabsContent value="hashcat" className="space-y-3 mt-2">
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
        
        <TabsContent value="attacks" className="space-y-3 mt-2">
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
      </Tabs>
    </div>
  );
};

export default TimeToCrack;
