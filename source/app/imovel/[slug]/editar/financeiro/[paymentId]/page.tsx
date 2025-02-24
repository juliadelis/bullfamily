"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { parseISO, format } from "date-fns";
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

  const adjustDateForUTC = (dateString?: string | null) => {
    if (!dateString) return null;
    const localDate = new Date(dateString);
    return isNaN(localDate.getTime())
      ? null
      : new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];
  };

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    const client = createClient();

    const sanitizeNumber = (value: any) => (value ? Number(value) : null);

    const success = await registerAction(
      userName?.name,
      `Edição de pagamento do imóvel de id ${params.slug}`,
      "editar pagamento",
      {
        id: Number(params.paymentId),
        month: sanitizeNumber(payment?.month),
        year: sanitizeNumber(payment?.year),
        observations: formData.observations || "",
        propertyTaxIPTU: formData.propertyTaxIPTU
          ? adjustDateForUTC(formData.propertyTaxIPTU)
          : null,
        gas: formData?.gas ? adjustDateForUTC(formData.gas) : null,
        enel: formData?.enel ? adjustDateForUTC(formData.enel) : null,
        rent: formData?.rent ? adjustDateForUTC(formData.rent) : null,
        sabesp: formData?.sabesp ? adjustDateForUTC(formData.sabesp) : null,
        condominium: formData.condominium
          ? adjustDateForUTC(formData.condominium)
          : null,
        extra: formData.extra ? adjustDateForUTC(formData.extra) : null,
        estateId: Number(params.slug),
        statusPropertyTaxIPTU: formData.statusPropertyTaxIPTU || "",
        statusRent: formData.statusRent || "",
        statusCondominium: formData.statusCondominium || "",
        statusExtraConstructions: formData.statusExtraConstructions || "",
        statusSabesp: formData.statusSabesp || "",
        statusEnel: formData.statusEnel || "",
        statusGas: formData.statusGas || "",
        extraStatus: formData.extraStatus || "",
        extraValue: sanitizeNumber(formData.extraValue),
        gasValue: sanitizeNumber(formData.gasValue),
        enelValue: sanitizeNumber(formData.enelValue),
        sabespValue: sanitizeNumber(formData.sabespValue),
        condominiumValue: sanitizeNumber(formData.condominiumValue),
        rentValue: sanitizeNumber(formData.rentValue),
        propertyTaxIPTUValue: sanitizeNumber(formData.propertyTaxIPTUValue),
        rentPerson: formData.rentPerson || "",
        condominiumPerson: formData.condominiumPerson || "",
        sabespPerson: formData.sabespPerson || "",
        enelPerson: formData.enelPerson || "",
        gasPerson: formData.gasPerson || "",
        extraPerson: formData.extraPerson || "",
        propertyTaxIPTUPerson: formData.propertyTaxIPTUPerson || "",
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
        <h3 className="text-lg">Editar registro de pagamento</h3>
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
