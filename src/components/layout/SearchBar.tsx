"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSearch?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
  onSearch,
}: SearchBarProps) {
  return (
    <div className={cn("flex items-center gap-2 rounded-full border border-border bg-white p-1 shadow-sm", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
          placeholder={placeholder}
          className="border-0 pl-9 shadow-none focus-visible:ring-0"
        />
      </div>
      <Button
        type="button"
        onClick={onSearch}
        className="shrink-0 rounded-full bg-[#1F3A66] font-bold hover:bg-[#152847]"
      >
        Buscar
      </Button>
    </div>
  );
}
