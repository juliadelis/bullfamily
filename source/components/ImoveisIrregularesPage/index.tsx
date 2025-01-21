"use client";

import React, { useEffect, useMemo, useState } from "react";
type FinancialRecorMoreEstate = FinancialRecord & {
  estate: Estate | undefined;
};
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { LuAlertTriangle, LuFileText } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Estate } from "@/@types/estate";
import { FinancialRecord } from "@/components/payments-table";
import { createClient } from "@/utils/supabase/client";
import BuscarMes from "@/components/imoveis/buscarMes";
import BuscarAno from "@/components/imoveis/buscarAno";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Item } from "@radix-ui/react-select";
import Loading from "@/components/loading";

function capitalizeFirstLetter(str: string) {
  return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
}

const ImoveisIrregularesComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const [estates, setEstates] = useState<Estate[] | null>();
  const [payments, setPayments] = useState<FinancialRecord[] | null>(null);
  const supabase = createClient();
  const [lateEstates, setLateEstates] = useState<
    FinancialRecorMoreEstate[] | null
  >(null);

  useEffect(() => {
    const month = new Date().getMonth();
    setSelectedMonth(month + 1);
  }, []);

  useEffect(() => {
    supabase
      .from("estates")
      .select("*")
      .then(({ data, error }) => {
        if (!data) return;

        setEstates(data);
      });
  }, []);

  useEffect(() => {
    if (!estates) return;

    supabase
      .from("financialRecord")
      .select("*")
      .then(({ data, error }) => {
        console.log(error);

        if (!data) return;

        setPayments(data);
      });
  }, [estates]);
  const months = useMemo(() => {
    return [
      { value: 1, label: "Jan" },
      { value: 2, label: "Fev" },
      { value: 3, label: "Mar" },
      { value: 4, label: "Abr" },
      { value: 5, label: "Mai" },
      { value: 6, label: "Jun" },
      { value: 7, label: "Jul" },
      { value: 8, label: "Ago" },
      { value: 9, label: "Set" },
      { value: 10, label: "Out" },
      { value: 11, label: "Nov" },
      { value: 12, label: "Dez" },
    ];
  }, []);

  useEffect(() => {
    const filteredLate = payments?.map((payment) => {
      if (
        (payment.statusRent === "Não foi pago" ||
          payment.statusRent === "Pago em atraso" ||
          payment.statusCondominium === "Não foi pago" ||
          payment.statusEnel === "Não foi pago" ||
          payment.statusEnel === "Pago em atraso" ||
          payment.statusExtraConstructions === "Pago em atraso" ||
          payment.statusExtraConstructions === "Não foi pago" ||
          payment.statusPropertyTaxIPTU === "Não foi pago" ||
          payment.statusPropertyTaxIPTU === "Pago em atraso" ||
          payment.statusCondominium === "Pago em atraso" ||
          payment.statusSabesp === "Pago em atraso" ||
          payment.statusSabesp === "Não foi pago" ||
          payment.statusGas === "Não foi pago" ||
          payment.statusGas === "Pago em atraso") &&
        selectedMonth &&
        payment.month <= selectedMonth
      ) {
        const estate = estates?.find(
          (estate) => estate.id === payment.estateId
        );
        return { ...payment, estate };
      }
    });

    // Filtrar e classificar os lateEstates
    const sortedLateEstates = (filteredLate || [])
      .filter((item) => item)
      .sort((a, b) => (a ? a.month : 0) - (b ? b.month : 0));

    setLateEstates(sortedLateEstates as FinancialRecorMoreEstate[]);
  }, [payments, estates]);

  return (
    <div className="flex  ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-black ">Ano</TableHead>
            <TableHead className="font-black ">Mês</TableHead>
            <TableHead className="font-black ">Imóvel</TableHead>
            <TableHead className="text-left font-black w-[300px]">
              Administração
            </TableHead>

            <TableHead className="text-left font-black w-[200px]">
              Impost/IPTU
            </TableHead>
            <TableHead className="text-left font-black w-[250px]">
              Aluguel
            </TableHead>
            <TableHead className="text-left font-black w-[200px]">
              Condominio
            </TableHead>
            <TableHead className="text-left font-black w-[200px]">
              Sabesp
            </TableHead>
            <TableHead className="text-left font-black w-[200px]">
              Enel
            </TableHead>
            <TableHead className="text-left font-black w-[200px]">
              Gas
            </TableHead>
            <TableHead className="text-left font-black w-[200px]">
              Extra
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-[40vh] overflow-scroll">
          {lateEstates?.map((item, i) => {
            if (!item?.estate) return;
            return (
              <TableRow key={i}>
                <TableCell className="">
                  {capitalizeFirstLetter(String(item.year))}
                </TableCell>
                <TableCell className="">
                  {capitalizeFirstLetter(String(item.month))}
                </TableCell>
                <TableCell className="font-bold">
                  <Link href={`/imovel/${item?.estate.id}`}>
                    {item?.estate.nickname}
                  </Link>
                </TableCell>
                <TableCell>{item?.estate.administrator}</TableCell>
                <TableCell
                  className={`text-[#CBD5E1] font-semibold ${
                    item.statusPropertyTaxIPTU === "Pago em atraso" ||
                    item.statusPropertyTaxIPTU === "Não foi pago"
                      ? "text-[#BE1A1A]"
                      : item.statusPropertyTaxIPTU === "Pago em dia"
                      ? "text-[#1B972F]"
                      : ""
                  }`}>
                  {item?.statusPropertyTaxIPTU}
                  <br />
                  {item?.propertyTaxIPTU}
                </TableCell>
                <TableCell
                  className={`text-[#CBD5E1] font-semibold ${
                    item.statusRent === "Pago em atraso" ||
                    item.statusRent === "Não foi pago"
                      ? "text-[#BE1A1A]"
                      : item.statusRent === "Pago em dia"
                      ? "text-[#1B972F]"
                      : ""
                  }`}>
                  {item?.statusRent}
                  <br />
                  {item?.rent}
                </TableCell>
                <TableCell
                  className={`text-[#CBD5E1] font-semibold ${
                    item.statusCondominium === "Pago em atraso" ||
                    item.statusCondominium === "Não foi pago"
                      ? "text-[#BE1A1A]"
                      : item.statusCondominium === "Pago em dia"
                      ? "text-[#1B972F]"
                      : ""
                  }`}>
                  {item?.statusCondominium}
                  <br />
                  {item?.condominium}
                </TableCell>
                <TableCell
                  className={`text-[#CBD5E1] font-semibold ${
                    item.statusSabesp === "Pago em atraso" ||
                    item.statusSabesp === "Não foi pago"
                      ? "text-[#BE1A1A]"
                      : item.statusSabesp === "Pago em dia"
                      ? "text-[#1B972F]"
                      : ""
                  }`}>
                  {item?.statusSabesp}
                  <br />
                  {item?.sabesp}
                </TableCell>
                <TableCell
                  className={`text-[#CBD5E1] font-semibold ${
                    item.statusEnel === "Pago em atraso" ||
                    item.statusEnel === "Não foi pago"
                      ? "text-[#BE1A1A]"
                      : item.statusEnel === "Pago em dia"
                      ? "text-[#1B972F]"
                      : ""
                  }`}>
                  {item?.statusEnel}
                  <br />
                  {item?.enel}
                </TableCell>
                <TableCell
                  className={`text-[#CBD5E1] font-semibold ${
                    item.statusGas === "Pago em atraso" ||
                    item.statusGas === "Não foi pago"
                      ? "text-[#BE1A1A]"
                      : item.statusGas === "Pago em dia"
                      ? "text-[#1B972F]"
                      : ""
                  }`}>
                  {item?.statusGas}
                  <br />
                  {item?.gas}
                </TableCell>
                <TableCell
                  className={`text-[#CBD5E1] font-semibold ${
                    item.statusExtraConstructions === "Pago em atraso" ||
                    item.statusExtraConstructions === "Não foi pago"
                      ? "text-[#BE1A1A]"
                      : item.statusExtraConstructions === "Pago em dia"
                      ? "text-[#1B972F]"
                      : ""
                  }`}>
                  {item?.statusExtraConstructions}
                  <br />
                  {item?.extraConstructions}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ImoveisIrregularesComponent;
