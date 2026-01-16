"use client";

import { Button } from "@/components/ui/button";
import { CircleQuestionMark  } from "lucide-react";

export function TourButton() {
    return (
        <Button
            variant="ghost" 
            size="icon"    
            onClick={() => window.dispatchEvent(new Event("start-app-tour"))}
            className="h-9 w-9 sm:w-auto sm:px-3 rounded-full cursor-pointer"
            title="Iniciar Tour"
        >
            <CircleQuestionMark  className="h-[1.2rem] w-[1.2rem] text-primary" />
        </Button>
    );
}