export interface SearchItem {
    label: string;
    value: string;
}

export interface SearchProps {
    items: SearchItem[];
    onSelect: (value: string) => void;
}