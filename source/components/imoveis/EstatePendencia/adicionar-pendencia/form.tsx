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
import { Autocomplete, TextField } from "@mui/material";

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
  const [value, setValue] = useState<pendencyAcronym | null>(null);
  const [inputValue, setInputValue] = useState("");

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
      pendency_acronym: data?.pendency_acronym ? data?.pendency_acronym : "",
      date: data?.date ? new Date(data.date) : new Date(),
      idState: idState ?? data?.idstate ?? 0,
    },
  });

  const handleSelection = (newValue: pendencyAcronym | null) => {
    setValue(newValue);
    if (newValue) {
      form.setValue("pendency_acronym", newValue ? newValue.acronym : "");
    }
  };

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
              <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                  handleSelection(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                options={pendency}
                getOptionLabel={(option) => option.acronym}
                isOptionEqualToValue={(option, value) =>
                  option.acronym === value?.acronym
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecione uma pendência"
                    size="small"
                  />
                )}
              />
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
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-fit col-span-2">
            Enviar
          </Button>
        </form>
      </div>
    </FormComponent>
  );
}
