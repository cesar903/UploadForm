"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFile } from "@/app/context/FileContext";
import { useRouter } from "next/navigation";

export default function DragDrop() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { processFile } = useFile();
  const router = useRouter();

  const handleUpload = async () => {
    if (file) {
      setIsLoading(true);
      try {
        await processFile(file);
        router.push("/formEdit");
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        setIsLoading(false);
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    disabled: !!file
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div id="step-upload-area" className="w-full max-w-3xl p-6 bg-card text-card-foreground rounded-xl shadow-sm border border-border transition-colors">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Carregar Formulário</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Faça o upload do seu arquivo CSV ou Excel para importar dados. Certifique-se de que seu arquivo esteja no formato do modelo.
        </p>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative min-h-40 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center cursor-pointer",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20 hover:bg-muted/30",
            "pt-10 pb-10"
          )}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-muted rounded-full mb-4">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground">Arraste e solte seu arquivo aqui</p>
          <p className="text-sm text-muted-foreground mt-1">ou adicione clicando (CSV, XLS, XLSX)</p>
        </div>
      ) : (
        <div className="flex items-center w-full p-4 bg-muted/50 border border-border rounded-lg">
          <div className="p-3 bg-background rounded-lg mr-4 text-primary">
            <FileText className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-end gap-3">
        <Button
          variant="action"
          asChild
        >
          <a href="/forms">Cancelar</a>
        </Button>

        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
          variant="default"
          className="px-8 h-10 font-semibold"
        >
          {isLoading ? "Processando..." : "Upload & Continuar"}
        </Button>
      </div>
    </div>
  ); 
}