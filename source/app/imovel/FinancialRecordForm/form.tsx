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
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FinancialRecord } from "@/components/payments-table";

interface PaymentForm {
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  payment?: FinancialRecord;
}

export function PaymentFormComponent({ onSubmit, payment }: PaymentForm) {
  const defaultDate = undefined;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gas: payment?.gas ?? "",
      enel: payment?.enel ?? "",
      rent: payment?.rent ?? "",
      propertyTaxIPTU: payment?.propertyTaxIPTU ?? "",
      sabesp: payment?.sabesp ?? "",
      condominium: payment?.condominium ?? "",
      observations: payment?.observations ? payment?.observations : "",
      statusPropertyTaxIPTU: payment?.statusPropertyTaxIPTU
        ? payment?.statusPropertyTaxIPTU
        : "",
      statusRent: payment?.statusRent ? payment?.statusRent : "",
      statusCondominium: payment?.statusCondominium
        ? payment?.statusCondominium
        : "",
      statusSabesp: payment?.statusSabesp ? payment?.statusSabesp : "",
      statusEnel: payment?.statusEnel ? payment?.statusEnel : "",
      statusGas: payment?.statusGas ? payment?.statusGas : "",
      extraStatus: payment?.extraStatus ? payment?.extraStatus : "",
      propertyTaxIPTUValue: payment?.propertyTaxIPTUValue
        ? payment?.propertyTaxIPTUValue
        : 0,
      rentValue: payment?.rentValue ? payment?.rentValue : 0,
      condominiumValue: payment?.condominiumValue
        ? payment?.condominiumValue
        : 0,
      sabespValue: payment?.sabespValue ? payment?.sabespValue : 0,
      enelValue: payment?.enelValue ? payment?.enelValue : 0,
      gasValue: payment?.gasValue ? payment?.gasValue : 0,
      extraValue: payment?.extraValue ? payment?.extraValue : 0,
      extra: payment?.extra ?? "",
      rentPerson: payment?.rentPerson ? payment?.rentPerson : "",
      condominiumPerson: payment?.condominiumPerson
        ? payment?.condominiumPerson
        : "",
      sabespPerson: payment?.sabespPerson ? payment?.sabespPerson : "",
      enelPerson: payment?.enelPerson ? payment?.enelPerson : "",
      gasPerson: payment?.gasPerson ? payment?.gasPerson : "",
      extraPerson: payment?.extraPerson ? payment?.extraPerson : "",
      propertyTaxIPTUPerson: payment?.propertyTaxIPTUPerson
        ? payment?.propertyTaxIPTUPerson
        : "",
    },
  });

  return (
    <FormComponent {...form}>
      <ScrollArea className="p-16 pl-0  ">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-y-4 grid grid-cols-2  md:grid-cols-2 gap-4">
          {inputs.map(({ name, label, placeholder, type }) => {
            return (
              <FormField
                control={form.control}
                //@ts-ignore
                name={name}
                key={name}
                render={({ field }) => (
                  <FormItem
                    className={`mb-8 col-span-2 md:col-span-1 ${
                      field.name === "observations" ? "col-span-2" : ""
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
            className="w-[100%] col-span-2">
            Enviar
          </Button>
        </form>
      </ScrollArea>
    </FormComponent>
  );
}
