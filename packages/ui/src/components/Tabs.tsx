import type { ComponentProps, ReactNode } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export interface TabsProps {
  items: { id: string; label: ReactNode }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
  children?: ReactNode;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: TabsProps) {
  return (
    <TabsPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <TabsPrimitive.List
        className={cn(
          "flex items-end gap-1 overflow-x-auto border-b-0",
          className,
        )}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.id}
            value={item.id}
            className={cn(
              "-mb-0.5 cursor-pointer rounded-t-lg border-2 border-b-0 border-transparent px-4 py-2 font-display text-sm font-bold tracking-tight text-fg-mute transition-colors duration-100 hover:text-fg",
              "data-[state=active]:squiggle data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-pop-xs data-[state=active]:border-line",
            )}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {children}
    </TabsPrimitive.Root>
  );
}

export interface TabPanelProps extends ComponentProps<"div"> {
  value: string;
}

export function TabPanel({ value, className, ...props }: TabPanelProps) {
  return (
    <TabsPrimitive.Content
      value={value}
      className={cn(
        "rounded-b-cutout border-2 border-line bg-surface p-6 shadow-pop",
        className,
      )}
      {...props}
    />
  );
}
