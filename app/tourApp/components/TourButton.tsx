"use client";

import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react"; // Corrigindo para CircleHelp que é o padrão do Lucide
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TourButton() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost" 
                        size="icon"    
                        onClick={() => window.dispatchEvent(new Event("start-app-tour"))}
                        className="h-9 w-9 sm:w-auto sm:px-3 rounded-full cursor-pointer"
                    >
                        <CircleHelp className="h-[1.2rem] w-[1.2rem] text-primary" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Guia de Tela</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}