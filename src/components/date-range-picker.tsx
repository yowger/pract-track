"use client"

import { format } from "date-fns"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

export type DateRangeValue = DateRange

interface DatePickerWithRangeProps {
    value?: DateRangeValue
    onChange?: (value?: DateRangeValue ) => void
}

export function DatePickerWithRange({
    value,
    onChange,
}: DatePickerWithRangeProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant="outline"
                    className={cn(
                        "w-full justify-between text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    {value?.from ? (
                        value?.to ? (
                            <>
                                {format(value.from, "LLL dd, y")} -{" "}
                                {format(value.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(value.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={value?.from}
                    selected={value}
                    onSelect={onChange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    )
}

export default function ParentComponent() {
    const [dateRange, setDateRange] = useState<DateRangeValue>()

    return (
        <div className="space-y-4">
            <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            <pre className="text-sm">{JSON.stringify(dateRange, null, 2)}</pre>
        </div>
    )
}
