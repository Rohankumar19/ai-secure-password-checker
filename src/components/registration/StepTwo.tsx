import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PasswordInput from '@/components/PasswordInput';
import StrengthMeter from '@/components/StrengthMeter';
import PasswordFeedback from '@/components/password/PasswordFeedback';
import { UserData } from './RegistrationFlow';
import { 
  calculatePasswordStrength, 
  generateStrongPassword,
  checkAgainstPersonalData 
} from '@/utils/passwordUtils';

interface StepTwoProps {
  userData: UserData;
  onComplete: (password: string) => void;
  onBack: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ userData, onComplete, onBack }) => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [personalDataIssues, setPersonalDataIssues] = useState<string[]>([]);
  
  const formSchema = z.object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine(val => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter." })
      .refine(val => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter." })
      .refine(val => /[0-9]/.test(val), { message: "Password must contain at least one number." })
      .refine(val => /[^A-Za-z0-9]/.test(val), { message: "Password must contain at least one special character." })
      .refine(val => strength >= 70, { message: "Password is not strong enough. Try our suggestions." })
      .refine(val => personalDataIssues.length === 0, { 
        message: "Password contains personal information. Please choose a different password." 
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  useEffect(() => {
    if (password) {
      const calculatedStrength = calculatePasswordStrength(password);
      setStrength(calculatedStrength);
      
      const issues = checkAgainstPersonalData(password, userData);
      setPersonalDataIssues(issues);
      
      form.setValue("password", password);
      
      form.trigger("password");
    } else {
      setStrength(0);
      setPersonalDataIssues([]);
    }
  }, [password, userData, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onComplete(data.password);
  };

  const handleSuggestionSelect = (suggestedPassword: string) => {
    setPassword(suggestedPassword);
    setStrength(100);
    form.setValue("password", suggestedPassword);
    form.trigger("password");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Create Password</h2>
        <p className="text-sm text-muted-foreground">Step 2 of 3: Create a strong password</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput 
                    password={password} 
                    setPassword={setPassword}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <StrengthMeter strength={strength} />

          {password && (
            <PasswordFeedback 
              password={password}
              strength={strength}
              personalDataIssues={personalDataIssues}
              userData={userData}
              onSuggestionSelect={handleSuggestionSelect}
            />
          )}

          <div className="flex space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!form.formState.isValid}
            >
              Next Step <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StepTwo;
