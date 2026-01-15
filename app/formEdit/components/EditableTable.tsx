"use client";

import React, { useRef, useMemo } from 'react';
import { useFile } from "@/app/context/FileContext";
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { HyperFormula } from 'hyperformula';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import 'handsontable/dist/handsontable.full.min.css';

registerAllModules();

export default function EditableTable() {
    const hotTableComponent = useRef<HotTable>(null);
    const { originalData, tableData, setTableData } = useFile();
    const router = useRouter();

    const currentHeaders = useMemo(() => {
        return originalData.length > 0 ? originalData[0] : (tableData[0] || []);
    }, [originalData, tableData]);

    const bodyData = useMemo(() => {
        if (!tableData || tableData.length === 0) return [];

        const firstRow = tableData[1];
        const isDiffMode = firstRow && !Array.isArray(firstRow) && typeof firstRow === 'object';

        if (isDiffMode) {
            return originalData.slice(1);
        }
        return tableData.slice(1);
    }, [tableData, originalData]);

    const handleConfirm = () => {
        const hotInstance = hotTableComponent.current?.hotInstance;
        if (!hotInstance || !originalData || originalData.length === 0) return;

        const updatedBody = hotInstance.getData();
        const headers = originalData[0];
        const originalBody = originalData.slice(1);

        const diffData = updatedBody.map((row, rowIndex) => {
            const originalRow = originalBody[rowIndex] || headers.map(() => "");

            if (JSON.stringify(row) === JSON.stringify(originalRow)) return null;

            const rowDiff: Record<string, any> = {
                _originalIndex: rowIndex
            };

            headers.forEach((header: string, colIndex: number) => {
                rowDiff[header] = {
                    old: originalRow[colIndex],
                    new: row[colIndex]
                };
            });
            return rowDiff;
        }).filter(Boolean);

        setTableData(diffData as any);
        router.push("/formConfirm");
    };

    const handleReset = () => {
        setTableData(JSON.parse(JSON.stringify(originalData)));
    };



    return (
        <div className="w-full max-w-6xl p-6 bg-card text-card-foreground rounded-xl shadow-sm border border-border transition-colors duration-300">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Editar dados enviados</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Revise e edite seus dados antes de confirmar. Todas as células são editáveis.
                    </p>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-destructive hover:border-destructive transition-all w-full sm:w-auto"
                        >
                            <RotateCcw size={16} />
                            Resetar Tabela
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente todas as
                                edições feitas nesta tabela e restaurará os dados originais do arquivo.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="mt-0">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleReset}
                                className="bg-destructive text-white hover:bg-destructive/90"
                            >
                                Confirmar Reset
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="rounded-lg border border-border overflow-hidden shadow-sm">
                {tableData.length > 0 ? (
                    <div className="custom-hot-wrapper">
                        <HotTable
                            colHeaders={currentHeaders}
                            key={currentHeaders.join(',')}
                            ref={hotTableComponent}
                            data={bodyData}
                            rowHeaders={true}
                            height="450px"
                            width="100%"
                            licenseKey="non-commercial-and-evaluation"
                            formulas={{ engine: HyperFormula }}
                            stretchH="all"
                            contextMenu={true}
                            className="custom-hot-table"
                            autoColumnSize={true}
                            manualColumnResize={true}
                            manualRowResize={true}
                            fillHandle={true}
                            selectionMode="multiple"
                            outsideClickDeselects={false}
                            copyPaste={true}
                        />
                    </div>
                ) : (
                    <div className="p-10 md:p-20 text-center text-muted-foreground bg-muted/30">
                        Nenhum dado encontrado. Verifique o formato do arquivo.
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-sm text-muted-foreground font-medium text-center md:text-left">
                    <span className="text-foreground font-bold">{bodyData.length}</span> linhas prontas para upload
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                        variant="action"
                        asChild
                        className="w-full sm:w-auto justify-center"
                    >
                        <a href="/formsUpload">Retornar</a>
                    </Button>

                    <Button
                        variant="default"
                        className="px-8 font-semibold shadow-md w-full sm:w-auto justify-center"
                        onClick={handleConfirm}
                    >
                        Confirmar upload
                    </Button>
                </div>
            </div>

            <style jsx global>{`
                
                body:has([data-slot="alert-dialog-content"]) .custom-hot-wrapper {
                    filter: blur(4px);
                    transition: filter 0.2s ease;
                }
                
                .custom-hot-table th {
                    background-color: var(--muted) !important; 
                    color: var(--muted-foreground) !important;
                    font-size: 12px !important;
                    text-transform: uppercase !important;
                    border-color: var(--border) !important;
                }

                .custom-hot-table td {
                    background-color: var(--card) !important;
                    color: var(--foreground) !important;
                    font-size: 14px !important;
                    border-color: var(--border) !important;
                }

                .custom-hot-table .wtBorder.current {
                    background-color: var(--primary) !important; 
                }

                .custom-hot-table .rowHeader {
                    color: var(--muted-foreground) !important;
                    border-right-color: var(--border) !important;
                }

                .custom-hot-table tbody tr:hover td {
                    background-color: var(--accent) !important;
                }

                .handsontable .relative {
                    padding: 3px !important;
                }
                .handsontable th, .handsontable td {
                    position: relative;
                }
                @media (max-width: 640px) {
                .handsontable .relative {
                    padding: 1px !important;
                }
            }
            `}</style>
        </div>
    );
}