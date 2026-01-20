export type TabMode = "forms" | "logs";
export type ViewMode = "grid" | "list";

export interface TopTabsProps {
  onSelect: (tab: TabMode) => void;
  onViewChange: (mode: ViewMode) => void;
}