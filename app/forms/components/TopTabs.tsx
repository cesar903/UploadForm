"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopTabsProps, TabMode, ViewMode } from "../types/ITopTabs";

export function TopTabs({ onSelect, onViewChange }: TopTabsProps) {
  const [active, setActive] = useState<TabMode>("forms");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleTabClick = (tab: TabMode) => {
    setActive(tab);
    onSelect(tab);
  };

  const handleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    onViewChange(mode);
  };

  return (
    <div className="flex items-center justify-between w-full mb-6 gap-4">
      <div className="flex items-center gap-2 p-1.5">
        <Button
          id="step-forms-tab"
          variant="tab"
          isActive={active === "forms"}
          onClick={() => handleTabClick("forms")}
        >
          Formulários
        </Button>
          <Button
            variant="tab"
            isActive={active === "logs"}
            onClick={() => handleTabClick("logs")}
            id="step-history-tab"
          >
            Histórico
          </Button>

      </div>

      <div className="flex items-center gap-3">
        <div id="step-view-mode" className="flex items-center bg-muted/50 p-1 rounded-md border border-border">
          <button
            onClick={() => handleViewMode("grid")}
            title="Visualização em Grade"
            className={cn(
              "p-1.5 rounded-sm transition-all duration-200 mr-1",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutGrid size={18} />
          </button>

          <button
            onClick={() => handleViewMode("list")}
            title="Visualização em Lista"
            className={cn(
              "p-1.5 rounded-sm transition-all duration-200",
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}