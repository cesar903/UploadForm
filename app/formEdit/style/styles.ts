import css from 'styled-jsx/css';

export const tableStyles = css.global`
    /* Efeito de desfoque quando o modal está aberto */
    body:has([data-slot="alert-dialog-content"]) .custom-hot-wrapper {
        filter: blur(4px);
        transition: filter 0.2s ease;
    }
    
    /* Cabeçalhos (th) */
    .custom-hot-table th {
        background-color: var(--muted) !important; 
        color: var(--muted-foreground) !important;
        font-size: 12px !important;
        text-transform: uppercase !important;
        border-color: var(--border) !important;
        font-weight: 600 !important;
    }

    /* Células (td) */
    .custom-hot-table td {
        background-color: var(--card) !important;
        color: var(--foreground) !important;
        font-size: 14px !important;
        border-color: var(--border) !important;
    }

    /* Borda da célula selecionada */
    .custom-hot-table .wtBorder.current {
        background-color: var(--primary) !important; 
    }

    /* Header de linha (números na esquerda) */
    .custom-hot-table .rowHeader {
        color: var(--muted-foreground) !important;
        border-right-color: var(--border) !important;
        background-color: var(--muted) !important;
    }

    /* Hover nas linhas */
    .custom-hot-table tbody tr:hover td {
        background-color: var(--accent) !important;
    }

    /* Ajustes de espaçamento interno */
    .handsontable .relative {
        padding: 4px 8px !important;
    }

    .handsontable th, .handsontable td {
        position: relative;
    }

    /* Responsividade */
    @media (max-width: 640px) {
        .handsontable .relative {
            padding: 2px 4px !important;
        }
        .custom-hot-table th {
            font-size: 10px !important;
        }
    }
`;