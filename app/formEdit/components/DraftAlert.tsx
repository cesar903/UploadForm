"use client";

import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function DraftFloatingAlert() {
  const [isExpanded, setIsExpanded] = useState(true);

  // Encolhe automaticamente após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end">
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "cursor-pointer shadow-2xl flex items-center border border-blue-400 dark:border-blue-900 bg-white/95 backdrop-blur-sm dark:bg-zinc-950/95 overflow-hidden",
          isExpanded ? "rounded-xl p-4 max-w-sm" : "rounded-full p-3 h-12 w-12 justify-center"
        )}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Info className={cn("shrink-0 transition-colors", isExpanded ? "text-blue-600 w-5 h-5" : "text-blue-500 w-6 h-6")} />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="ml-3 overflow-hidden"
            >
              <p className="text-blue-900 dark:text-blue-400 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                Sessão Protegida
              </p>
              <p className="text-muted-foreground font-bold text-[12px] leading-tight mt-0.5 min-w-60">
                Seu progresso é salvo automaticamente. Sinta-se livre para sair e voltar depois.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}