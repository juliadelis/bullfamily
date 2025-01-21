"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@radix-ui/react-switch";

interface DatePickerProps {
  field: any;
}

export function DatePicker({ field }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] ml-8 pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          )}>
          {field.value ? (
            format(field.value, "PPP", { locale: ptBR })
          ) : (
            <span>Escolha uma data</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={ptBR}
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) => date < new Date("1900-01-01")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
