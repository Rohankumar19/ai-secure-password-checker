
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserData } from './RegistrationFlow';
import { ChevronRight } from 'lucide-react';

interface StepOneProps {
  userData: Omit<UserData, 'password'>;
  onComplete: (data: Omit<UserData, 'password'>) => void;
}

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  dateOfBirth: z.string().refine(value => {
    const date = new Date(value);
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return !isNaN(date.getTime()) && date <= eighteenYearsAgo;
  }, { message: "You must be at least 18 years old." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const StepOne: React.FC<StepOneProps> = ({ userData, onComplete }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      email: userData.email,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onComplete(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Personal Information</h2>
        <p className="text-sm text-muted-foreground">Step 1 of 3: Enter your personal details</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" max={new Date().toISOString().split('T')[0]} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-6">
            Next Step <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StepOne;
