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
import { useState, useEffect } from "react";
import { Estate } from "@/@types/estate";
import { createClient } from "@/utils/supabase/client";
import { FinancialRecord } from "@/components/payments-table";
import BuscarMes from "@/components/imoveis/buscarMes";
import BuscarAno from "@/components/imoveis/buscarAno";
import Loading from "@/components/loading";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";
import "./index.css";

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
      .eq("status", "Alugado")
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
        payment.year === selectedYear
      ) {
        const estate = estates.find((estate) => payment.estateId === estate.id);

        return { ...payment, estate };
      }
    });

    setFilteredEstates(filtered as FinancialRecorMoreEstate[]);
  }, [estates, payments, selectedMonth, selectedYear]);

  const expectedTotalPayment = filteredEstates?.reduce(
    (total, estateMoreFinancials) => {
      if (!estateMoreFinancials?.estate?.rentValue) return total;
      return total + Number(estateMoreFinancials.estate.rentValue);
    },
    0
  );

  const recievedTotalPayment = filteredEstates?.reduce(
    (total, estateMoreFinancials) => {
      if (
        !estateMoreFinancials?.estate?.rentValue ||
        estateMoreFinancials?.statusRent === "Não foi pago"
      )
        return total;
      return total + Number(estateMoreFinancials.rentValue || 0);
    },
    0
  );

  const totalLosses =
    Number(expectedTotalPayment || 0) - Number(recievedTotalPayment || 0);

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

  if (loading) return <Loading />;
  if (!selectedMonth || !selectedYear || !lateEstates || !filteredEstates)
    return <Loading />;

  return (
    <div>
      <div className="flex flex-col p-4 ">
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex mb-4">
              <LuFileText className="mr-2 h-4 w-4" />
              <h3 className="font-semibold  text-[12px]">Receita prevista</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
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
              <div className="flex flex-col gap-2 flex-wrap ">
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

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex gap-2">
                <h3 className="text-[12px]">Ganhos esperados totais:</h3>
                <p className="text-[12px] font-semibold">
                  R${" "}
                  {expectedTotalPayment?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  }) || "0,00"}
                </p>
              </div>
              <div className="flex gap-2">
                <h3 className="text-[12px]">Ganhos recebidos totais:</h3>
                <p className="text-[12px] font-semibold">
                  R${" "}
                  {recievedTotalPayment?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  }) || "0,00"}
                </p>
              </div>
              <div className="flex gap-2">
                <h3 className="text-[12px]">Perdas totais:</h3>
                <p className="text-[12px] font-semibold">
                  R$
                  {totalLosses.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div>
              <Table className="w-full overflow-auto table-bordered">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-normal text-black w-[400px]">
                      Imóvel
                    </TableHead>
                    <TableHead className="font-normal text-black">
                      Proprietário
                    </TableHead>
                    <TableHead className="font-normal text-black ">
                      Ganhos esperados
                    </TableHead>
                    <TableHead className="font-normal text-black ">
                      Ganhos recebidos
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className=" overflow-scroll">
                  {filteredEstates?.map((item, i) => {
                    if (!item?.estate) return;
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-bold">
                          <Link href={`/imovel/${item?.estate.id}`}>
                            {item?.estate?.nickname}
                          </Link>
                        </TableCell>
                        <TableCell className="font-bold">
                          {item?.estate?.proprietary}
                        </TableCell>
                        <TableCell className="">
                          R$ {item.estate.rentValue}
                        </TableCell>
                        <TableCell className="">
                          {!item.rentValue
                            ? "Não existem registros"
                            : "R$" + item.statusRent.trim() === "Não foi pago"
                            ? 0
                            : item.rentValue}
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
