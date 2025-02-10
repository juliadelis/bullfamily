import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaPendency } from "./formSchema";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormComponent,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { inputs } from "./fields";
import { FieldByType } from "@/components/imoveis/fieldByType";
import { pendencyState } from "@/@types/PendencyState";

import { useEffect, useState } from "react";
import { pendencyAcronym } from "@/@types/PendencyAcronym";
import { createClient } from "@/utils/supabase/client";
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";

interface PendencyAcronymForm {
  onSubmit: (data: z.infer<typeof formSchemaPendency>) => Promise<void>;
  data?: pendencyState;
  nameEstate?: string | undefined;
  idState?: number;
}

export function PendencyStateComponent({
  onSubmit,
  data,
  nameEstate,
  idState,
}: PendencyAcronymForm) {
  const [pendency, setPendency] = useState<pendencyAcronym[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("pendencyAcronym")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.log(error);
        if (!data) return;
        setPendency(data);
      });
  }, []);

  const form = useForm<z.infer<typeof formSchemaPendency>>({
    resolver: zodResolver(formSchemaPendency),
    defaultValues: {
      nameEstate: nameEstate ?? data?.nameEstate ?? "",
      pendency_acronym: data?.pendency_acronym || "",
      date: data?.date ? new Date(data.date) : new Date(),
      idState: idState ?? data?.idstate ?? 0,
    },
  });

  return (
    <FormComponent {...form}>
      <div className="w-full scroll-smooth">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-y-4 flex flex-col gap-4
           w-full">
          <FormField
            control={form.control}
            name="pendency_acronym"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Selecione uma pendência</FormLabel>
                <FormControl>
                  <select
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="border rounded-md p-2 text-sm">
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    {pendency.map((option) => (
                      <option
                        key={option.id}
                        value={`${option.id}-${option.acronym}`}>
                        {option.acronym}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Pendência</FormLabel>
                <FormControl>
                  <TextField
                    size="small"
                    type="date"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    fullWidth
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-fit col-span-2">
            Enviar
          </Button>
        </form>
      </div>
    </FormComponent>
  );
}
