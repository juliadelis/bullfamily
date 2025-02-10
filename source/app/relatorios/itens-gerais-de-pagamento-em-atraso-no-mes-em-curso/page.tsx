"use client";

import React, { useEffect, useState } from "react";
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

import { LuFileText } from "react-icons/lu";
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
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";
import "./index.css";
import { FormatterUtils } from "@/utils/formatter.utils";

function capitalizeFirstLetter(str: string) {
  return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
}

export default function ItensMesAtrasoRelatorio() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const [estates, setEstates] = useState<Estate[] | null>();
  const [payments, setPayments] = useState<FinancialRecord[] | null>(null);
  const supabase = createClient();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
        payment.month === selectedMonth &&
        payment.year === selectedYear
      ) {
        const estate = estates?.find(
          (estate) => estate.id === payment.estateId
        );
        return { ...payment, estate };
      }
    });

    setLateEstates(filteredLate as FinancialRecorMoreEstate[]);
  }, [payments, estates, selectedMonth, selectedYear]);

  function formatMoneyBRL(amount: number | null) {
    if (amount === 0 || !amount) {
      return "Valor não inserido";
    }

    const [integerPart, decimalPart] = amount.toFixed(2).split(".");

    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );

    return `R$ ${formattedIntegerPart},${decimalPart}`;
  }
  if (loading) return <Loading />;
  if (!selectedMonth || !selectedYear || !lateEstates) return <Loading />;

  return (
    <div>
      <div className="flex flex-col p-4 ">
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex mb-4">
              <LuFileText className="mr-2 h-4 w-4" />
              <h3 className="font-semibold  text-[12px]">
                Itens gerais de pagamento em atraso
              </h3>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col flex-wrap gap-2 ">
                <h3 className="font-semibold  text-[12px]">
                  Selecione o Mês:{" "}
                </h3>
                <p className="text-[12px]">
                  <BuscarMes
                    value={selectedMonth}
                    onSelected={(month) => {
                      setSelectedMonth(month);
                    }}
                  />
                </p>
              </div>
              <div className="flex flex-col flex-wrap gap-2 ">
                <h3 className="font-semibold  text-[12px]">
                  Selecione o Ano:{" "}
                </h3>
                <p className="text-[12px]">
                  <BuscarAno
                    value={selectedYear}
                    onSelected={(year) => {
                      setSelectedYear(year);
                    }}
                  />
                </p>
              </div>
            </div>

            <div className="flex">
              <Table className="w-full overflow-auto table-bordered">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-normal text-black">
                      Início do contrato
                    </TableHead>
                    <TableHead className="font-normal text-black ">
                      Mês
                    </TableHead>
                    <TableHead className="font-normal text-black ">
                      Imóvel
                    </TableHead>
                    <TableHead className="text-left font-normal text-black w-[300px]">
                      Administração
                    </TableHead>

                    <TableHead className="text-left font-normal text-black w-[200px]">
                      Impost/IPTU
                    </TableHead>
                    <TableHead className="text-left font-normal text-black w-[250px]">
                      Aluguel
                    </TableHead>
                    <TableHead className="text-left font-normal text-black w-[200px]">
                      Condominio
                    </TableHead>
                    <TableHead className="text-left font-normal text-black w-[200px]">
                      Sabesp
                    </TableHead>
                    <TableHead className="text-left font-normal text-black w-[200px]">
                      Enel
                    </TableHead>
                    <TableHead className="text-left font-normal text-black w-[200px]">
                      Gas
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className=" overflow-scroll">
                  {lateEstates?.map((item, i) => {
                    if (!item?.estate) return;
                    return (
                      <TableRow key={i}>
                        <TableCell className="">
                          {item?.estate?.startDate
                            ? FormatterUtils.formatDate(item.estate.startDate)
                            : "Sem registro de data"}
                        </TableCell>
                        <TableCell className="">
                          {capitalizeFirstLetter(String(selectedMonth))}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {item?.estate.nickname}
                        </TableCell>
                        <TableCell>{item?.estate.administrator}</TableCell>
                        <TableCell
                          className={`${
                            item?.statusPropertyTaxIPTU === "Pago em atraso" ||
                            item?.statusPropertyTaxIPTU === "Não foi pago"
                              ? "text-[#BE1A1A]"
                              : item?.statusPropertyTaxIPTU === "Pago em dia"
                              ? "text-[#1B972F]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {formatMoneyBRL(Number(item?.estate.taxIPTU))}
                          <br />
                          {item?.propertyTaxIPTU}
                        </TableCell>
                        <TableCell
                          className={`${
                            item?.statusRent === "Pago em atraso" ||
                            item?.statusRent === "Não foi pago"
                              ? "text-[#BE1A1A]"
                              : item?.statusRent === "Pago em dia"
                              ? "text-[#1B972F]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {formatMoneyBRL(Number(item?.estate.rentalValue))}
                          <br />
                          {item?.rent}
                        </TableCell>
                        <TableCell
                          className={`${
                            item?.statusCondominium === "Pago em atraso" ||
                            item?.statusCondominium === "Não foi pago"
                              ? "text-[#BE1A1A]"
                              : item?.statusCondominium === "Pago em dia"
                              ? "text-[#1B972F]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {formatMoneyBRL(Number(item?.estate.condominium))}
                          <br />
                          {item?.condominium}
                        </TableCell>
                        <TableCell
                          className={`${
                            item?.statusSabesp === "Pago em atraso" ||
                            item?.statusSabesp === "Não foi pago"
                              ? "text-[#BE1A1A]"
                              : item?.statusSabesp === "Pago em dia"
                              ? "text-[#1B972F]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {formatMoneyBRL(Number(item?.estate.water))}
                          <br />
                          {item?.sabesp}
                        </TableCell>
                        <TableCell
                          className={`${
                            item?.statusEnel === "Pago em atraso" ||
                            item?.statusEnel === "Não foi pago"
                              ? "text-[#BE1A1A]"
                              : item?.statusEnel === "Pago em dia"
                              ? "text-[#1B972F]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {formatMoneyBRL(Number(item?.estate.light))}
                          <br />
                          {item?.enel}
                        </TableCell>
                        <TableCell
                          className={`${
                            item?.statusGas === "Pago em atraso" ||
                            item?.statusGas === "Não foi pago"
                              ? "text-[#BE1A1A]"
                              : item?.statusGas === "Pago em dia"
                              ? "text-[#1B972F]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {formatMoneyBRL(Number(item?.estate.gas))}
                          <br />
                          {item?.gas}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
