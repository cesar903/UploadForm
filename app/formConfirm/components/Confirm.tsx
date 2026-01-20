"use client";

import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFile } from "@/app/context/FileContext";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

    const individualChanges = useMemo(() => {
        const changes: any[] = [];
        if (!tableData?.length) return [];

        tableData.forEach((record: any) => {
            if (typeof record !== "object" || Array.isArray(record)) return;

            Object.entries(record).forEach(([key, diff]: [string, any]) => {
                if (isCriticalField(key) && diff) {
                    const valOld = String(diff.old ?? "").trim();
                    const valNew = String(diff.new ?? "").trim();

                    if (valOld !== valNew) {
                        changes.push({
                            field: key,
                            old: diff.old,
                            new: diff.new,
                            originalIndex: record._originalIndex,
                        });
                    }
                }
            });
        });

        return changes;
    }, [tableData]);

    const filteredMergeData = useMemo(() => {
        return tableData.filter((record: any) => {
            return Object.entries(record).some(([key, diff]: [string, any]) => {
                if (!isCriticalField(key) || !diff) return false;

                const valOld = String(diff.old ?? "").trim();
                const valNew = String(diff.new ?? "").trim();

                return valOld !== valNew;
            });
        });
    }, [tableData]);

    useEffect(() => {
        if (individualChanges.length && initialStats.totalChanges === 0) {
            setInitialStats({
                criticalRecords: filteredMergeData.length,
                totalChanges: individualChanges.length,
            });
        }
    }, [individualChanges, filteredMergeData, initialStats.totalChanges]);

    useEffect(() => {
        window.dispatchEvent(new Event("tour-dom-updated"));
    }, [individualChanges.length]);

    const revertChange = (index: number) => {
        const change = individualChanges[index];
        if (!change) return;

        const newData = [...tableData] as any[];
        const recordIndex = newData.findIndex(
            r => r._originalIndex === change.originalIndex
        );

        if (recordIndex !== -1) {
            newData[recordIndex][change.field] = {
                old: change.old,
                new: change.old,
            };
            setTableData(newData);
        }
    };

    const confirmChange = (index: number) => {
        const change = individualChanges[index];
        if (!change) return;

        const newData = [...tableData] as any[];
        const recordIndex = newData.findIndex(
            r => r._originalIndex === change.originalIndex
        );

        if (recordIndex !== -1) {
            newData[recordIndex][change.field] = {
                old: change.new,
                new: change.new,
            };
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

    return (
        <div className="w-full max-w-6xl p-6 bg-card rounded-xl shadow-sm border">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    Confirmar Alterações Críticas
                </h1>
                <p className="text-muted-foreground italic text-sm">
                    Apenas campos de identificação.
                </p>
            </div>

            <div
                id="step-security-summary"
                className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8 flex gap-3"
            >
                <div className="bg-blue-500 p-2 rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Resumo de segurança
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-300">
                        {individualChanges.length ? `Faltam ${individualChanges.length} itens...` : "Não há confirmações pendentes."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <AnimatePresence mode="popLayout">
                    {individualChanges.map((change, index) => (
                        <ConfirmChangeItem
                            key={`${change.originalIndex}-${change.field}`}
                            change={change}
                            index={index}
                            onConfirm={confirmChange}
                            onRevert={revertChange}
                        />
                    ))}
                </AnimatePresence>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="outline" onClick={onBackToEdit} className="cursor-pointer">
                    Corrigir na Tabela
                </Button>

                <Button
                    id="step-final-btn"
                    onClick={handleFinalMerge}
                    disabled={individualChanges.length > 0 || isSubmitting}
                    className={cn(
                        "px-10 font-bold h-11",
                        individualChanges.length
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-primary-foreground"
                    )}
                >
                    {individualChanges.length
                        ? `Revise as pendências (${individualChanges.length})`
                        : "Confirmar Envio"}
                </Button>
            </div>

            <SuccessModal
                isOpen={modalConfig.isOpen}
                onOpenChange={open =>
                    setModalConfig(prev => ({ ...prev, isOpen: open }))
                }
                type={modalConfig.type}
                title={
                    modalConfig.type === "success"
                        ? "Realizado com Sucesso!"
                        : "Falha no Envio!"
                }
                description={
                    modalConfig.type === "success"
                        ? "Dados validados e alterações aplicadas."
                        : "Erro ao processar."
                }
                stats={
                    modalConfig.type === "success"
                        ? [
                            { label: "Registros Críticos", value: initialStats.criticalRecords },
                            { label: "Alterações Totais", value: initialStats.totalChanges },
                            { label: "Tempo", value: "1.2s" },
                        ]
                        : []
                }
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