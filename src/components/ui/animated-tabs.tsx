
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

export const AnimatedTabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  defaultTab,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  defaultTab?: string;
}) => {
  const [active, setActive] = useState<Tab>(() => {
    if (defaultTab) {
      const defaultTabIndex = propTabs.findIndex(tab => tab.value === defaultTab);
      return defaultTabIndex !== -1 ? propTabs[defaultTabIndex] : propTabs[0];
    }
    return propTabs[0];
  });
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  const moveSelectedTabToTop = (idx: number) => {
    setActive(propTabs[idx]);
  };

  const [hovering, setHovering] = useState(false);

  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={cn(
          "flex flex-row items-center justify-start relative overflow-hidden max-w-full w-full bg-cyber-dark rounded-t-xl px-2 py-1",
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn("relative px-4 py-2 rounded-full text-sm", tabClassName)}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-cyber-primary rounded-full",
                  activeTabClassName
                )}
              />
            )}

            <span className="relative block text-foreground">
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden rounded-b-xl bg-cyber-dark">
        <FadeInDiv
          tabs={propTabs}
          active={active}
          key={active.value}
          hovering={hovering}
          className={contentClassName}
        />
      </div>
    </div>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  active,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {tabs.map((tab) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: tab.value === active.value ? 1 : 0,
            zIndex: tab.value === active.value ? 10 : -10,
          }}
          transition={{ duration: 0.25 }}
          className={cn("w-full h-full absolute top-0 left-0 p-3", className)}
        >
          {tab.value === active.value && tab.content}
        </motion.div>
      ))}
    </div>
  );
};
