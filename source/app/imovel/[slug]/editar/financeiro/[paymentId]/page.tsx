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

export default function EditPaymentPage({
  params,
}: {
  params: { slug: string; paymentId: string };
}) {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
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
    try {
      const { error } = await client
        .from("financialRecord")
        .update([
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
          },
        ])
        .select("*")
        // @ts-ignore
        .eq("id", Number(params.paymentId));

      if (error) {
        console.log({ error });
        toast({
          title: `Erro de atualização em pagamento`,
          variant: "destructive",
        });

        return;
      }

      toast({
        title: `Pagamento atualizado com sucesso!`,
      });

      window.location.href = `/imovel/${params?.slug}/`;
    } catch (error) {
      console.error(error);
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
