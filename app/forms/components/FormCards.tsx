"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormItem } from "@/app/forms/type/IFormCards";
import { Search } from "./Search";
import { FormCardItem } from "./FormCardItem";

interface FormCardsProps {
  viewMode: "grid" | "list";
  data: FormItem[];
}

export function FormCards({ viewMode, data }: FormCardsProps) {
  const [filter, setFilter] = useState("");

  const searchItems = useMemo(() =>
    data.map(item => ({ label: item.title, value: item.title.toLowerCase() })),
    [data]
  );

  const filteredData = useMemo(() => {
    return data.filter(item => item.title.toLowerCase().includes(filter.toLowerCase()));
  }, [data, filter]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <Search items={searchItems} onSelect={(val) => setFilter(val)} />

      <div className={cn(
        "gap-4",
        viewMode === "grid" ? "grid grid-cols-12" : "flex flex-col w-full"
      )}>
        {filteredData.length > 0 ? (
          filteredData.map((form) => (
            <div
              key={form.id}
              className={cn(viewMode === "grid" ? "col-span-12 sm:col-span-6 lg:col-span-4" : "w-full")}
            >
              <FormCardItem form={form} viewMode={viewMode} />
            </div>
          ))
        ) : (
          <div className="col-span-12 flex flex-col items-center justify-center py-20 bg-muted/10 border border-dashed rounded-xl">
            <ClipboardList className="w-12 h-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground font-medium">Nenhum formulário encontrado para "{filter}"</p>
            <Button variant="link" onClick={() => setFilter("")} className="mt-2 text-primary cursor-pointer">
              Limpar busca
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}