export interface ChangeDetail {
    field: string;
    old: any;
    new: any;
}

export interface GroupedRecord {
    originalIndex: number;
    changes: ChangeDetail[];
}

export interface ConfirmChangeItemProps {
    record: GroupedRecord;
    index: number;
    onConfirm: (originalIndex: number) => void;
    onRevert: (originalIndex: number) => void;
    onGoToLine: (originalIndex: number) => void;
    onUpdateField: (originalIndex: number, field: string, newValue: string) => void;
}