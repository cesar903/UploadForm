"use client";

import DragDrop from "../formsUpload/components/DragDrop"
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Link
                    href="/forms"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Retornar para Formulários</span>
                </Link>
                <div className="flex justify-center items-center">
                    <DragDrop />
                </div>

            </div>
        </div>
    );
}
