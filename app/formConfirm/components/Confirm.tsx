"use client";

import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFile } from "@/app/context/FileContext";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";
import { SuccessModal } from "@/app/modalSuccess/components/Dialog";
import { cn } from "@/lib/utils";
import { ConfirmChangeItem } from "./ConfirmChangeItem";

interface ConfirmProps {
    onBackToEdit: () => void;
}

export default function Confirm({ onBackToEdit }: ConfirmProps) {
    const { tableData, setTableData, resetData } = useFile();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const CRITICAL_FIELDS = ["ID", "EMAIL", "PHONE"];

    const [initialStats, setInitialStats] = useState({
        criticalRecords: 0,
        totalChanges: 0,
    });

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: "success" | "error";
    }>({ isOpen: false, type: "success" });

    const isCriticalField = (key: string) =>
        CRITICAL_FIELDS.some(
            field => field.toUpperCase().trim() === key.toUpperCase().trim()
        );

    const groupedChanges = useMemo(() => {
        const changesMap = new Map<number, any>();
        if (!tableData?.length) return [];

        tableData.forEach((record: any) => {
            if (typeof record !== "object" || Array.isArray(record)) return;

            const rowChanges: any[] = [];
            Object.entries(record).forEach(([key, diff]: [string, any]) => {
                if (isCriticalField(key) && diff) {
                    const valOld = String(diff.old ?? "").trim();
                    const valNew = String(diff.new ?? "").trim();
                    if (valOld !== valNew) {
                        rowChanges.push({ field: key, old: diff.old, new: diff.new });
                    }
                }
            });

            if (rowChanges.length > 0) {
                changesMap.set(record._originalIndex, {
                    originalIndex: record._originalIndex,
                    changes: rowChanges,
                });
            }
        });
        return Array.from(changesMap.values());
    }, [tableData]);

    useEffect(() => {
        if (groupedChanges.length && initialStats.totalChanges === 0) {
            setInitialStats({
                criticalRecords: groupedChanges.length,
                totalChanges: groupedChanges.reduce((acc, curr) => acc + curr.changes.length, 0),
            });
        }
    }, [groupedChanges, initialStats.totalChanges]);

    const handleGoToLine = (originalIndex: number) => {
        localStorage.setItem("scroll_to_row", originalIndex.toString());
        onBackToEdit();
    };

    const confirmRow = (originalIndex: number) => {
        const rowData = groupedChanges.find(g => g.originalIndex === originalIndex);
        if (!rowData) return;

        const newData = [...tableData] as any[];
        const recordIndex = newData.findIndex(r => r._originalIndex === originalIndex);

        if (recordIndex !== -1) {
            rowData.changes.forEach((c: any) => {
                newData[recordIndex][c.field] = { old: c.new, new: c.new };
            });
            setTableData(newData);
        }
    };

    const revertRow = (originalIndex: number) => {
        const rowData = groupedChanges.find(g => g.originalIndex === originalIndex);
        if (!rowData) return;

        const newData = [...tableData] as any[];
        const recordIndex = newData.findIndex(r => r._originalIndex === originalIndex);

        if (recordIndex !== -1) {
            rowData.changes.forEach((c: any) => {
                newData[recordIndex][c.field] = { old: c.old, new: c.old };
            });
            setTableData(newData);
        }
    };

    const handleFinalMerge = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await new Promise(r => setTimeout(r, 800));
            setModalConfig({ isOpen: true, type: "success" });
        } catch {
            setModalConfig({ isOpen: true, type: "error" });
        }
        setIsSubmitting(false);
    };

    const handleUpdateField = (originalIndex: number, field: string, newValue: string) => {
        const newData = [...tableData] as any[];
        const recordIndex = newData.findIndex(r => r._originalIndex === originalIndex);

        if (recordIndex !== -1) {
            const currentDiff = newData[recordIndex][field];
            newData[recordIndex][field] = {
                ...currentDiff,
                new: newValue
            };
            setTableData(newData);
        }
    };

    return (
        <div className="w-full max-w-6xl p-6 bg-card rounded-xl shadow-sm border">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Confirmar Alterações Críticas</h1>
                <p className="text-muted-foreground italic text-sm">Apenas campos de identificação.</p>
            </div>

            <div id="step-security-summary" className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8 flex gap-3">
                <div className="bg-blue-500 p-2 rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Resumo de segurança</p>
                    <p className="text-xs text-blue-500 dark:text-blue-300">
                        {groupedChanges.length ? `Faltam ${groupedChanges.length} registros pendentes...` : "Não há confirmações pendentes."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <AnimatePresence mode="popLayout">
                    {groupedChanges.map((record, index) => (
                        <ConfirmChangeItem
                            key={record.originalIndex}
                            record={record}
                            index={index}
                            onConfirm={confirmRow}
                            onRevert={revertRow}
                            onGoToLine={handleGoToLine}
                            onUpdateField={handleUpdateField}
                        />
                    ))}
                </AnimatePresence>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="outline" onClick={onBackToEdit}>Corrigir na Tabela</Button>
                <Button
                    id="step-final-btn"
                    onClick={handleFinalMerge}
                    disabled={groupedChanges.length > 0 || isSubmitting}
                    className={cn("px-10 font-bold h-11", groupedChanges.length ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground")}
                >
                    {groupedChanges.length ? `Revise as pendências (${groupedChanges.length})` : "Confirmar Envio"}
                </Button>
            </div>

            <SuccessModal
                isOpen={modalConfig.isOpen}
                onOpenChange={open => setModalConfig(prev => ({ ...prev, isOpen: open }))}
                type={modalConfig.type}
                title={modalConfig.type === "success" ? "Realizado com Sucesso!" : "Falha no Envio!"}
                description={modalConfig.type === "success" ? "Dados validados e alterações aplicadas." : "Erro ao processar."}
                stats={modalConfig.type === "success" ? [
                    { label: "Registros Críticos", value: initialStats.criticalRecords },
                    { label: "Alterações Totais", value: initialStats.totalChanges },
                    { label: "Tempo", value: "1.2s" },
                ] : []}
                primaryAction={{
                    label: modalConfig.type === "success" ? "Concluído" : "Tentar Novamente",
                    onClick: () => {
                        if (modalConfig.type === "success") {
                            resetData();
                            router.push("/formsUpload");
                        } else {
                            setModalConfig(prev => ({ ...prev, isOpen: false }));
                        }
                    }
                }}
            />
        </div>
    );
}