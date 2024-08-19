"use client";

import React, { useEffect, useRef, useState } from "react";

import { IoArrowBackCircleOutline } from "react-icons/io5";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import ImovelTable from "@/components/imoveis/ImovelTable";
import { Estate } from "@/@types/estate";
import Loading from "@/components/loading";
import ImovelHistoryTable from "@/components/imoveis/ImovelHistoryTable copy";
import { ImovelHistory } from "@/components/imoveis/ImovelHistoryTable copy/types";
import { FinancialRecord, PaymentTable } from "@/components/payments-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { HistoryFormComponent } from "../HistoryForm/form";
import { formSchemaHistory } from "../HistoryForm/formSchema";
import { redirect } from "next/navigation";
import ImoveisListInterna from "@/components/imoveis/imovelListInterna";
import { pendencyState } from "@/@types/PendencyState";
import { EstateMobilLayout } from "@/components/imoveis/screens/Mobile";
import { DesktopEstateLayout } from "@/components/imoveis/screens/Desktop";
import { ImoveisListInternaPagination } from "@/components/imoveis/ImoveisListInternaPagination";
import { isObserver } from "@/utils/isObserver";

export default function pageImovel({ params }: { params: { slug: string } }) {
  const [loading, setloading] = useState(true);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [estate, setEstate] = useState<Estate | null>();

  const supabase = createClient();
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
    setloading(false);
  }, []);

  useEffect(() => {
    supabase
      .from("estates")
      .select("*")
      .eq("id", params.slug)
      .then(({ data, error }) => {
        if (error) console.log(error);

        if (!data) return;
        setEstate(data[0] as Estate);
      });
  }, []);

  useEffect(() => {
    if (!estate) return;

    supabase
      .from("historys")
      .select("*")
      .eq("estate_id", estate?.id)
      .then(({ data, error }) => {
        if (error) console.log(error);

        if (!data) return;
        setEstateHistory(data);
      });
  }, [estate]);

  const nextYear = () => {
    setYear(year + 1);
  };

  const lastYear = () => {
    setYear(year - 1);
  };

  useEffect(() => {
    if (!estate) return;

    supabase
      .from("financialRecord")
      .select("*")
      .eq("estateId", estate?.id)
      .eq("year", year)
      .then(({ data, error }) => {
        if (error) console.log(error);

        if (!data) return;

        setPayments(data);
      });

    supabase
      .from("pendencyState")
      .select("*")
      .eq("idstate", estate?.id)
      .then(({ data, error }) => {
        if (error) console.log(error);

        if (!data) return;
        setPendencies(data);
      });
  }, [estate, year]);

  const onSubmitHistory = async ({
    data,
  }: z.infer<typeof formSchemaHistory>) => {
    const { error, data: responseData } = await supabase
      .from("historys")
      .insert([
        {
          data,
          estate_id: estate?.id,
        },
      ]);

    if (error) {
      console.error({ error });
      return;
    }

    window.location.reload();
  };

  if (loading || !estate || !estateHistory || !payments || !pendencies)
    return <Loading />;

  return (
    <div className="flex flex-col min-w-[100vw] w-[100vw]">
      <div className="p-10 mb-[300px]">
        <div className="mb-4">
          <Link className="flex" href="/imovel/">
            <IoArrowBackCircleOutline className="mr-2 h-6 w-6" />
            <h3 className="text-lg">Voltar</h3>
          </Link>
        </div>
        <EstateMobilLayout
          slug={params.slug}
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
          slug={params.slug}
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
      <ImoveisListInterna />
      <ImoveisListInternaPagination />
    </div>
  );
}
