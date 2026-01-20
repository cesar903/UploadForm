"use client";

import Confirm from "./components/Confirm";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFile } from "@/app/context/FileContext";

export default function FormConfirm() {
    const router = useRouter();
    const { originalData, tableData, setTableData } = useFile();

    const handleBack = () => {
        const headers = originalData[0];
        const restoredBody = JSON.parse(JSON.stringify(originalData.slice(1)));

        tableData.forEach((diffRecord: any) => {
            if (diffRecord?._originalIndex !== undefined) {
                restoredBody[diffRecord._originalIndex] = headers.map(
                    (header: string) =>
                        typeof diffRecord[header] === "object"
                            ? diffRecord[header].new
                            : diffRecord[header]
                );
            }
        });

        setTableData([headers, ...restoredBody]);
        router.push("/formEdit");
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group cursor-pointer"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Voltar para Edição</span>
                </button>

                <div className="flex justify-center items-center">
                    <Confirm onBackToEdit={handleBack} />
                </div>
            </div>
        </div>
    );
}