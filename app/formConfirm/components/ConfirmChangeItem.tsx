"use client";

import { Check, X, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfirmChangeItemProps {
    change: {
        field: string;
        old: any;
        new: any;
        originalIndex: number;
    };
    index: number;
    onConfirm: (index: number) => void;
    onRevert: (index: number) => void;
}

export function ConfirmChangeItem({
    change,
    index,
    onConfirm,
    onRevert,
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
                className="border-l-4 border-l-amber-500 bg-card overflow-hidden shadow-sm p-0"
            >
                <CardContent className="p-0">
                    <div className="px-3 flex justify-between items-center mt-2">
                        <div
                            id={isFirst ? "step-card-badge" : undefined}
                            className="flex items-center gap-2"
                        >   
                            <Badge variant="outline" className="text-black">
                                {change.field}
                            </Badge> 
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Linha #{change.originalIndex + 1}
                            </span>
                        </div>

                        <TooltipProvider>
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            id={isFirst ? "step-reset-merge" : undefined}
                                            onClick={() => onRevert(index)}
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        Descartar e voltar ao original
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            id={isFirst ? "step-confirm-merge" : undefined}
                                            onClick={() => onConfirm(index)}
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-green-600 hover:bg-green-500/10 transition"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        Aprovar alteração
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>

                    <div
                        id={isFirst ? "step-merge" : undefined}
                        className="p-3 pt-2"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                                    Anterior
                                </span>
                                <div className="px-3 py-1 rounded-md bg-red-500/5 text-red-600 line-through text-sm border border-red-500/10 truncate font-mono">
                                    {String(change.old) || "vazio"}
                                </div>
                            </div>

                            <ArrowRight
                                size={18}
                                className="hidden sm:block text-muted-foreground/30"
                            />

                            <div className="flex-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                                    Novo Valor
                                </span>
                                <div className="px-3 py-1 rounded-md bg-green-500/5 text-green-600 font-bold text-sm border border-green-500/10 truncate font-mono">
                                    {String(change.new) || "vazio"}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
