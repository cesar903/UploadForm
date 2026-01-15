"use client";

import React, { createContext, useContext, useState } from 'react';
import * as XLSX from 'xlsx';

interface FileContextType {
    originalData: any[][];
    tableData: any[][];
    setTableData: (data: any[][]) => void;
    processFile: (file: File) => Promise<void>;
    resetData: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
    const [originalData, setOriginalData] = useState<any[][]>([]);
    const [tableData, setTableData] = useState<any[][]>([]);

    const processFile = (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    const rawData = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                        defval: "",
                        blankrows: false
                    }) as any[][];

                    if (rawData.length === 0) {
                        setOriginalData([]);
                        setTableData([]);
                        return resolve();
                    }

                    const validColumnIndices = rawData[0].reduce((acc: number[], _, index) => {
                        const hasDataInColumn = rawData.some(row =>
                            row[index] !== undefined && row[index] !== null && String(row[index]).trim() !== ""
                        );
                        if (hasDataInColumn) acc.push(index);
                        return acc;
                    }, []);

                    const cleanedData = rawData
                        .map(row => validColumnIndices.map(index => row[index]))
                        .filter(row => row.some(cell => String(cell).trim() !== ""));

                    setOriginalData(JSON.parse(JSON.stringify(cleanedData)));
                    setTableData(cleanedData);

                    resolve();
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsBinaryString(file);
        });
    };

    const resetData = () => {
        setOriginalData([]);
        setTableData([]);
    };

    return (
        <FileContext.Provider value={{
            originalData,
            tableData,
            setTableData,
            processFile,
            resetData
        }}>
            {children}
        </FileContext.Provider>
    );
}

export const useFile = () => {
    const context = useContext(FileContext);
    if (!context) throw new Error("useFile must be used within FileProvider");
    return context;
};