"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search as SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface SearchProps {
    items: { label: string; value: string }[];
    onSelect: (value: string) => void;
}

export function Search({ items, onSelect }: SearchProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id="step-select-search"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}

                    className="w-full md:w-75 justify-between bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground shadow-sm transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-2 truncate">
                        <SearchIcon className="h-4 w-4 shrink-0 opacity-50 text-primary" />
                        <span className="truncate">
                            {value
                                ? items.find((item) => item.value === value)?.label
                                : "Procurar formulário..."}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-75 p-0 bg-card border-border shadow-xl">
                <Command className="bg-card">
                    <CommandInput
                        placeholder="Digite o nome..."
                        className="text-card-foreground"
                    />
                    <CommandList className="border-t border-border">
                        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                            Nenhum resultado encontrado.
                        </CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                        const newValue = currentValue === value ? "" : currentValue
                                        setValue(newValue)
                                        onSelect(newValue)
                                        setOpen(false)
                                    }}
                                    // Item de seleção com hover sutil
                                    className="cursor-pointer text-card-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 text-primary",
                                            value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}