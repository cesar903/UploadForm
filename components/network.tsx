"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ConnectionType = "online" | "slow" | "offline";

export function Network() {
  const [status, setStatus] = useState<ConnectionType>("online");
  const [details, setDetails] = useState("");

  useEffect(() => {
    const updateStatus = () => {
      if (!navigator.onLine) {
        setStatus("offline");
        setDetails("Você está desconectado");
        return;
      }

      // @ts-ignore - Network Information API ainda não é padrão em todos os browsers
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (connection) {
        const { effectiveType, rtt } = connection;
        
        if (effectiveType === "2g" || effectiveType === "3g" || rtt > 500) {
          setStatus("slow");
          setDetails(`Conexão lenta (${effectiveType}) - Latência: ${rtt}ms`);
        } else {
          setStatus("online");
          setDetails(`Conexão estável (${effectiveType})`);
        }
      } else {
        setStatus("online");
        setDetails("Conectado");
      }
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // @ts-ignore
    const connection = navigator.connection;
    if (connection) {
      connection.addEventListener("change", updateStatus);
    }

    updateStatus();

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      if (connection) connection.removeEventListener("change", updateStatus);
    };
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help p-2 rounded-full hover:bg-muted transition-colors">
            <div className="relative flex h-3 w-3">
              {status !== "online" && (
                <span className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  status === "slow" ? "bg-yellow-400" : "bg-red-400"
                )}></span>
              )}
              <span className={cn(
                "relative inline-flex rounded-full h-3 w-3 shadow-sm border border-white dark:border-zinc-900",
                status === "online" && "bg-green-500",
                status === "slow" && "bg-yellow-500",
                status === "offline" && "bg-red-500"
              )}></span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{details}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}