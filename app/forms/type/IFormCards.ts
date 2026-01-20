export interface FormItem {
    id: string;
    title: string;
    description: string;
    lastUpload: string;
}

export interface FormCardItemProps {
    form: FormItem;
    viewMode: "grid" | "list";
}