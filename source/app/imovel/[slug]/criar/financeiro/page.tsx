"use client";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";

import { PaymentFormComponent } from "@/app/imovel/FinancialRecordForm/form";
import { formSchema } from "@/app/imovel/FinancialRecordForm/formSchema";
import { isAuthenticated } from "@/utils/isAuthenticated";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { registerAction } from "@/components/actionRegister";

export default function EditPaymentPage({
  params,
}: {
  params: { slug: string; paymentId: string };
}) {
  const [loading, setloading] = useState(true);
  const [userName, setUserName] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  useEffect(() => {
    const res = localStorage.getItem("user");
    if (!res) {
      redirect("/login");
      return;
    }

    const parsedUser = JSON.parse(res).data.user;

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

  const { toast } = useToast();
  const search = useSearchParams();
  const month = search.get("month");
  const year = search.get("year");

  async function onSubmit({
    observations,
    gas,
    enel,
    rent,
    sabesp,
    condominium,
    statusPropertyTaxIPTU,
    propertyTaxIPTUValue,
    propertyTaxIPTU,
    condominiumValue,
    enelValue,
    extra,
    extraStatus,
    extraValue,
    gasValue,
    rentValue,
    sabespValue,
    statusRent,
    statusCondominium,
    statusExtraConstructions,
    statusSabesp,
    statusEnel,
    statusGas,
    rentPerson,
    condominiumPerson,
    sabespPerson,
    enelPerson,
    gasPerson,
    extraPerson,
    propertyTaxIPTUPerson,
  }: z.infer<typeof formSchema>) {
    const client = createClient();

    const user = localStorage.getItem("user");
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    const success = await registerAction(
      userName.name,
      `Adição de pagamento do imóvel de id ${params.slug}`,
      "adicionar pagamento",
      {
        month,
        year,
        observations,
        propertyTaxIPTU,
        propertyTaxIPTUValue,
        condominiumValue,
        enelValue,
        extra,
        extraStatus,
        extraValue,
        gasValue,
        rentValue,
        sabespValue,
        gas,
        enel,
        rent,
        sabesp,
        condominium,
        estateId: params.slug,
        statusPropertyTaxIPTU,
        statusRent,
        statusCondominium,
        statusExtraConstructions,
        statusSabesp,
        statusEnel,
        statusGas,
        rentPerson,
        condominiumPerson,
        sabespPerson,
        enelPerson,
        gasPerson,
        extraPerson,
        propertyTaxIPTUPerson,
      }
    );

    if (success) {
      toast({
        title: "Solicitação de edição registrada com sucesso!",
        description:
          "O administrador revisará sua solicitação antes da alteração ser aplicada.",
      });
      window.location.href = `/imovel/${params?.slug}/`;
    } else {
      toast({
        title: "Erro ao registrar solicitação de edição",
        variant: "destructive",
      });
    }
    // try {
    //   const { error } = await client
    //     .from("financialRecord")
    //     .insert([
    //       {
    //         month,
    //         year,
    //         observations,
    //         propertyTaxIPTU,
    //         propertyTaxIPTUValue,
    //         condominiumValue,
    //         enelValue,
    //         extra,
    //         extraStatus,
    //         extraValue,
    //         gasValue,
    //         rentValue,
    //         sabespValue,
    //         gas,
    //         enel,
    //         rent,
    //         sabesp,
    //         condominium,
    //         estateId: params.slug,
    //         statusPropertyTaxIPTU,
    //         statusRent,
    //         statusCondominium,
    //         statusExtraConstructions,
    //         statusSabesp,
    //         statusEnel,
    //         statusGas,
    //         rentPerson,
    //         condominiumPerson,
    //         sabespPerson,
    //         enelPerson,
    //         gasPerson,
    //         extraPerson,
    //         propertyTaxIPTUPerson,
    //       },
    //     ])
    //     .select("*");

    //   if (error) {
    //     console.log({ error });
    //     toast({
    //       title: `Erro de criação em pagamento`,
    //       variant: "destructive",
    //     });

    //     return;
    //   }

    //   toast({
    //     title: `Pagamento criado com sucesso!`,
    //   });

    //   window.location.href = `/imovel/${params?.slug}/`;
    // } catch (error) {
    //   console.error(error);
    // }
  }

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-10  w-[100vw]">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-xl font-bold">Adicionar registro de pagamento</h3>
        <div className="flex gap-4 mt-6">
          <p className="text-md font-medium">
            <b>Mes:</b> {month}
          </p>
          <p className="text-md font-medium">
            <b>Ano:</b> {year}
          </p>
        </div>

        <div>
          <PaymentFormComponent onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
