"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ClipboardList, FileDown  } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormItem } from "@/app/forms/types/IFormCards";

interface FormCardsProps {
  viewMode: "grid" | "list";
  data: FormItem[];
}

export function FormCards({ viewMode, data }: FormCardsProps) {
  return (
    <div className={cn(
      "gap-6",
      viewMode === "grid" ? "grid grid-cols-12" : "flex flex-col w-full"
    )}>
      {data.map((form) => (
        <div
          key={form.id}
          className={cn(viewMode === "grid" ? "col-span-12 sm:col-span-6 lg:col-span-4" : "w-full")}
        >
          <Card
            className={cn(
              "border-border transition-all duration-200 bg-card text-card-foreground",
              // Mobile: Coluna | Desktop: Linha (se viewMode for list)
              viewMode === "list" && "flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4"
            )}
          >
            <div className={cn(
              "flex",
              viewMode === "grid" ? "flex-col" : "flex-row items-center justify-between gap-6 flex-1 w-full"
            )}>
              <CardHeader className={cn(viewMode === "list" && "p-0 flex-1")}>
                <div className={cn("flex items-center gap-4", viewMode === "list" && "w-full")}>
                  <ClipboardList className="w-10 h-11 text-primary-foreground bg-primary p-2 rounded-md shrink-0 transition-colors shadow-sm" />

                  <div className={cn(viewMode === "list" && "flex flex-1 justify-between items-center gap-4")}>
                    <div>
                      <CardTitle className={cn("text-foreground", viewMode === "list" && "text-base")}>
                        {form.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Último upload: {form.lastUpload}
                      </CardDescription>
                    </div>

                    {viewMode === "list" && (
                      <div className="hidden lg:block flex-1 max-w-md">
                        <p className="text-muted-foreground text-sm italic truncate">
                          {form.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              {viewMode === "grid" && (
                <CardContent className="p-0 mb-3 px-6 pt-4">
                  <p className="text-muted-foreground text-sm italic">{form.description}</p>
                </CardContent>
              )}
            </div>

            <CardFooter className={cn(
              "p-0",
              viewMode === "grid"
                ? "flex flex-col gap-2 px-6 pb-6"
                : "flex flex-row sm:flex-row gap-3 w-full sm:w-auto mt-2 sm:mt-0"
            )}>
              <Button
                variant="cardAction"
                className={cn(
                  "flex-1 sm:flex-none",
                  viewMode === "grid" ? "w-full" : "w-full sm:w-auto px-4"
                )}
              >
                <FileDown  className={cn("w-5 h-5", viewMode === "list" ? "mr-2 sm:mr-0" : "mr-2")} />
                <span className={cn(viewMode === "list" && "sm:hidden")}>Template</span>
                {viewMode === "grid" && "Download Template"}
              </Button>

              <Button
                asChild
                variant="default"
                className={cn(
                  "flex-1 sm:flex-none", 
                  viewMode === "grid" ? "w-full" : "w-full sm:w-auto px-4"
                )}
              >
                <Link href='/formsUpload'>
                  <Upload  className={cn("w-5 h-5", viewMode === "list" ? "mr-2 sm:mr-0" : "mr-2")} />
                  <span className={cn(viewMode === "list" && "sm:hidden")}>Upload</span>
                  {viewMode === "grid" && "Upload de Dados"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}