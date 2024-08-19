"use client";
import { useEffect, useState } from "react";
import { EstateForm } from "../../adicionar-imovel/form";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Estate } from "@/@types/estate";
import { formSchema } from "../../adicionar-imovel/formSchema";
import { z } from "zod";
import { isAuthenticated } from "@/utils/isAuthenticated";
import Loading from "@/components/loading";

export default function EditEstatePage({
  params,
}: {
  params: { slug: string };
}) {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const [estate, setEstate] = useState<Estate | null>(null);
  const { toast } = useToast();
  const { replace, refresh } = useRouter();

  useEffect(() => {
    const client = createClient();
    client
      .from("estates")
      .select("*")
      .eq("id", params.slug)
      .then(({ data }) => {
        if (data) {
          setEstate(data[0]);
        }
      });
  }, []);

  async function onSubmit({
    nickname,
    elevator,
    admistratorPhoneNumber,
    lessee,
    garage,
    address,
    status,
    type,
    IPTU,
    endDate,
    startDate,
    numOfRooms,
    paymentDay,
    condominium,
    lesseePhone,
    observation,
    // rentalValue,
    contractWith,
    administrator,
    guarantor,
    guarnatorData,
    guarnatorNumber,
    cleaningIncluded,
    administrateTax,
    paymentLocation,
    readjustmentIndex,
    administratorEmail,
    optionalContactName,
    optionalContactNumber,
    registration,
    scripture,
    registrationCertification,
    taxIPTU,
    rentValue,
    gas,
    light,
    water,
    lightInformation,
    waterInformation,
    contractRegistration,
    insurance,
    signatureRecognition,
    lawyer,
    lawyerData,
    beforePhoto,
    afterPhoto,
    unoccupied,
  }: z.infer<typeof formSchema>) {
    const client = createClient();
    try {
      if (!estate?.id) return;

      const { error } = await client
        .from("estates")
        .update({
          IPTU,
          address,
          administrateTax,
          administrator,
          admistratorEmail: administratorEmail,
          cleaningIncluded,
          admistratorPhoneNumber: admistratorPhoneNumber
            ? Number(admistratorPhoneNumber)
            : null,
          condominium,
          contractWith,
          elevator,
          endDate: endDate,
          garage,
          guarantor,
          guarnatorData,
          guarnatorNumber: !guarnatorNumber ? null : Number(guarnatorNumber),
          lessee,
          lesseePhone: lesseePhone ? Number(lesseePhone) : null,
          nickname,
          numOfRooms: Number(numOfRooms),
          observation,
          optionalContactName,
          optionalContactNumber: optionalContactNumber
            ? Number(optionalContactNumber)
            : null,
          paymentDay: Number(paymentDay),
          paymentLocation,
          readjustmentIndex,
          // : Number(rentalValue),rentalValue
          startDate: startDate,
          status,
          type,
          registration: Number(registration),
          scripture,
          registrationCertification,
          taxIPTU: Number(taxIPTU),
          rentValue: Number(rentValue),
          gas: Number(gas),
          light: Number(light),
          water: Number(water),
          lightInformation,
          waterInformation,
          contractRegistration,
          insurance,
          signatureRecognition,
          lawyer,
          lawyerData,
          beforePhoto,
          afterPhoto,
          unoccupied: unoccupied,
        })
        .select("*")
        // @ts-ignore
        .eq("id", Number(estate.id));

      if (error) {
        toast({
          title: `Erro de atualização de imóvel`,
          variant: "destructive",
        });

        return;
      }

      replace(`/imovel/${estate.id}`);
      refresh();
      toast({
        title: `Imóvel atualizado com sucesso!`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) return <Loading />;
  if (!estate) return;

  return (
    <div className="p-10  w-[full]">
      <div className="bg-white p-6 rounded-lg">
        <EstateForm estate={estate} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
