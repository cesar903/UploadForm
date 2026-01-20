export interface ChangeData {
    field: string;
    old: any;
    new: any;
    originalIndex: number;
}

export interface ConfirmChangeItemProps {
    change: ChangeData;
    index: number;
    onConfirm: (index: number) => void;
    onRevert: (index: number) => void;
}