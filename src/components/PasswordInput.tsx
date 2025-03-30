
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ password, setPassword, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={password}
        onChange={handleChange}
        className="pr-10 bg-cyber-dark/50 border-cyber-primary/30 focus:border-cyber-primary/70 transition-all"
      />
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </Button>
    </div>
  );
};

export default PasswordInput;
