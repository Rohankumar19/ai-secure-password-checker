import React, { useState } from 'react';
import { Clock, Cpu, Server, Zap, Shield, Lock, Book, Table, Calendar } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

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
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  
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

  // Calculate password lifespan based on strength
  const getLifespanRecommendation = () => {
    if (strength < 30) {
      return {
        timespan: "Immediate",
        description: "Change immediately! This password is severely compromised.",
        color: "text-strength-weak"
      };
    } else if (strength < 50) {
      return {
        timespan: "1 month",
        description: "Weak passwords should be changed very frequently.",
        color: "text-strength-weak"
      };
    } else if (strength < 70) {
      return {
        timespan: "3 months",
        description: "Medium-strength passwords need regular updates.",
        color: "text-strength-medium"
      };
    } else if (strength < 85) {
      return {
        timespan: "6 months",
        description: "Strong passwords still benefit from semi-annual changes.",
        color: "text-strength-good"
      };
    } else if (strength < 95) {
      return {
        timespan: "12 months",
        description: "Very strong passwords can last longer, but annual changes are still good practice.",
        color: "text-strength-strong"
      };
    } else {
      return {
        timespan: "24 months",
        description: "Extremely strong passwords can last longer, but regular changes are still recommended.",
        color: "text-strength-strong"
      };
    }
  };

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
  const lifespan = getLifespanRecommendation();

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
          <p className="ml-2 text-xs text-strength-strong">Would take centuries or more</p>
        </div>
      );
    }
  };

  // Format hashcat time results with appropriate units
  const formatHashcatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds === Infinity) return "Undefinable";
    if (seconds < 1) return "Instantly";
    
    // More granular time formatting
    if (seconds < 60) {
      return `${Math.round(seconds)} seconds`;
    }
    if (seconds < 3600) {
      const minutes = Math.round(seconds / 60);
      if (minutes < 60) return `${minutes} minutes`;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours} hours ${remainingMinutes} minutes` : `${hours} hours`;
    }
    if (seconds < 86400) {
      const hours = Math.round(seconds / 3600);
      if (hours < 24) return `${hours} hours`;
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return remainingHours > 0 ? `${days} days ${remainingHours} hours` : `${days} days`;
    }
    if (seconds < 31536000) {
      const days = Math.round(seconds / 86400);
      if (days < 30) return `${days} days`;
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return remainingDays > 0 ? `${months} months ${remainingDays} days` : `${months} months`;
    }
    if (seconds < 31536000 * 100) {
      const years = Math.round(seconds / 31536000);
      if (years < 100) return `${years} years`;
      return `${years} years`;
    }
    if (seconds < 31536000 * 1000) {
      const centuries = Math.round(seconds / (31536000 * 100));
      return `${centuries} centuries`;
    }
    if (seconds < 31536000 * 1000000) {
      return "Millions of years";
    }
    return "Billions of years";
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

  // Format crack time with appropriate units and handling for very short times
  const formatCrackTime = (timeString: string) => {
    if (!timeString) return "Instantly";
    
    // Handle numeric values
    const numericMatch = timeString.match(/(\d+)/);
    if (numericMatch) {
      const seconds = parseInt(numericMatch[1]);
      if (seconds === 0) return "Instantly";
      if (seconds < 60) return `${seconds} seconds`;
      return formatHashcatTime(seconds);
    }
    
    // Handle specific text cases
    const lowerTime = timeString.toLowerCase();
    if (lowerTime.includes("0 seconds") || lowerTime.includes("instant")) return "Instantly";
    if (lowerTime.includes("less than")) return "Less than a minute";
    
    // Dictionary attacks might be ineffective against strong passwords
    if (lowerTime.includes("undefined") || lowerTime === "undefined") {
      if (strength > 95) return "Undefinable (Not Crackable)";
      return "Undefinable";
    }
    
    // Handle existing formatted times
    if (lowerTime.includes("seconds")) return timeString;
    if (lowerTime.includes("minutes")) return timeString;
    if (lowerTime.includes("hours")) return timeString;
    if (lowerTime.includes("days")) return timeString;
    if (lowerTime.includes("months")) return timeString;
    if (lowerTime.includes("years")) return timeString;
    if (lowerTime.includes("centuries")) return timeString;
    if (lowerTime.includes("millions")) return timeString;
    if (lowerTime.includes("billions")) return timeString;
    
    return timeString;
  };

  // Determine color based on time to crack
  const getTimeColor = (timeString: string) => {
    const formattedTime = formatCrackTime(timeString);
    const lowerTime = formattedTime.toLowerCase();
    
    if (lowerTime.includes("undefinable")) 
      return "text-strength-strong";
    if (lowerTime === "instantly" || lowerTime.includes("seconds") || lowerTime.includes("less than"))
      return "text-strength-weak";
    if (lowerTime.includes("minutes") || lowerTime.includes("hours"))
      return "text-strength-medium";
    if (lowerTime.includes("days") || lowerTime.includes("months"))
      return "text-strength-good";
    if (lowerTime.includes("years") || lowerTime.includes("centuries") || lowerTime.includes("billions"))
      return "text-strength-strong";
    return "text-strength-strong";
  };

  // Custom handler for tab changes to prevent form submission
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    // Prevent event propagation to avoid triggering form submission
    event?.stopPropagation();
    event?.preventDefault();
  };

  // Prepare tabs for the animated tabs component
  const crackTimeTabs = [
    {
      title: "Overview",
      value: "overview",
      content: (
        <div className="h-full bg-cyber-dark rounded-xl">
          <div className="p-3 space-y-3">
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Using a typical home computer:</p>
                <Clock size={16} className="text-cyber-accent" />
              </div>
              <p className={`text-lg font-bold ${getTimeColor(crackTime.regular)}`}>
                {formatCrackTime(crackTime.regular)}
              </p>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Using a powerful GPU cluster:</p>
                <Cpu size={16} className="text-cyber-accent" />
              </div>
              <p className={`text-lg font-bold ${getTimeColor(crackTime.fastComputer)}`}>
                {formatCrackTime(crackTime.fastComputer)}
              </p>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Using a supercomputer:</p>
                <Server size={16} className="text-cyber-accent" />
              </div>
              <p className={`text-lg font-bold ${getTimeColor(crackTime.superComputer)}`}>
                {formatCrackTime(crackTime.superComputer)}
              </p>
            </div>
            
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center space-x-2 mb-2">
                {attackType.icon}
                <h4 className="text-sm font-medium">{attackType.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{attackType.description}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Hashcat GPU",
      value: "hashcat",
      content: (
        <div className="h-full bg-cyber-dark rounded-xl">
          <div className="p-3 space-y-3 overflow-y-auto max-h-[280px]">
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
          </div>
        </div>
      ),
    },
    {
      title: "Attack Types",
      value: "attacks",
      content: (
        <div className="h-full bg-cyber-dark rounded-xl">
          <div className="p-3 space-y-3 overflow-y-auto max-h-[280px]">
            {crackTime.hashcatResults?.attackModes.map((attack, index) => {
              // For dictionary attacks on strong passwords, show "Undefinable"
              let estimatedTime = attack.estimatedTime;
              if (attack.name === "Dictionary Attack" && strength > 90) {
                estimatedTime = "Undefinable (Not Crackable)";
              }
              
              return (
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
                    <span className={`text-sm font-medium ${getTimeColor(estimatedTime)}`}>
                      {formatCrackTime(estimatedTime)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Lifespan",
      value: "lifespan",
      content: (
        <div className="h-full bg-cyber-dark rounded-xl">
          <div className="p-3 space-y-3 overflow-y-auto max-h-[280px]">
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-cyber-accent" />
                  <h4 className="text-sm font-medium">Recommended Password Lifespan</h4>
                </div>
                <span className={`text-sm font-bold ${lifespan.color}`}>
                  {lifespan.timespan}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">{lifespan.description}</p>
              
              <div className="mt-4 pt-3 border-t border-border/30">
                <h5 className="text-xs font-medium mb-2">Why passwords expire:</h5>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="text-cyber-accent mt-0.5">•</span>
                    <span>Technological advances make older passwords more vulnerable over time</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-cyber-accent mt-0.5">•</span>
                    <span>Undiscovered data breaches might have exposed your password</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-cyber-accent mt-0.5">•</span>
                    <span>Attackers gain more computing power and better cracking techniques</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-4 pt-3 border-t border-border/30">
                <div className="flex space-x-2 items-center">
                  <Shield size={16} className="text-cyber-accent" />
                  <h5 className="text-xs font-medium">Password Aging Policy</h5>
                </div>
                <table className="w-full mt-2 text-xs">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left pb-1">Strength</th>
                      <th className="text-right pb-1">Change After</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/10">
                      <td className="py-1 text-strength-weak">Very Weak</td>
                      <td className="text-right">Immediately</td>
                    </tr>
                    <tr className="border-b border-border/10">
                      <td className="py-1 text-strength-weak">Weak</td>
                      <td className="text-right">1 month</td>
                    </tr>
                    <tr className="border-b border-border/10">
                      <td className="py-1 text-strength-medium">Medium</td>
                      <td className="text-right">3 months</td>
                    </tr>
                    <tr className="border-b border-border/10">
                      <td className="py-1 text-strength-good">Strong</td>
                      <td className="text-right">6 months</td>
                    </tr>
                    <tr className="border-b border-border/10">
                      <td className="py-1 text-strength-strong">Very Strong</td>
                      <td className="text-right">12 months</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-strength-strong">Perfect</td>
                      <td className="text-right">24 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Clock size={20} className="text-cyber-accent" />
        <h3 className="text-base font-medium">Time to Crack Simulation</h3>
      </div>
      
      {/* Visual representation */}
      {getTimeVisual()}
      
      <div className="h-[420px] relative border border-cyber-primary/20 rounded-xl shadow-lg overflow-hidden">
        <AnimatedTabs 
          tabs={crackTimeTabs} 
          defaultTab="overview"
        />
      </div>
    </div>
  );
};

export default TimeToCrack;
