"use client";
import React, { useEffect, useState } from "react";
import { EstateForm } from "./form";
import { formSchema } from "./formSchema";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import { isAuthenticated } from "@/utils/isAuthenticated";
import Loading from "@/components/loading";

export default function AdicionarImovel() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit({
    IPTU,
    address,
    administrateTax,
    administrator,
    administratorEmail,
    admistratorPhoneNumber,
    cleaningIncluded,
    condominium,
    contractWith,
    elevator,
    endDate,
    garage,
    guarantor,
    guarnatorData,
    guarnatorNumber,
    lessee,
    lesseePhone,
    nickname,
    numOfRooms,
    observation,
    optionalContactName,
    optionalContactNumber,
    paymentDay,
    paymentLocation,
    readjustmentIndex,
    // rentalValue,
    startDate,
    status,
    type,
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
      const { data: estatesData, error } = await client
        .from("estates")
        .insert([
          {
            IPTU,
            address,
            administrateTax,
            administrator,
            admistratorEmail: administratorEmail,
            admistratorPhoneNumber: admistratorPhoneNumber
              ? Number(admistratorPhoneNumber)
              : null,
            cleaningIncluded,
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
            // rentalValue: Number(rentalValue),
            startDate: startDate,
            status,
            type,
            userId: (await client.auth.getUser()).data.user?.id,
            registration: String(registration),
            scripture: String(scripture),
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
          },
        ])
        .select();

      if (error) {
        console.log({ error });
        return;
      }
      toast({
        title: "Imovel adicionado com sucesso!",
      });
      router.replace("/imovel");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao adicionar imovel",
      });
    }
  }

  if (loading) return <Loading />;
  return (
    <div className="flex flex-col p-4 md:p-10  w-full">
      <div className="bg-white p-6 rounded-lg">
        <EstateForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
