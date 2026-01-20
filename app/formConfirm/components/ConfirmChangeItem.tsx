"use client";

import { Check, X, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmChangeItemProps } from "../type/IConfirmChangeItem";

export function ConfirmChangeItem({ 
    record, 
    index, 
    onConfirm, 
    onRevert,
    onGoToLine,
    onUpdateField // Recebendo a nova prop
}: ConfirmChangeItemProps) {
    const isFirst = index === 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                id={isFirst ? "step-active-card" : undefined}
                className="border-l-4 border-l-amber-500 bg-card overflow-hidden shadow-sm p-0 mb-2"
            >
                <CardContent className="p-0">
                    <div className="px-3 flex justify-between items-center mt-2">
                        <div id={isFirst ? "step-card-badge" : undefined} className="flex items-center gap-2">
                            <Badge variant="outline" className="text-muted-foreground bg-waring dark:text-zinc-950 dark:text-white">
                                {record.changes.length} Campos alterados
                            </Badge>
                            
                            <button
                                onClick={() => onGoToLine(record.originalIndex)}
                                className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-1 group"
                                title="Clique para editar esta linha na tabela"
                            >
                                Linha #{record.originalIndex + 1}
                                <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                            </button>
                        </div>

                        <TooltipProvider>
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            id={isFirst ? "step-reset-merge" : undefined}
                                            onClick={() => onRevert(record.originalIndex)}
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Descartar linha e voltar original</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            id={isFirst ? "step-confirm-merge" : undefined}
                                            onClick={() => onConfirm(record.originalIndex)}
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-green-600 hover:bg-green-500/10 transition"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Aprovar alterações da linha</TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>

                    <div id={isFirst ? "step-merge" : undefined} className="p-3 pt-2 space-y-3">
                        {record.changes.map((c, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-zinc-100 dark:border-zinc-800 first:border-0 pt-3 first:pt-0">
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                                        {c.field} - Anterior
                                    </span>
                                    <div className="px-3 py-1 rounded-md bg-red-500/5 text-red-600 line-through text-sm border border-red-500/10 truncate font-mono h-7 flex items-center">
                                        {String(c.old) || "vazio"}
                                    </div>
                                </div>

                                <ArrowRight size={18} className="hidden sm:block text-muted-foreground/30 mt-4 shrink-0" />

                                <div className="flex-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                                        Novo Valor (Editar)
                                    </span>
                                    <input 
                                        type="text"
                                        value={c.new}
                                        onChange={(e) => onUpdateField(record.originalIndex, c.field, e.target.value)}
                                        className="w-full px-3 py-1 rounded-md bg-green-500/5 text-green-600 font-bold text-sm border border-green-500/20 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/30 font-mono transition-all"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}