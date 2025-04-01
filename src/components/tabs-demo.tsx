
import React from "react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Cpu, Clock, Shield, Table } from "lucide-react";

export default function TabsDemo() {
  const tabs = [
    {
      title: "Overview",
      value: "overview",
      content: (
        <div className="w-full h-full rounded-xl bg-cyber-primary">
          <div className="p-4 text-lg font-medium text-white">
            <p>Overview of password strength</p>
            <div className="mt-4 text-sm font-normal">
              <p>Your password would take approximately:</p>
              <p className="text-xl font-bold mt-2">3 years to crack</p>
              <p className="mt-4 text-xs opacity-80">Using standard computing resources</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Hashcat",
      value: "hashcat",
      content: (
        <div className="w-full h-full rounded-xl bg-cyber-primary">
          <div className="p-4 text-lg font-medium text-white">
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={20} />
              <p>Hashcat GPU Analysis</p>
            </div>
            <div className="mt-2 text-sm font-normal">
              <p>Using professional password cracking hardware:</p>
              <p className="text-xl font-bold mt-2">4 months to crack</p>
              <p className="mt-4 text-xs opacity-80">Based on RTX 3090 performance metrics</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Attack Types",
      value: "attacks",
      content: (
        <div className="w-full h-full rounded-xl bg-cyber-primary">
          <div className="p-4 text-lg font-medium text-white">
            <div className="flex items-center gap-2 mb-4">
              <Table size={20} />
              <p>Common Attack Vectors</p>
            </div>
            <div className="mt-2 text-sm font-normal">
              <p>Most vulnerable to:</p>
              <p className="text-xl font-bold mt-2">Dictionary Attack</p>
              <p className="mt-4 text-xs opacity-80">Your password contains common words or patterns</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Lifespan",
      value: "lifespan",
      content: (
        <div className="w-full h-full rounded-xl bg-cyber-primary">
          <div className="p-4 text-lg font-medium text-white">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} />
              <p>Password Lifespan</p>
            </div>
            <div className="mt-2 text-sm font-normal">
              <p>Recommended time before changing:</p>
              <p className="text-xl font-bold mt-2">6 months</p>
              <p className="mt-4 text-xs opacity-80">Based on current strength and best practices</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[320px] relative max-w-3xl mx-auto w-full my-10 border border-cyber-primary/20 rounded-xl shadow-lg overflow-hidden">
      <AnimatedTabs tabs={tabs} />
    </div>
  );
}
