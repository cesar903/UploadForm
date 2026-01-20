export interface LogItem {
  id: string;
  status: "success" | "error";
  date: string;
  user: string;
  records: number;
  file: string;
  errorMessage?: string;
}

export interface ModalDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  log: LogItem | null;
}