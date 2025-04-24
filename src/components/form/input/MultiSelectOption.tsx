"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export type Option = {
  value: string
  label: string
}

interface MultiSelectOptionProps {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  maxDisplayItems?: number
}

export function MultiSelectOption({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  searchPlaceholder = "Search options...",
  className,
  maxDisplayItems = 10,
}: MultiSelectOptionProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSelect = React.useCallback(
    (value: string) => {
      onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value])
    },
    [selected, onChange],
  )

  const handleRemove = React.useCallback(
    (value: string) => {
      onChange(selected.filter((item) => item !== value))
    },
    [selected, onChange],
  )

  const handleClearAll = React.useCallback(() => {
    onChange([])
  }, [onChange])

  const selectedLabels = React.useMemo(() => {
    return selected.map((value) => {
      const option = options.find((option) => option.value === value)
      return option ? option.label : value
    })
  }, [selected, options])

  const displaySelectedItems = React.useMemo(() => {
    if (selected.length === 0) return null

    const displayItems = selected.slice(0, maxDisplayItems)
    const remainingCount = selected.length - maxDisplayItems

    return (
      <div className="flex flex-wrap gap-1">
        {displayItems.map((value) => {
          const option = options.find((option) => option.value === value)
          return (
            <Badge key={value} variant="secondary" className="flex items-center gap-1 px-1.5 py-0.5 text-xs">
              {option?.label || value}
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(value)
                }}
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {option?.label || value}</span>
              </div>
            </Badge>
          )
        })}
        {remainingCount > 0 && (
          <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
            +{remainingCount} more
          </Badge>
        )}
      </div>
    )
  }, [selected, options, maxDisplayItems, handleRemove])

  return (
    <div className={cn("space-y-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between text-left font-normal h-auto py-2.5", !selected.length && "text-muted-foreground")}
          >
            <div className="flex flex-col items-start">
              {
                selected.length === 0 && (<div className="flex items-center">
                  {placeholder}
                </div>
                )}
              {displaySelectedItems}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command className="max-h-[300px]">
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />

            {selected.length > 0 && (
              <div className="px-2 pt-2 pb-1 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs w-full justify-start text-muted-foreground"
                  onClick={handleClearAll}
                >
                  Clear all selections
                </Button>
              </div>
            )}

            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-auto">
                {options
                  .filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((option) => {
                    const isSelected = selected.includes(option.value)
                    return (
                      <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50",
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    )
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
