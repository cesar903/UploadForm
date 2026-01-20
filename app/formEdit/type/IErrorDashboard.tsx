export interface ValidationError {
  rowIndex: number;
  message: string;
  type: 'error' | 'warning';
}

export interface ErrorDashboardProps {
  validationErrors: ValidationError[];
  showAllErrors: boolean;
  setShowAllErrors: (val: boolean) => void;
  scrollToError: (index: number) => void;
}