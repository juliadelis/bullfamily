"use client";

import React, { useEffect, useState } from "react";
import { useParams, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Loading from "@/components/loading";
import { Estate } from "@/@types/estate";
import { ImovelHistory } from "@/components/imoveis/ImovelHistoryTable copy/types";
import { FinancialRecord } from "@/components/payments-table";
import { pendencyState } from "@/@types/PendencyState";
import { EstateMobilLayout } from "@/components/imoveis/screens/Mobile";
import { DesktopEstateLayout } from "@/components/imoveis/screens/Desktop";
import { z } from "zod";
import { formSchemaHistory } from "../HistoryForm/formSchema";

export default function PageImovel() {
  const params = useParams();
  const slug = params?.slug as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [estate, setEstate] = useState<Estate | null>(null);
  const [estateHistory, setEstateHistory] = useState<ImovelHistory[] | null>(
    null
  );
  const [payments, setPayments] = useState<FinancialRecord[] | null>(null);
  const [pendencies, setPendencies] = useState<pendencyState[] | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!slug) return;

    supabase
      .from("estates")
      .select("*")
      .eq("id", slug)
      .then(({ data, error }) => {
        if (error) console.log(error);
        if (data) setEstate(data[0] as Estate);
      });
  }, [slug]); // 🔄 Dependência correta

  useEffect(() => {
    if (!estate) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("historys")
        .select("*", { count: "exact" })
        .eq("estate_id", estate.id)
        .limit(1000);

      if (error) {
        console.error("Erro ao buscar histórico:", error);
        return;
      }

      console.log("Histórico recebido:", data);
      setEstateHistory(data);
    };

    fetchHistory();
  }, [estate]);

  useEffect(() => {
    if (!estate) return;

    supabase
      .from("financialRecord")
      .select("*")
      .eq("estateId", estate.id)
      .eq("year", year)
      .then(({ data, error }) => {
        if (error) console.log(error);
        if (data) setPayments(data);
      });

    supabase
      .from("pendencyState")
      .select("*")
      .eq("idState", estate.id)
      .then(({ data, error }) => {
        if (error) console.log(error);
        if (data) setPendencies(data);
      });
  }, [estate, year]);

  const nextYear = () => setYear(year + 1);
  const lastYear = () => setYear(year - 1);

  const onSubmitHistory = async ({
    data,
  }: z.infer<typeof formSchemaHistory>) => {
    const { error } = await supabase
      .from("historys")
      .insert([{ data, estate_id: estate?.id }]);

    if (error) {
      console.error({ error });
      return;
    }

    window.location.reload();
  };

  if (loading || !estate || !estateHistory || !payments || !pendencies)
    return <Loading />;

  return (
    <div className="flex flex-col w-full">
      <EstateMobilLayout
        slug={slug}
        estate={estate}
        estateHistory={estateHistory}
        lastYear={lastYear}
        nextYear={nextYear}
        year={year}
        onSubmitHistory={onSubmitHistory}
        payments={payments}
        pendencies={pendencies}
      />
      <DesktopEstateLayout
        slug={slug}
        estate={estate}
        estateHistory={estateHistory}
        lastYear={lastYear}
        nextYear={nextYear}
        year={year}
        onSubmitHistory={onSubmitHistory}
        payments={payments}
        pendencies={pendencies}
      />
    </div>
  );
}
