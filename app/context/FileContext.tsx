"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { get, set, del } from 'idb-keyval';

import { FileContextType } from './types/IFileContext';

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
    const [originalData, setOriginalData] = useState<any[][]>([]);
    const [tableData, setTableData] = useState<any[][]>([]);
    const [isLoadingStorage, setIsLoadingStorage] = useState(true);

    useEffect(() => {
        async function loadPersistedData() {
            try {
                const savedOriginal = await get('app_original_data');
                const savedTable = await get('app_table_data');

                if (savedOriginal) setOriginalData(savedOriginal);
                if (savedTable) setTableData(savedTable);
            } catch (error) {
                console.error("Erro ao carregar do IndexedDB:", error);
            } finally {
                setIsLoadingStorage(false);
            }
        }
        loadPersistedData();
    }, []);

    useEffect(() => {
        if (!isLoadingStorage) {
            if (originalData.length > 0) set('app_original_data', originalData);
            if (tableData.length > 0) set('app_table_data', tableData);
        }
    }, [originalData, tableData, isLoadingStorage]);

    const processFile = (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
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
                        await resetData();
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

                    const clonedOriginal = JSON.parse(JSON.stringify(cleanedData));

                    setOriginalData(clonedOriginal);
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

    const resetData = async () => {
        setOriginalData([]);
        setTableData([]);
        await del('app_original_data');
        await del('app_table_data');
    };

    return (
        <FileContext.Provider value={{
            originalData,
            tableData,
            setTableData,
            processFile,
            resetData,
            isLoadingStorage
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