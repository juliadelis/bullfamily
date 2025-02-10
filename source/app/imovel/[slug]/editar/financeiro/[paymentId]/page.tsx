"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

import { z } from "zod";
import { FinancialRecord } from "@/components/payments-table";

import { PaymentFormComponent } from "@/app/imovel/FinancialRecordForm/form";
import { formSchema } from "@/app/imovel/FinancialRecordForm/formSchema";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
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

  const [payment, setPayment] = useState<FinancialRecord | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("financialRecord")
      .select("*")
      .eq("id", Number(params.paymentId))
      .then(({ data, error }) => {
        console.log(error);

        if (!data) return;

        setPayment(data[0]);
      });
  }, []);

  async function onSubmit({
    observations,
    gas,
    enel,
    rent,
    sabesp,
    condominium,
    propertyTaxIPTU,
    statusPropertyTaxIPTU,
    statusRent,
    statusCondominium,
    statusExtraConstructions,
    statusSabesp,
    statusEnel,
    statusGas,
    extraStatus,
    extra,
    extraValue,
    gasValue,
    enelValue,
    sabespValue,
    condominiumValue,
    rentValue,
    propertyTaxIPTUValue,
    rentPerson,
    condominiumPerson,
    sabespPerson,
    enelPerson,
    gasPerson,
    extraPerson,
    propertyTaxIPTUPerson,
  }: z.infer<typeof formSchema>) {
    const client = createClient();

    const success = await registerAction(
      userName.name,
      `Edilção de pagamento do imóvel de id ${params.slug}`,
      "editar pagamento",
      {
        month: payment?.month,
        year: payment?.year,
        observations,
        propertyTaxIPTU,
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
        extraStatus,
        extra,
        extraValue,
        gasValue,
        enelValue,
        sabespValue,
        condominiumValue,
        rentValue,
        propertyTaxIPTUValue,
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
  }
  if (loading) return <Loading />;

  if (!payment) return;

  return (
    <div className="p-4 md:p-10 w-[100vw]">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-lg">Adicionar registro de pagamento</h3>
        <div className="flex gap-4 mt-4">
          <p className="text-md font-medium">
            <b>Mes:</b> {payment.month}
          </p>
          <p className="text-md font-medium">
            <b>Ano:</b> {payment.year}
          </p>
        </div>
        <div>
          <PaymentFormComponent payment={payment} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
