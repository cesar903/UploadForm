"use client";

import { Check, X, Info, ArrowRight, CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFile } from "@/app/context/FileContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState, useEffect } from "react";
import { SuccessModal } from "@/app/modalSuccess/components/Dialog";
import { cn } from "@/lib/utils";

export default function Confirm() {
    const { originalData, tableData, setTableData, resetData } = useFile();
    const router = useRouter();
    const [initialStats, setInitialStats] = useState({
        criticalRecords: 0,
        totalChanges: 0
    });
    const CRITICAL_FIELDS = ["ID", "EMAIL", "PHONE"]; //Teste

    const [finalStats, setFinalStats] = useState({
        criticalRecords: 0,
        totalChanges: 0
    });

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: "success" | "error";
    }>({ isOpen: false, type: "success" });

    const isCriticalField = (key: string) => {
        return CRITICAL_FIELDS.some(field =>
            field.toUpperCase().trim() === key.toUpperCase().trim()
        );
    };

    const individualChanges = useMemo(() => {
        const changes: any[] = [];
        if (!tableData || tableData.length === 0) return [];

        tableData.forEach((record: any) => {
            if (Array.isArray(record) || typeof record !== 'object') return;

            Object.entries(record).forEach(([key, diff]: [string, any]) => {
                if (isCriticalField(key) && diff && diff.old !== diff.new) {
                    changes.push({
                        field: key,
                        old: diff.old,
                        new: diff.new,
                        originalIndex: record._originalIndex
                    });
                }
            });
        });

        return changes;
    }, [tableData]);

    const filteredMergeData = useMemo(() => {
        return tableData.filter((record: any) => {
            return Object.entries(record).some(([key, diff]: [string, any]) => {
                const isCritical = isCriticalField(key);
                const hasChanged = diff && diff.old !== diff.new;
                return isCritical && hasChanged;
            });
        });
    }, [tableData]);

    useEffect(() => {
        if (individualChanges.length > 0 && initialStats.totalChanges === 0) {
            setInitialStats({
                criticalRecords: filteredMergeData.length,
                totalChanges: individualChanges.length
            });
        }
    }, [individualChanges, filteredMergeData, initialStats.totalChanges]);

    const revertChange = (changeIndex: number) => {
        const change = individualChanges[changeIndex];
        if (!change) return;

        const newTableData = [...tableData] as any[];
        const targetRecordIndex = newTableData.findIndex(r => r._originalIndex === change.originalIndex);

        if (targetRecordIndex !== -1) {
            newTableData[targetRecordIndex][change.field] = {
                old: change.old,
                new: change.old
            };
            setTableData(newTableData);
        }
    };

    const confirmChange = (changeIndex: number) => {
        const change = individualChanges[changeIndex];
        if (!change) return;

        const newTableData = [...tableData] as any[];
        const targetRecordIndex = newTableData.findIndex(r => r._originalIndex === change.originalIndex);

        if (targetRecordIndex !== -1) {
            newTableData[targetRecordIndex][change.field] = {
                old: change.new,
                new: change.new
            };
            setTableData(newTableData);
        }
    };

    const handleBackToEdit = () => {
        const headers = originalData[0];
        const restoredBody = JSON.parse(JSON.stringify(originalData.slice(1)));

        tableData.forEach((diffRecord: any) => {
            if (diffRecord && diffRecord._originalIndex !== undefined) {
                const targetIndex = diffRecord._originalIndex;
                const updatedRow = headers.map((header: string) => {
                    const cell = diffRecord[header];
                    return cell && typeof cell === 'object' ? cell.new : cell;
                });
                restoredBody[targetIndex] = updatedRow;
            }
        });

        setTableData([headers, ...restoredBody]);
        router.push("/formEdit");
    };

    const handleFinalMerge = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setModalConfig({ isOpen: true, type: "success" });
        } catch (error) {
            setModalConfig({ isOpen: true, type: "error" });
        }
    };

    return (
        <div className="w-full max-w-6xl p-6 bg-card text-card-foreground rounded-xl shadow-sm border border-border">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Confirmar Alterações Críticas</h1>
                <p className="text-muted-foreground italic text-sm">Listando apenas modificações em campos de identificação.</p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8 flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-full">
                    <Info className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Resumo de segurança</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                        {individualChanges.length > 0
                            ? `Faltam ${individualChanges.length} itens para revisar.`
                            : "Todos os itens críticos foram revisados."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {individualChanges.length > 0 && (
                    individualChanges.map((change, index) => (
                        <Card key={`${change.originalIndex}-${change.field}`} className="border-l-4 border-l-amber-500 bg-card overflow-hidden shadow-sm p-0">
                            <CardContent className="p-0">
                                <div className="px-3 flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                            {change.field}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            Linha #{change.originalIndex + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => revertChange(index)} className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition">
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => confirmChange(index)} className="p-1.5 rounded-md text-muted-foreground hover:text-green-600 hover:bg-green-500/10 transition">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3 pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Anterior</span>
                                            <div className="px-3 py-1 rounded-md bg-red-500/5 text-red-600 line-through text-sm border border-red-500/10 truncate font-mono">
                                                {String(change.old) || "vazio"}
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="hidden sm:block text-muted-foreground/30" />
                                        <div className="flex-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Novo Valor</span>
                                            <div className="px-3 py-1 rounded-md bg-green-500/5 text-green-600 font-bold text-sm border border-green-500/10 truncate font-mono">
                                                {String(change.new) || "vazio"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="outline" onClick={handleBackToEdit} className="h-11 px-6 w-full sm:w-auto">
                    Corrigir na Tabela
                </Button>
                <Button
                    onClick={handleFinalMerge}
                    disabled={individualChanges.length > 0}
                    className={cn(
                        "px-10 font-bold shadow-lg transition-all active:scale-95 h-11 w-full sm:w-auto",
                        individualChanges.length > 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground"
                    )}
                >
                    {individualChanges.length > 0 ? `Revise as pendências (${individualChanges.length})` : "Confirmar Envio"}
                </Button>
            </div>

            <SuccessModal
                isOpen={modalConfig.isOpen}
                onOpenChange={(open) => setModalConfig(prev => ({ ...prev, isOpen: open }))}
                type={modalConfig.type}
                title={modalConfig.type === "success" ? "Realizado com Sucesso!" : "Falha no Envio!"}
                description={modalConfig.type === "success"
                    ? "Dados validados e alterações aplicadas conforme revisão crítica."
                    : "Erro ao processar. Tente novamente."
                }
                stats={modalConfig.type === "success" ? [
                    { label: "Registros Críticos", value: initialStats.criticalRecords },
                    { label: "Alterações Totais", value: initialStats.totalChanges },
                    { label: "Tempo", value: "1.2s" }
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