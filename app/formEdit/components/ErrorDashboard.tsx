"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

import { ErrorDashboardProps, ValidationError } from '../type/IErrorDashboard'; 

export function ErrorDashboard({ 
  validationErrors, 
  showAllErrors, 
  setShowAllErrors, 
  scrollToError 
}: ErrorDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const hasCritical = validationErrors.some(e => e.type === 'error');

  const checkOverflow = () => {
    if (containerRef.current) {
      const hasMoreContent = containerRef.current.scrollHeight > 45;
      setIsOverflowing(hasMoreContent);
    }
  };

  useLayoutEffect(() => {
    checkOverflow();
  }, [validationErrors, showAllErrors]);

  useEffect(() => {
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  return (
    <div id='step-table-log' className={cn(
      "mb-6 p-4 border-2 rounded-xl animate-in fade-in transition-all",
      hasCritical ? "border-red-600/30 bg-red-50/5" : "border-orange-500/30 bg-orange-50/5"
    )}>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn("h-5 w-5", hasCritical ? "text-red-500" : "text-orange-500")} />
          <span className="font-bold text-xs sm:text-sm">
            {validationErrors.length} inconsistências detectadas
          </span>
        </div>

        {isOverflowing && (
          <Button 
            id='step-table-more' 
            variant="outline" 
            size="sm" 
            className="h-7 text-[10px] sm:text-xs font-bold whitespace-nowrap"
            onClick={() => setShowAllErrors(!showAllErrors)}
          >
            {showAllErrors ? (
              <><ChevronUp className="mr-1 h-3 w-3" /> Recolher</>
            ) : (
              <><ChevronDown className="mr-1 h-3 w-3" /> Ver Detalhes</>
            )}
          </Button>
        )}
      </div>

      <div 
        ref={containerRef}
        className={cn(
          "flex flex-wrap gap-2 overflow-hidden transition-all duration-500",
          showAllErrors ? "max-h-80 overflow-y-auto pr-2" : "max-h-10"
        )}
      >
        {validationErrors.map((error: ValidationError, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  id='step-table-lineError'
                  variant="link"
                  size="sm"
                  onClick={() => scrollToError(error.rowIndex)}
                  className={cn(
                    "h-8 text-xs px-3 shrink-0 font-bold",
                    error.type === 'error' ? "text-red-700 bg-list" : "text-orange-700 bg-waring"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full mr-2", error.type === 'error' ? "bg-red-600" : "bg-orange-600")} />
                  Linha {error.rowIndex + 1}
                </Button>
              </TooltipTrigger>
              
              <TooltipContent side="top" className="max-w-80 p-0 overflow-hidden border-border shadow-xl">
                <div className="bg-primary text-foreground px-3 py-2 border-b border-zinc-50">
                  <p className="text-[12px] font-bold flex items-center gap-2 text-accent">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Status da Linha {error.rowIndex + 1}
                  </p>
                </div>
                <div className="p-3 space-y-2.5">
                  {error.message.split(" | ").map((msg: string, idx: number) => {
                    const isCrit = msg.toLowerCase().includes("duplicado") || msg.toLowerCase().includes("inválido");
                    return (
                      <div key={idx} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-1">
                        <div className={cn("mt-1 shrink-0 w-1 h-3 rounded-full", isCrit ? "bg-red-500" : "bg-orange-500")} />
                        <div className="space-y-0.5">
                          <p className="text-[10px] uppercase font-black tracking-tight opacity-80">{isCrit ? "Erro Crítico" : "Aviso de Sistema"}</p>
                          <p className="text-[11px] leading-snug opacity-70 font-medium">{msg}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}