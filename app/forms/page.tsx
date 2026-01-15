"use client";

import { useState } from "react";
import { TopTabs } from "./components/TopTabs";
import { FormCards } from "./components/FormCards";
import { Logs } from "@/app/logs/components/Logs";
import { LogItem } from "@/app/logs/type/ILogs";


export default function FormUpload() {
  const [activeTab, setActiveTab] = useState<"forms" | "logs">("forms");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formsMock = [
    {
      id: "1",
      title: "Formulário de Clientes",
      description: "Responsável pela base de clientes ativos.",
      lastUpload: "01/01/2026 12:00",
      slug: "clientes"
    }
  ];

  const logsMock: LogItem[] = [
    {
      id: "1",
      file: "Clientes_Janeiro.xlsx",
      date: "15/01/2026 09:00",
      status: "success",
      records: 150,
      user: "Admin"
    },
    {
      id: "2",
      file: "Vendas_Norte.csv",
      date: "14/01/2026 18:30",
      status: "error",
      records: 0,
      errorMessage: "Coluna 'Preço' contém caracteres inválidos na linha 45.",
      user: "João Silva"
    }
  ];



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <TopTabs
        onSelect={(tab) => setActiveTab(tab)}
        onViewChange={(mode) => setViewMode(mode)}
      />

      {activeTab === "forms" && (<FormCards viewMode={viewMode} data={formsMock} />)}

      {activeTab === "logs" && <Logs viewMode={viewMode} data={logsMock} />}

    </div>
  );
}