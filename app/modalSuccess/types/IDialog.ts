export interface SuccessModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    type: "success" | "error";
    title: string;
    description: string;
    stats?: {
        label: string;
        value: string | number;
    }[];
    primaryAction: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
}