export interface LogsProps {
  viewMode: "grid" | "list";
  data: LogItem[];
}


export interface LogItem {
  id: string;
  file: string;
  date: string;
  status: "success" | "error";
  records: number;
  errorMessage?: string;
  user: string;
}