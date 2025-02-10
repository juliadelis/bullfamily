// @ts-nocheck
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
import { Estate } from "@/@types/estate";
import { inputs } from "./fields";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FieldByType } from "@/components/imoveis/fieldByType";
import { useEffect, useState } from "react";
import { FormatterUtils } from "@/utils/formatter.utils";

interface EstateFormProps {
  estate?: Estate;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
}

export function EstateForm({ onSubmit, estate }: EstateFormProps) {
  const [fields, setFields] = useState(inputs);

  const adjustDateForUTC = (dateString?: string | null) => {
    if (!dateString) return null;
    const localDate = new Date(dateString);
    return isNaN(localDate.getTime())
      ? null
      : new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: estate?.address ? estate.address : "",
      paymentDay: estate?.paymentDay ? String(estate.paymentDay) : "",
      paymentLocation: estate?.paymentLocation ? estate.paymentLocation : "",
      // rentalValue: estate?.rentalValue ? estate.rentalValue : 0,
      numOfRooms: estate?.numOfRooms ? String(estate.numOfRooms) : "",
      cleaningIncluded: estate?.cleaningIncluded
        ? estate.cleaningIncluded
        : false,
      elevator: estate?.elevator ? estate.elevator : false,
      garage: estate?.garage ? estate.garage : false,
      contractWith: estate?.contractWith ? estate.contractWith : "",
      startDate: estate?.startDate
        ? adjustDateForUTC(estate?.startDate)
        : undefined,
      endDate: estate?.endDate ? adjustDateForUTC(estate?.endDate) : undefined,
      unoccupied: estate?.unoccupied
        ? adjustDateForUTC(estate?.unoccupied)
        : undefined,
      readjustmentIndex: estate?.readjustmentIndex
        ? estate.readjustmentIndex
        : "",
      administrator: estate?.administrator ? estate.administrator : "",
      admistratorPhoneNumber: estate?.admistratorPhoneNumber
        ? String(estate.admistratorPhoneNumber)
        : "",
      admistratorEmail: estate?.admistratorEmail ? estate.admistratorEmail : "",
      administrateTax: estate?.administrateTax ? estate.administrateTax : "",
      lessee: estate?.lessee ? estate.lessee : "",
      lesseePhone: estate?.lesseePhone ? String(estate.lesseePhone) : "",
      optionalContactName: estate?.optionalContactName
        ? estate.optionalContactName
        : "",
      optionalContactNumber: estate?.optionalContactNumber
        ? String(estate.optionalContactNumber)
        : "",
      guarantor: estate?.guarantor ? estate.guarantor : "",
      guarnatorData: estate?.guarnatorData ? estate.guarnatorData : "",
      guarnatorNumber: estate?.guarnatorNumber
        ? String(estate?.guarnatorNumber)
        : "",
      condominium: estate?.condominium ? Number(estate.condominium) : 0,
      IPTU: estate?.IPTU ? String(estate.IPTU) : "",
      observation: estate?.observation ? estate.observation : "",
      nickname: estate?.nickname ? estate.nickname : "",
      type: estate?.type ? estate.type : "",
      status: estate?.status ? estate.status : "Status",
      registration: estate?.registration ? String(estate.registration) : "",
      scripture: estate?.scripture ? String(estate.scripture) : "",
      registrationCertification: estate?.registrationCertification
        ? String(estate.registrationCertification)
        : "",
      taxIPTU: estate?.taxIPTU ? Number(estate.taxIPTU) : 0,
      rentValue: estate?.rentValue ? Number(estate.rentValue) : 0,
      gas: estate?.gas ? Number(estate.gas) : 0,
      light: estate?.light ? Number(estate.light) : 0,
      water: estate?.water ? Number(estate.water) : 0,
      lightInformation: estate?.lightInformation ? estate.lightInformation : "",
      waterInformation: estate?.waterInformation ? estate.waterInformation : "",
      contractRegistration: estate?.contractRegistration
        ? estate.contractRegistration
        : "",
      insurance: estate?.insurance ? estate.insurance : "",
      signatureRecognition: estate?.signatureRecognition
        ? estate.signatureRecognition
        : "",
      lawyer: estate?.lawyer ? estate.lawyer : "",
      lawyerData: estate?.lawyerData ? estate.lawyerData : "",
      beforePhoto: estate?.beforePhoto ? estate.beforePhoto : "",
      afterPhoto: estate?.afterPhoto ? estate.afterPhoto : "",
    },
  });

  const statusChanged = form.watch("status");

  useEffect(() => {
    let updatedFields = [...inputs];

    const isStatusWithDate =
      form.getValues("status") !== "Ocioso" &&
      form.getValues("status") !== "Demandas" &&
      form.getValues("status") !== "À venda" &&
      form.getValues("status") !== "Imóvel novo";

    if (!isStatusWithDate) {
      updatedFields = updatedFields.filter(
        (item) => item.name !== "startDate" && item.name !== "endDate"
      );
    }

    if (form.getValues("status") === "Alugado") {
      updatedFields = updatedFields.filter(
        (item) => item.name !== "unoccupied"
      );
    } else {
      if (!updatedFields.some((field) => field.name === "unoccupied")) {
        updatedFields.push(inputs.find((item) => item.name === "unoccupied")!);
      }
    }

    setFields(updatedFields);
  }, [statusChanged]);

  return (
    <FormComponent {...form}>
      <ScrollArea className="">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid-cols-1 md:grid-cols-2 gap-4 grid min-h-screen">
          {fields.map(({ name, label, placeholder, type }) => {
            return (
              <FormField
                control={form.control}
                name={name as keyof typeof estate}
                key={name}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <FieldByType
                          type={type}
                          name={name}
                          field={field}
                          placeholder={placeholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            );
          })}
        </form>
        <Button className="mt-4" onClick={form.handleSubmit(onSubmit)}>
          Salvar
        </Button>
      </ScrollArea>
    </FormComponent>
  );
}
