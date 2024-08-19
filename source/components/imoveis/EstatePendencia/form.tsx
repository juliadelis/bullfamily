import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./formSchema";
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

interface PendencyAcronymForm {
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  data?: pendencyState;
}

export function PendencyStatemComponent({
  onSubmit,
  data,
}: PendencyAcronymForm) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEstate: data?.nameEstate ? data.nameEstate : "",
      pendency_acronym: data?.pendency_acronym ? data?.pendency_acronym : "",
      date: data?.date ? new Date(data.date) : new Date(0),
    },
  });

  return (
    <FormComponent {...form}>
      <div className="w-full scroll-smooth">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-y-4 grid grid-cols-2 gap-4
           w-full">
          {inputs.map(({ name, label, placeholder, type }) => {
            return (
              <FormField
                control={form.control}
                //@ts-ignore
                name={name}
                key={name}
                render={({ field }) => (
                  <FormItem
                    className={`mb-8 col-span-1${
                      field.name === "date" ? "ml-0" : ""
                    }`}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <FieldByType
                        //@ts-ignore
                        type={type}
                        name={name}
                        field={field}
                        placeholder={placeholder}
                        className={`${field.name === "date" ? "ml-0" : ""}`}
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
            className="w-fit col-span-2">
            Enviar
          </Button>
        </form>
      </div>
    </FormComponent>
  );
}
