"use client";

import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SuccessModalProps } from "../types/IDialog";

export function SuccessModal({
    isOpen,
    onOpenChange,
    type,
    title,
    description,
    stats,
    primaryAction,
    secondaryAction,
}: SuccessModalProps) {
    const isSuccess = type === "success";

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-zinc-950 transition-all">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                        isSuccess ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                    )}>
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg",
                            isSuccess ? "bg-green-500 shadow-green-500/30" : "bg-red-500 shadow-red-500/30"
                        )}>
                            {isSuccess ? <FaCheck className="text-xl" /> : <FaExclamationTriangle className="text-xl" />}
                        </div>
                    </div>

                    <DialogHeader className="items-center">
                        <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</DialogTitle>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-75 mb-8">{description}</p>
                    </DialogHeader>

                    {stats && stats.length > 0 && (
                        <div className="w-full bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-5 mb-8 space-y-3">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">{stat.label}</span>
                                    <span className={cn(
                                        "font-bold",
                                        stat.value === "Completo" ? "text-green-600" : "text-slate-900 dark:text-white"
                                    )}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="w-full space-y-3">
                        <Button className="w-full bg-slate-950 dark:bg-white dark:text-slate-950 h-12 font-bold text-white" onClick={primaryAction.onClick}>
                            {primaryAction.label}
                        </Button>
                        {secondaryAction && (
                            <Button variant="outline" className="w-full h-12 font-bold" onClick={secondaryAction.onClick}>
                                {secondaryAction.label}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}