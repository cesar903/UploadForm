"use client";

import React, { useRef, useMemo, useState } from 'react';
import { useFile } from "@/app/context/FileContext";
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { HyperFormula } from 'hyperformula';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ErrorDashboard } from './ErrorDashboard'; // <-- Importe aqui
import { tableStyles } from '../style/styles'
import 'handsontable/dist/handsontable.full.min.css';
import { textRenderer } from 'handsontable/renderers/textRenderer';
import { cn } from '@/lib/utils';

registerAllModules();

export default function EditableTable() {
    const hotTableComponent = useRef<HotTable>(null);
    const { originalData, tableData, setTableData, isLoadingStorage } = useFile();
    const [isNavigating, setIsNavigating] = useState(false);
    const router = useRouter();
    const [showAllErrors, setShowAllErrors] = useState(false);

    const currentHeaders = useMemo(() => {
        return originalData.length > 0 ? originalData[0] : (tableData[0] || []);
    }, [originalData, tableData]);

    const bodyData = useMemo(() => {
        if (!tableData || tableData.length === 0) return [];
        if (isNavigating && hotTableComponent.current) {
            const currentData = hotTableComponent.current.hotInstance?.getData();
            if (currentData) return currentData;
        }
        const firstRow = tableData[1];
        const isDiffMode = firstRow && !Array.isArray(firstRow) && typeof firstRow === 'object';
        return isDiffMode ? originalData.slice(1) : tableData.slice(1);
    }, [tableData, originalData, isNavigating]);

    const { validationErrors, duplicateIndices } = useMemo(() => {
        const emailColIndex = currentHeaders.findIndex(h => h?.toUpperCase().trim() === "EMAIL");
        const idColIndex = currentHeaders.findIndex(h => h?.toUpperCase().trim() === "ID");
        if (emailColIndex === -1 && idColIndex === -1) return { validationErrors: [], duplicateIndices: new Set() };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailMap = new Map<string, number[]>();
        const dupSet = new Set<number>();
        const rowErrorsMap: Record<number, { messages: string[], type: 'error' | 'warning' }> = {};

        const addError = (rowIndex: number, message: string, type: 'error' | 'warning') => {
            if (!rowErrorsMap[rowIndex]) rowErrorsMap[rowIndex] = { messages: [], type: 'warning' };
            rowErrorsMap[rowIndex].messages.push(message);
            if (type === 'error') rowErrorsMap[rowIndex].type = 'error';
        };

        bodyData.forEach((row, index) => {
            const emailValue = String(row[emailColIndex] || "").trim().toLowerCase();
            if (emailColIndex !== -1 && emailValue !== "") {
                if (!emailRegex.test(emailValue)) addError(index, `E-mail com formato inválido: "${emailValue}"`, 'error');
                if (!emailMap.has(emailValue)) emailMap.set(emailValue, [index]);
                else emailMap.get(emailValue)?.push(index);
            }
            if (idColIndex !== -1) {
                const currentValue = String(row[idColIndex] || "").trim();
                const originalValue = String(originalData[index + 1]?.[idColIndex] || "").trim();
                if (currentValue !== "" && currentValue !== originalValue) addError(index, `ID alterado (Original era: ${originalValue})`, 'warning');
            }
        });

        emailMap.forEach((indices) => {
            if (indices.length > 1) {
                indices.forEach(idx => {
                    dupSet.add(idx);
                    addError(idx, "E-mail duplicado em outra linha", 'error');
                });
            }
        });

        const finalErrors = Object.entries(rowErrorsMap).map(([index, data]) => ({
            rowIndex: parseInt(index),
            message: data.messages.join(" | "),
            type: data.type
        })).sort((a, b) => a.rowIndex - b.rowIndex);

        return { validationErrors: finalErrors, duplicateIndices: dupSet };
    }, [bodyData, currentHeaders, originalData]);

    const scrollToError = (rowIndex: number) => {
        const hotInstance = hotTableComponent.current?.hotInstance;
        if (hotInstance) {
            const emailColIndex = currentHeaders.findIndex(h => h?.toUpperCase().trim() === "EMAIL");
            const targetCol = emailColIndex !== -1 ? emailColIndex : 0;
            hotInstance.scrollViewportTo(rowIndex, targetCol);
            hotInstance.selectCell(rowIndex, targetCol);
            hotInstance.listen();
        }
    };

    const handleConfirm = () => {
        const hotInstance = hotTableComponent.current?.hotInstance;
        if (!hotInstance || !originalData || originalData.length === 0) return;

        setIsNavigating(true);
        const updatedBody = hotInstance.getData();
        const headers = originalData[0];
        const originalBody = originalData.slice(1);

        const diffData = updatedBody.map((row, rowIndex) => {
            const originalRow = originalBody[rowIndex] || headers.map(() => "");
            if (JSON.stringify(row) === JSON.stringify(originalRow)) return null;

            const rowDiff: Record<string, any> = { _originalIndex: rowIndex };

            headers.forEach((header: string, colIndex: number) => {
                rowDiff[header] = {
                    old: originalRow[colIndex],
                    new: row[colIndex]
                };
            });

            return rowDiff;
        }).filter(Boolean);

        setTableData(diffData as any);

        setTimeout(() => router.push("/formConfirm"), 0);
    };

    const handleReset = () => setTableData(JSON.parse(JSON.stringify(originalData)));

    const emailRenderer = (instance: any, td: HTMLElement, row: number, col: number, prop: string | number, value: any, cellProperties: any) => {
        textRenderer(instance, td, row, col, prop, value, cellProperties);
        const emailValue = String(value || "").trim();
        const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
        const isDuplicate = duplicateIndices.has(row);
        if ((emailValue && !isValidFormat) || isDuplicate) td.classList.add('cell-error');
        else td.classList.remove('cell-error');
    };

    const idRenderer = (instance: any, td: HTMLElement, row: number, col: number, prop: string | number, value: any, cellProperties: any) => {
        textRenderer(instance, td, row, col, prop, value, cellProperties);
        const currentValue = String(value || "").trim();
        const originalValue = String(originalData[row + 1]?.[col] || "").trim();
        if (currentValue !== "" && currentValue !== originalValue) td.classList.add('cell-warning');
        else td.classList.remove('cell-warning');
    };

    const hasValidationErrors = validationErrors.some(e => e.type === 'error');

    if (isLoadingStorage) return <div className="p-20 text-center animate-pulse">Recuperando rascunho...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 bg-card rounded-xl shadow-sm border border-border">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold">Editar dados enviados</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Revise os dados antes de confirmar.</p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            id='step-table-reset'
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={14} />
                            Restaurar Tabela
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[95vw] max-w-md rounded-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Restaurar originais?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Isso excluirá permanentemente todas as edições feitas.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReset} className="bg-destructive text-white hover:bg-destructive/90">
                                Confirmar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            {validationErrors.length > 0 && (
                <ErrorDashboard
                    validationErrors={validationErrors}
                    showAllErrors={showAllErrors}
                    setShowAllErrors={setShowAllErrors}
                    scrollToError={scrollToError}
                />
            )}

            <div id="step-table-area" className="rounded-lg border border-border overflow-hidden shadow-sm bg-white dark:bg-zinc-950">
                {(tableData.length > 0 || isNavigating) ? (
                    <div className="custom-hot-wrapper overflow-x-auto">
                        <HotTable
                            ref={hotTableComponent}
                            colHeaders={currentHeaders}
                            data={bodyData}
                            height="400px"
                            width="100%"
                            stretchH="all"
                            autoColumnSize={true}
                            manualColumnResize={true}
                            rowHeaders={true}
                            licenseKey="non-commercial-and-evaluation"
                            formulas={{ engine: HyperFormula }}
                            contextMenu={true}
                            className="custom-hot-table"
                            viewportRowRenderingOffset={10}
                            renderAllRows={false}
                            columns={(column) => {
                                const header = currentHeaders[column]?.toUpperCase().trim() || "";
                                if (header === "EMAIL") return { type: 'text', renderer: emailRenderer };
                                if (header === "ID") return { type: 'text', renderer: idRenderer };
                                return { type: 'text' };
                            }}
                            afterChange={(changes) => {
                                if (!changes) return;
                                const hotInstance = hotTableComponent.current?.hotInstance;
                                if (hotInstance) {
                                    const updatedData = hotInstance.getData();
                                    setTableData([currentHeaders, ...updatedData]);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="p-12 text-center text-muted-foreground text-sm italic">
                        Nenhum dado encontrado.
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                    <span className="text-foreground font-bold">{bodyData.length}</span> linhas processadas
                </p>
                <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                    <Button variant="ghost" onClick={() => router.push("/formsUpload")}>Retornar</Button>
                    <Button
                        variant="default"
                        className={cn("px-8", hasValidationErrors && "opacity-50 grayscale cursor-not-allowed")}
                        onClick={handleConfirm}
                        disabled={hasValidationErrors || isNavigating}
                    >
                        {hasValidationErrors ? "Corrigir Erros" : "Confirmar Upload"}
                    </Button>
                </div>
            </div>
            <style jsx global>{tableStyles}</style>
        </div>
    );
}