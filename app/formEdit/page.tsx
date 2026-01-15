"use client";

import EditableTable from "./components/EditableTable"
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FormEdit() {
    return (
        <>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/formsUpload"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Retornar para Upload</span>
                    </Link>

                    <div className="flex justify-center items-center">
                        <EditableTable />
                    </div>
                </div>
            </div>
        </>
    )
}