"use client";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useFile } from "@/app/context/FileContext";
import confetti from "canvas-confetti"; // Importar a biblioteca

export function TourApp() {
    const pathname = usePathname();
    const { tableData } = useFile();
    const driverRef = useRef<any>(null);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#fbbf24", "#646a75", "#000000"]
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#fbbf24", "#646a75", "#000000"]
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    const allSteps = [
        // { element: "#tour-help", popover: { title: "Central de Ajuda", description: "Reinicie o tour aqui.", side: "bottom" }, path: "*" },
        // { element: "#tour-theme", popover: { title: "Modo Escuro/Claro", description: "Mude o visual do sistema.", side: "bottom" }, path: "*" },
        // { element: "#tour-network", popover: { title: "Status de Conexão", description: "Veja se está online.", side: "bottom" }, path: "*" },
        { element: "#step-forms-tab", popover: { title: "Formulários", description: "Templates disponíveis para download e envio.", side: "bottom" }, path: ["/", "/forms"] },
        { element: "#step-history-tab", popover: { title: "Histórico", description: "Consulte os logs anteriores.", side: "bottom" }, path: ["/", "/forms"] },
        { element: "#step-view-mode", popover: { title: "Visualização", description: "Alterne visualização entre grid e lista.", side: "bottom" }, path: ["/", "/forms"] },
        { element: "#step-select-search", popover: { title: "Pesquisa", description: "Use a busca para localizar um formulário específico ou explore a lista de formulários disponíveis.", side: "bottom" }, path: ["/", "/forms"] },
        { element: "#step-upload-area", popover: { title: "Upload", description: "Arraste seus arquivos aqui para visualização.", side: "top" }, path: "/formsUpload" },
        { element: "#step-table-reset", popover: { title: "Restaurar", description: "Restaura tabela para valores originais.", side: "top" }, path: "/formEdit" },
        { element: "#step-table-log", popover: { title: "Logs", description: "Log de avisos e erros contidos na tabela.", side: "top" }, path: "/formEdit" },
        { element: "#step-table-lineError", popover: { title: "Linha do erro", description: "É possivel clicar no link e ir direto para a linha que contem o erro.", side: "top" }, path: "/formEdit" },
        { element: "#step-table-more", popover: { title: "Expandir Logs", description: "É possivel clicar para expandir os logs dependendo da quantidade.", side: "top" }, path: "/formEdit" },
        { element: "#step-table-area", popover: { title: "Editar", description: "Edite os dados contidos na tabela.", side: "top" }, path: "/formEdit" },
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
            onNextClick: () => {
                const isLast = driverRef.current.isLastStep();
                if (isLast) {
                    triggerConfetti();
                    driverRef.current.destroy();
                } else {
                    driverRef.current.moveNext();
                }
            },
        });

        const handleStartTour = () => {
            if (!driverRef.current) return;

            const validSteps = allSteps
                .filter(s => {
                    if (s.path === "*") return true;
                    if (Array.isArray(s.path)) {
                        return s.path.includes(pathname);
                    }
                    return s.path === pathname;
                })
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