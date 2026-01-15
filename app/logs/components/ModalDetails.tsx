"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LuCalendar, LuUser, LuFileText, LuTriangleAlert , LuDatabase } from "react-icons/lu";
import { LogItem } from "../type/ILogs";
import { cn } from "@/lib/utils";

interface ModalDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  log: LogItem | null;
}

export function ModalDetails({ isOpen, onOpenChange, log }: ModalDetailsProps) {
  if (!log) return null;

  const isError = log.status === "error";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-none shadow-2xl bg-white dark:bg-zinc-950 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0"><br />
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <LuFileText className="text-primary" />
              Detalhes do Upload
            </DialogTitle>
            <Badge variant={isError ? "destructive" : "success"}>
              {log.status.toUpperCase()}
            </Badge>
          </div>
          <DialogDescription className="text-sm mt-1">
            ID do Log: <span className="font-mono text-xs">{log.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <LuCalendar size={12} /> Data e Hora
              </span>
              <span className="text-sm font-medium">{log.date}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <LuUser size={12} /> Usuário
              </span>
              <span className="text-sm font-medium">{log.user}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <LuDatabase size={12} /> Registros
              </span>
              <span className="text-sm font-medium">{log.records} itens</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <LuFileText size={12} /> Arquivo
              </span>
              <span className="text-sm font-medium truncate" title={log.file}>
                {log.file}
              </span>
            </div>
          </div>

          <div className={cn(
            "rounded-xl p-4 border",
            isError 
              ? "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20" 
              : "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20"
          )}>
            <div className="flex items-center gap-2 mb-2">
              {isError ? (
                <LuTriangleAlert className="text-red-500" size={18} />
              ) : (
                <LuFileText className="text-green-500" size={18} />
              )}
              <span className={cn("font-bold text-sm", isError ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400")}>
                {isError ? "Relatório de Falha" : "Resultado do Processamento"}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground italic">
              {isError 
                ? log.errorMessage 
                : "O arquivo foi processado integralmente sem conflitos detectados nas colunas mapeadas."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}