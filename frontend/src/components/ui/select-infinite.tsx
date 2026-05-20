"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface SelectInfiniteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  placeholder?: string;
  onScrollEnd?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  disabled?: boolean;
  size?: "sm" | "default";
  triggerClassName?: string;
  contentClassName?: string;
  emptyMessage?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function SelectInfinite({
  value,
  onValueChange,
  options,
  placeholder = "Seleccionar...",
  onScrollEnd,
  hasNextPage = false,
  isLoadingMore = false,
  disabled = false,
  size = "default",
  triggerClassName,
  contentClassName,
  emptyMessage = "No hay opciones disponibles",
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Buscar...",
}: SelectInfiniteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isLoadingRef = React.useRef(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync the input value with the selected option label when popover is closed
  const selectedOption = React.useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Display value for the input box
  const displayValue = React.useMemo(() => {
    if (isOpen) {
      return searchValue;
    }
    return selectedOption ? selectedOption.label : searchValue || "";
  }, [isOpen, searchValue, selectedOption]);

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      if (!target || !onScrollEnd || !hasNextPage || isLoadingMore) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = target;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom <= 45 && !isLoadingRef.current) {
        isLoadingRef.current = true;
        onScrollEnd();
        setTimeout(() => {
          isLoadingRef.current = false;
        }, 500);
      }
    },
    [onScrollEnd, hasNextPage, isLoadingMore]
  );

  const handleSelectItem = (optionValue: string, optionLabel: string) => {
    onValueChange?.(optionValue);
    onSearchChange?.(optionLabel);
    setIsOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <PopoverPrimitive.Trigger
        render={
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              disabled={disabled}
              placeholder={placeholder}
              value={displayValue}
              onChange={(e) => {
                setIsOpen(true);
                onSearchChange?.(e.target.value);
              }}
              onFocus={() => {
                setIsOpen(true);
                // Select input content on focus for better UX
                setTimeout(() => inputRef.current?.select(), 50);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-10 pl-3 text-sm transition-colors outline-hidden focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50",
                size === "sm" ? "h-7 text-xs" : "h-8 text-sm",
                triggerClassName
              )}
            />
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none size-4 text-muted-foreground transition-transform duration-200" />
          </div>
        }
      />

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side="bottom"
          sideOffset={4}
          align="center"
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            className={cn(
              "relative isolate z-50 flex max-h-60 w-(--anchor-width) min-w-36 origin-(--transform-origin) flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              contentClassName
            )}
          >
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden p-1"
              onScroll={handleScroll}
            >
              {options.length === 0 ? (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      disabled={option.disabled}
                      onClick={() => handleSelectItem(option.value, option.label)}
                      className={cn(
                        "relative flex w-full cursor-default items-center rounded-md py-1.5 pr-8 pl-2.5 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
                        value === option.value && "bg-accent/40 font-medium"
                      )}
                    >
                      <span className="flex-1 truncate">{option.label}</span>
                      {value === option.value && (
                        <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {hasNextPage && isLoadingMore && (
                <div className="flex items-center justify-center gap-2 px-2 py-3 text-xs text-muted-foreground border-t border-border mt-1">
                  <Spinner className="h-3.5 w-3.5" />
                  <span>Cargando más...</span>
                </div>
              )}
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
