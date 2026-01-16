"use client";

import { useState } from "react";
import { ModalDetails } from "./ModalDetails";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LuCircleAlert, LuCircleCheck, LuEye } from "react-icons/lu";
import { LogItem } from "../type/ILogs";

interface LogsProps {
  viewMode: "grid" | "list";
  data: LogItem[];
}

export function Logs({ viewMode, data }: LogsProps) {

  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (log: LogItem) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };


  return (
    <div className={cn(
      "gap-4",
      viewMode === "grid" ? "grid grid-cols-12" : "flex flex-col w-full"
    )}>
      {data.map((log) => {
        const isError = log.status === "error";

        return (
          <div
            key={log.id}
            className={cn(viewMode === "grid" ? "col-span-12 sm:col-span-6 lg:col-span-4" : "w-full")}
          >
            <Card className={cn(
              "border-border transition-all duration-200 bg-card overflow-hidden h-full flex flex-col",
              isError ? "border-l-4 border-l-red-500" : "border-l-4 border-l-green-500",
              viewMode === "list" && "sm:flex-row sm:items-center p-4 gap-4"
            )}>
              <div className={cn(
                "flex flex-1 w-full",
                viewMode === "grid" ? "flex-col" : "flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
              )}>
                <CardHeader className={cn(viewMode === "list" ? "p-0 flex-1" : "pb-2")}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1"> 
                      <div className={cn(
                        "p-2 rounded-md shrink-0",
                        isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                      )}>
                        {isError ? <LuCircleAlert size={20} /> : <LuCircleCheck size={20} />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm sm:text-base truncate font-bold">
                          {log.file}
                        </CardTitle>
                        <CardDescription className="text-[10px] sm:text-xs truncate">
                          {log.date}
                        </CardDescription>
                      </div>
                    </div>

                    <Badge
                      variant={isError ? "destructive" : "success"}
                      className={cn(
                        "capitalize shrink-0 text-[10px] px-2 py-0",
                        viewMode === "list" && "hidden md:inline-flex"
                      )}
                    >
                      {log.status}
                    </Badge>
                  </div>
                </CardHeader>

                <div className={cn(
                  "px-6 py-2 flex-1",
                  viewMode === "list" && "p-0 px-2 sm:max-w-md"
                )}>
                  {isError ? (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-md p-3 flex items-start gap-2">
                      <LuCircleAlert className="text-red-500 shrink-0 mt-0.5" size={14} />
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium italic leading-tight">
                        {log.errorMessage || "Erro desconhecido no processamento."}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">{log.records}</span> registros processados.
                    </p>
                  )}
                </div>
              </div>

              <CardFooter className={cn(
                "p-4",
                viewMode === "grid" ? "mt-auto pt-4" : "sm:p-0 w-full sm:w-auto mt-4 sm:mt-0"
              )}>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 w-full sm:w-auto justify-center"
                  onClick={() => handleOpenDetails(log)}
                >
                  <LuEye size={16} />
                  Detalhes
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      })}

      <ModalDetails
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        log={selectedLog}
      />
    </div>
  );
}