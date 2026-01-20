export interface FileContextType {
    originalData: any[][];
    tableData: any[][];
    setTableData: (data: any[][]) => void;
    processFile: (file: File) => Promise<void>;
    resetData: () => Promise<void>;
    isLoadingStorage: boolean;
}