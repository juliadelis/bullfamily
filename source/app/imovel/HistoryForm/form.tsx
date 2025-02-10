import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaHistory } from "./formSchema";
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
import { historyFields } from "./fields";
import { FieldByType } from "@/components/imoveis/fieldByType";

interface HistoryForm {
  onSubmit: (data: z.infer<typeof formSchemaHistory>) => Promise<void>;
}

export function HistoryFormComponent({ onSubmit }: HistoryForm) {
  const form = useForm<z.infer<typeof formSchemaHistory>>({
    resolver: zodResolver(formSchemaHistory),
    defaultValues: {
      data: "",
    },
  });

  return (
    <FormComponent {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-y-4 flex gap-2
        flex-col   w-full">
        {historyFields.map(({ name, label, placeholder, type }) => {
          return (
            <FormField
              control={form.control}
              name={name as "data"}
              key={name}
              render={({ field }) => (
                <FormItem className={`mb-8 $`}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <FieldByType
                      type={type as "text"}
                      name={name}
                      field={field}
                      placeholder={placeholder}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button
          onClick={form.handleSubmit(onSubmit)}
          className="w-[100%] col-span-2">
          Enviar
        </Button>
      </form>
    </FormComponent>
  );
}
