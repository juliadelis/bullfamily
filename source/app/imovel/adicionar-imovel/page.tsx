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
import { registerAction } from "@/components/actionRegister";

export default function AdicionarImovel() {
  const [loading, setloading] = useState(true);
  const [userName, setUserName] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }

    const parsedUser = JSON.parse(user).data.user;
    const client = createClient();

    client
      .from("profiles")
      .select("*")
      .eq("id", parsedUser.id)
      .then(({ data }) => {
        if (!data) return;
        setUserName(data[0]);
        setloading(false);
      });
  }, []);

  async function onSubmit({
    IPTU,
    address,
    administrateTax,
    administrator,
    admistratorEmail,
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
      const actionRegistered = await registerAction(
        userName.name,
        `Cadastro do imóvel ${nickname}`,
        "adicionar",
        {
          IPTU,
          address,
          administrateTax,
          administrator,
          admistratorEmail: admistratorEmail,
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
        }
      );

      if (!actionRegistered) {
        toast({
          title: "Erro ao solicitar adição",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Solicitação enviada para aprovação!",
        description:
          "O administrador revisará sua solicitação antes da adição ser aplicada.",
      });

      router.replace("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao adicionar imóvel",
        variant: "destructive",
      });
    }
  }

  if (loading) return <Loading />;
  return (
    <div className="flex flex-col p-4 md:p-4 w-full">
      <div className="bg-white rounded-lg">
        <EstateForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
