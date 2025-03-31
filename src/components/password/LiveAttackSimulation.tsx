
import React, { useState, useEffect } from 'react';
import { Shield, Zap, Book, Table, AlertTriangle, Check, X, Database } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UserData } from '@/components/registration/RegistrationFlow';
import { simulateAttack } from '@/utils/passwordUtils';

interface LiveAttackSimulationProps {
  password: string;
  strength: number;
  userData: UserData;
}

type AttackStatus = 'idle' | 'running' | 'success' | 'failed';

interface AttackState {
  name: string;
  status: AttackStatus;
  progress: number;
  timeElapsed: number;
  estimatedTime: number;
  icon: React.ReactNode;
  attempts: number;
  attemptLimit: number;
  result?: string;
}

const LiveAttackSimulation: React.FC<LiveAttackSimulationProps> = ({
  password,
  strength,
  userData
}) => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [overallResult, setOverallResult] = useState<'cracked' | 'secure' | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  
  const [attacks, setAttacks] = useState<AttackState[]>([
    {
      name: 'Dictionary Attack',
      status: 'idle',
      progress: 0,
      timeElapsed: 0,
      estimatedTime: 10,
      icon: <Book size={18} className="text-cyber-accent" />,
      attempts: 0,
      attemptLimit: 100000,
    },
    {
      name: 'Brute Force Attack',
      status: 'idle',
      progress: 0,
      timeElapsed: 0,
      estimatedTime: 30,
      icon: <Zap size={18} className="text-cyber-accent" />,
      attempts: 0,
      attemptLimit: 500000,
    },
    {
      name: 'Rainbow Table Attack',
      status: 'idle',
      progress: 0,
      timeElapsed: 0,
      estimatedTime: 20,
      icon: <Table size={18} className="text-cyber-accent" />,
      attempts: 0,
      attemptLimit: 300000,
    }
  ]);

  // Start simulation when component mounts
  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [password]);

  // Update timer
  useEffect(() => {
    let timerId: number | null = null;
    
    if (simulationRunning) {
      timerId = window.setInterval(() => {
        const newElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(newElapsed);
        
        // Auto-stop after 120 seconds
        if (newElapsed >= 120) {
          stopSimulation();
          setOverallResult('secure');
          setSimulationComplete(true);
        }
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [simulationRunning, startTime]);

  // Simulate attack progress
  useEffect(() => {
    if (!simulationRunning) return;
    
    const intervalIds: number[] = [];
    
    attacks.forEach((attack, index) => {
      if (attack.status === 'running') {
        const updateInterval = window.setInterval(() => {
          const result = simulateAttack(password, userData, attack.name.toLowerCase(), strength);
          
          setAttacks(prevAttacks => {
            const newAttacks = [...prevAttacks];
            const currentAttack = {...newAttacks[index]};
            
            // Update progress based on time
            const progressPercentage = Math.min(100, (elapsedTime / currentAttack.estimatedTime) * 100);
            currentAttack.progress = progressPercentage;
            currentAttack.timeElapsed = elapsedTime;
            
            // Update attempts
            const attemptsPerSecond = currentAttack.attemptLimit / currentAttack.estimatedTime;
            currentAttack.attempts = Math.min(
              currentAttack.attemptLimit, 
              Math.floor(elapsedTime * attemptsPerSecond)
            );
            
            // Check if attack succeeded
            if (result.cracked) {
              currentAttack.status = 'success';
              currentAttack.result = result.method;
              setOverallResult('cracked');
              setSimulationComplete(true);
              stopSimulation();
            } 
            // Check if attack failed (reached 100%)
            else if (progressPercentage >= 100) {
              currentAttack.status = 'failed';
              currentAttack.progress = 100;
              
              // Check if all attacks have failed
              const allFailed = newAttacks.every(a => 
                a.status === 'failed' || (a.name === currentAttack.name && progressPercentage >= 100)
              );
              
              if (allFailed) {
                setOverallResult('secure');
                setSimulationComplete(true);
                stopSimulation();
              }
            }
            
            newAttacks[index] = currentAttack;
            return newAttacks;
          });
        }, 250);
        
        intervalIds.push(updateInterval);
      }
    });
    
    return () => {
      intervalIds.forEach(id => clearInterval(id));
    };
  }, [simulationRunning, attacks, elapsedTime, password, userData, strength]);

  const startSimulation = () => {
    setSimulationRunning(true);
    setSimulationComplete(false);
    setOverallResult(null);
    setElapsedTime(0);
    setStartTime(Date.now());
    
    // Start attacks in sequence based on password strength
    setAttacks(prevAttacks => {
      return prevAttacks.map((attack, index) => {
        // Adjust timing based on password strength
        const strengthMultiplier = strength / 50;
        const adjustedTime = Math.max(5, Math.round(attack.estimatedTime * strengthMultiplier));
        
        return {
          ...attack,
          status: index === 0 ? 'running' : 'idle',
          progress: 0,
          timeElapsed: 0,
          estimatedTime: adjustedTime,
          attempts: 0,
        };
      });
    });
  };

  const stopSimulation = () => {
    setSimulationRunning(false);
  };

  // Start next attack when current one finishes
  useEffect(() => {
    if (!simulationRunning) return;
    
    const runningAttackIndex = attacks.findIndex(a => a.status === 'running');
    const nextAttackIndex = attacks.findIndex((a, i) => i > runningAttackIndex && a.status === 'idle');
    
    if (runningAttackIndex === -1 && nextAttackIndex !== -1) {
      setAttacks(prevAttacks => {
        const newAttacks = [...prevAttacks];
        newAttacks[nextAttackIndex] = {
          ...newAttacks[nextAttackIndex],
          status: 'running',
        };
        return newAttacks;
      });
    }
  }, [attacks, simulationRunning]);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-cyber-accent" />
          <h3 className="text-lg font-medium">Live Attack Simulation</h3>
        </div>
        <div className="text-sm font-mono">
          Time: {elapsedTime}s
        </div>
      </div>
      
      {simulationComplete && (
        <Alert variant={overallResult === 'cracked' ? "destructive" : "default"} className="mb-4">
          <AlertTitle className="flex items-center gap-2">
            {overallResult === 'cracked' ? (
              <>
                <AlertTriangle className="h-4 w-4" />
                Password Cracked!
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Password Secure
              </>
            )}
          </AlertTitle>
          <AlertDescription>
            {overallResult === 'cracked' 
              ? "Your password was successfully cracked by our simulation. Consider using a stronger password."
              : "Congratulations! Your password withstood all our attack simulations and is considered secure."
            }
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        {attacks.map((attack, index) => (
          <div key={index} className="border rounded-md p-3 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {attack.icon}
                <span className="font-medium">{attack.name}</span>
              </div>
              <div className="flex items-center">
                {attack.status === 'running' && (
                  <span className="text-xs bg-cyber-accent/20 text-cyber-accent px-2 py-0.5 rounded-full animate-pulse">
                    Running
                  </span>
                )}
                {attack.status === 'success' && (
                  <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">
                    Cracked
                  </span>
                )}
                {attack.status === 'failed' && (
                  <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                    Failed
                  </span>
                )}
                {attack.status === 'idle' && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    Waiting
                  </span>
                )}
              </div>
            </div>
            
            <div className="mb-2">
              <Progress 
                value={attack.progress} 
                className={`h-2 ${
                  attack.status === 'success' ? 'bg-red-500/20' : 
                  attack.status === 'failed' ? 'bg-green-500/20' : 
                  'bg-muted'
                }`}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Database size={12} />
                <span>Attempts: {formatNumber(attack.attempts)}</span>
              </div>
              
              {attack.status === 'success' && attack.result && (
                <div className="text-red-500 font-medium">
                  {attack.result}
                </div>
              )}
            </div>
            
            {attack.status === 'success' && (
              <div className="mt-2 text-sm flex items-start gap-2 p-2 bg-red-500/10 rounded">
                <X size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-500">Found match:</p>
                  <p className="text-muted-foreground">
                    {attack.name === 'Dictionary Attack' 
                      ? 'Your password was found in a common password list or dictionary.'
                      : attack.name === 'Brute Force Attack'
                      ? 'Your password was cracked by systematically trying combinations with your personal data.'
                      : 'Your password hash pattern was reverse-engineered using precomputed tables.'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {simulationComplete && overallResult === 'secure' && (
        <div className="mt-2 text-sm flex items-start gap-2 p-2 bg-green-500/10 rounded">
          <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Password Analysis:</p>
            <p className="text-muted-foreground">
              Your password successfully resisted all attack types in our simulation,
              which suggests it would be difficult for real attackers to crack within a reasonable timeframe.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveAttackSimulation;
