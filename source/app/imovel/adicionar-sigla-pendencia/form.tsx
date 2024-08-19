import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaAcronym } from "./formSchema";
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
import { pendencyAcronym } from "@/@types/PendencyAcronym";

interface PendencyAcronymForm {
  onSubmit: (data: z.infer<typeof formSchemaAcronym>) => Promise<void>;
  data?: pendencyAcronym;
}

export function PendencyAcronymComponent({
  onSubmit,
  data,
}: PendencyAcronymForm) {
  const form = useForm<z.infer<typeof formSchemaAcronym>>({
    resolver: zodResolver(formSchemaAcronym),
    defaultValues: {
      acronym: data?.acronym ? data.acronym : "",
      description: data?.description ? data?.description : "",
    },
  });

  return (
    <FormComponent {...form}>
      <div className="w-full scroll-smooth">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-y-4 grid grid-cols-2 gap-4
          w-full ">
          {inputs.map(({ name, label, placeholder, type }) => {
            return (
              <FormField
                control={form.control}
                //@ts-ignore
                name={name}
                key={name}
                render={({ field }) => (
                  <FormItem
                    className={`mb-8 col-span-2 ${
                      field.name === "description" ? "col-span-2" : ""
                    }`}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <FieldByType
                        //@ts-ignore
                        type={type}
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
            className="w-fit col-span-2">
            Enviar
          </Button>
        </form>
      </div>
    </FormComponent>
  );
}
