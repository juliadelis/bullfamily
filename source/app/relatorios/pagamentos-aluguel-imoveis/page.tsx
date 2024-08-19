"use client";

import React from "react";

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
import { useState, useEffect } from "react";
import { Estate } from "@/@types/estate";
import { createClient } from "@/utils/supabase/client";
import { FinancialRecord } from "@/components/payments-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BuscarMes from "@/components/imoveis/buscarMes";
import BuscarAno from "@/components/imoveis/buscarAno";
import Loading from "@/components/loading";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";
type FinancialRecorMoreEstate = FinancialRecord & {
  estate: Estate | undefined;
};
function capitalizeFirstLetter(str: string) {
  return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
}

export default function PagementosAlguelImoveis() {
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
  const [filteredEstates, setFilteredEstates] = useState<
    FinancialRecorMoreEstate[] | null
  >(null);
  const [lateEstates, setLateEstates] = useState<
    FinancialRecorMoreEstate[] | null
  >(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
    if (!estates || !payments) return;
    const filtered = payments.map((payment) => {
      if (
        payment &&
        payment.month === selectedMonth &&
        payment.year === selectedYear &&
        payment.statusRent === "Pago em dia"
      ) {
        const estate = estates.find((estate) => payment.estateId === estate.id);
        return { ...payment, estate };
      }
    });
    setFilteredEstates(filtered as FinancialRecorMoreEstate[]);
  }, [estates, payments, selectedMonth, selectedYear]);

  useEffect(() => {
    const filteredLate = payments?.map((payment) => {
      if (
        (payment.statusRent === "Não foi pago" ||
          payment.statusRent === "Pago em atraso") &&
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

  const recievedTotalPaymentMonth = filteredEstates?.reduce(
    (total, estateMoreFinancials) => {
      if (
        !estateMoreFinancials?.estate ||
        estateMoreFinancials?.statusRent === "Não foi pago"
      )
        return total + 0;
      return total + estateMoreFinancials.rentValue;
    },
    0
  );

  const totalReceivedPayment = payments?.reduce((total, payment) => {
    if (!payment.estateId || payment.statusRent === "Não foi pago")
      return total + 0;
    const estate = estates?.find((estate) => estate.id === payment.estateId);
    if (!estate) return total + 0;
    return total + payment.rentValue;
  }, 0);

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

  function formatMoneyBRLTotal(amount: number | null) {
    if (amount === 0 || !amount) {
      return "Sem registro de aluguel";
    }

    const [integerPart, decimalPart] = amount.toFixed(2).split(".");

    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );

    return `R$ ${formattedIntegerPart},${decimalPart}`;
  }

  if (loading) return <Loading />;
  if (!selectedMonth || !selectedYear || !lateEstates || !filteredEstates)
    return <Loading />;

  return (
    <div>
      <div className="flex flex-col p-4 md:p-10 overflow-y-scroll md:w-[100vw]">
        <div className="bg-white p-6 rounded-lg">
          <div className="flex mb-[60px] ">
            <Link href="/relatorios" className="flex items-center">
              <IoArrowBackCircleOutline className="mr-2 h-6 w-6" />
              <h3 className="text-lg">Voltar ao painel de relatórios</h3>
            </Link>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex mb-4">
              <LuFileText className="mr-2 h-6 w-6" />
              <h3 className="font-black  text-lg">
                Pagamentos de aluguel imóveis
              </h3>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-8">
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <h3 className="font-black  text-lg">Selecione o Mês: </h3>
                <p className="text-lg">
                  <BuscarMes
                    value={selectedMonth}
                    onSelected={(month) => {
                      setSelectedMonth(month);
                    }}
                  />
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <h3 className="font-black  text-lg">Selecione o Ano: </h3>
                <p className="text-lg">
                  <BuscarAno
                    value={selectedYear}
                    onSelected={(year) => {
                      setSelectedYear(year);
                    }}
                  />
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xl">Pagamentos aluguel em dia</h3>
              <p>
                Total: {formatMoneyBRLTotal(Number(recievedTotalPaymentMonth))}
              </p>
            </div>

            <div className="flex rounded-md border w-[75vw] h-[30vh] ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-black">
                      Início do contrato
                    </TableHead>
                    <TableHead className="font-black ">Mês</TableHead>
                    <TableHead className="font-black ">Imóvel</TableHead>
                    <TableHead className="text-left font-black w-[300px]">
                      Aluguel
                    </TableHead>
                    <TableHead className="text-left font-black w-[300px]">
                      Recebido total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className=" overflow-scroll">
                  {filteredEstates?.map((item) => {
                    if (!item?.estate) return;
                    return (
                      <TableRow>
                        <TableCell className="">
                          {String(
                            format(item?.estate?.startDate || "", "PPP", {
                              locale: ptBR,
                            })
                          )}
                        </TableCell>
                        <TableCell className="">
                          {capitalizeFirstLetter(String(selectedMonth))}
                        </TableCell>
                        <TableCell className="font-bold">
                          {item?.estate?.nickname}
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
                          {formatMoneyBRL(item?.rentValue)}
                          <br />
                          {item?.rent}
                        </TableCell>

                        <TableCell>
                          {formatMoneyBRL(Number(totalReceivedPayment))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-xl">Pagamentos aluguel em atraso</h3>
            </div>

            <div className="flex rounded-md border w-[75vw] h-[30vh] ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-black">
                      Início do contrato
                    </TableHead>
                    <TableHead className="font-black ">Mês</TableHead>
                    <TableHead className="font-black ">Imóvel</TableHead>
                    <TableHead className="text-left font-black w-[300px]">
                      Aluguel
                    </TableHead>
                    <TableHead className="text-left font-black w-[300px]">
                      Recebido total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className=" overflow-scroll">
                  {lateEstates?.map((item) => {
                    if (!item?.estate) return null;
                    return (
                      <TableRow>
                        <TableCell className="">
                          {String(
                            format(item?.estate?.startDate || "", "PPP", {
                              locale: ptBR,
                            })
                          )}
                        </TableCell>
                        <TableCell className="">
                          {capitalizeFirstLetter(String(selectedMonth))}
                        </TableCell>
                        <TableCell className="font-bold">
                          {item?.estate?.nickname}
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
                          {formatMoneyBRL(item?.rentValue)}
                          <br />
                          {item?.rent}
                        </TableCell>

                        <TableCell>
                          {formatMoneyBRL(Number(totalReceivedPayment))}
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
