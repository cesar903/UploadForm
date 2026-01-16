"use client";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useFile } from "@/app/context/FileContext";

export function TourApp() {
    const pathname = usePathname();
    const { tableData } = useFile();
    const driverRef = useRef<any>(null);

    const allSteps = [
        // Globais
        // { element: "#tour-help", popover: { title: "Central de Ajuda", description: "Reinicie o tour aqui.", side: "bottom" }, path: "*" },
        // { element: "#tour-theme", popover: { title: "Modo Escuro/Claro", description: "Mude o visual do sistema.", side: "bottom" }, path: "*" },
        // { element: "#tour-network", popover: { title: "Status de Conexão", description: "Veja se está online.", side: "bottom" }, path: "*" },

        // Home
        { element: "#step-forms-tab", popover: { title: "Formulários", description: "Templates disponíveis para download e envio.", side: "bottom" }, path: "/" },
        { element: "#step-history-tab", popover: { title: "Histórico", description: "Consulte os logs anteriores.", side: "bottom" }, path: "/" },
        { element: "#step-view-mode", popover: { title: "Visualização", description: "Alterne visualização entre grid e lista.", side: "bottom" }, path: "/" },

        // Upload
        { element: "#step-upload-area", popover: { title: "Upload", description: "Arraste seus arquivos aqui para visualização.", side: "top" }, path: "/formsUpload" },

        // Edit
        { element: "#step-table-area", popover: { title: "Editar", description: "Edite os dados contidos na tabela.", side: "top" }, path: "/formEdit" },
        { element: "#step-table-reset", popover: { title: "Restaurar", description: "Restaura tabela para valores originais.", side: "top" }, path: "/formEdit" },

        // Confirm
        { element: "#step-security-summary", popover: { title: "Segurança", description: "Atualizações criticas realizadas manualmente.", side: "top" }, path: "/formConfirm" },
        { element: "#step-card-badge", popover: { title: "Identificação", description: "Campo e linha critica alterada.", side: "top" }, path: "/formConfirm" },
        { element: "#step-merge", popover: { title: "Comparação", description: "Valor anterior e depois.", side: "top" }, path: "/formConfirm" },
        { element: "#step-confirm-merge", popover: { title: "Aprovar", description: "Confirmar intenção de mudança.", side: "top" }, path: "/formConfirm" },
        { element: "#step-reset-merge", popover: { title: "Reverter", description: "Cancelar intenção de mudança.", side: "top" }, path: "/formConfirm" },
    ];

    useEffect(() => {
        driverRef.current = driver({
            showProgress: true,
            animate: true,
            stagePadding: 10,
            nextBtnText: "Próximo",
            prevBtnText: "Anterior",
            doneBtnText: "Finalizar",
            popoverClass: "driverjs-theme",
            steps: [],
        });

        const handleStartTour = () => {
            if (!driverRef.current) return;

            const validSteps = allSteps
                .filter(s => s.path === "*" || s.path === pathname)
                .filter(s => {
                    if (!s.element) return true;
                    return document.querySelector(s.element);
                })
                .map(({ path, ...props }) => props);

            if (validSteps.length === 0) return;

            driverRef.current.setSteps(validSteps);
            driverRef.current.drive();
        };

        window.addEventListener("start-app-tour", handleStartTour);

        return () => {
            window.removeEventListener("start-app-tour", handleStartTour);
            driverRef.current?.destroy();
        };
    }, [pathname, tableData]);

    return null;
}
