"use client";

import React from "react";

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
import { useState, useEffect } from "react";
import { Estate } from "@/@types/estate";
import { createClient } from "@/utils/supabase/client";
import { FinancialRecord } from "@/components/payments-table";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BuscarMes from "@/components/imoveis/buscarMes";
import BuscarAno from "@/components/imoveis/buscarAno";
import Loading from "@/components/loading";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";
import "./index.css";
import { FormatterUtils } from "@/utils/formatter.utils";
import { MenuItem, Select } from "@mui/material";

function capitalizeFirstLetter(str: string) {
  return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
}

export default function ItensMesPagamentoRelatorio() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const [estates, setEstates] = useState<Estate[] | null>();
  const [payments, setPayments] = useState<FinancialRecord[] | null>(null);
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);
  const [filteredPayments, setFilteredPayments] = useState<
    FinancialRecorMoreEstate[] | null
  >(null);
  const supabase = createClient();
  const [filteredEstates, setFilteredEstates] = useState<
    FinancialRecorMoreEstate[] | null
  >(null);

  useEffect(() => {
    supabase
      .from("estates")
      .select("*")
      .then(({ data, error }) => {
        if (!data) return;

        const sortedEstates = data.sort((a, b) => a.id - b.id);
        setEstates(sortedEstates);
      });
  }, []);

  useEffect(() => {
    if (!selectedEstate) return;

    supabase
      .from("financialRecord")
      .select("*")
      .then(({ data, error }) => {
        if (data) setPayments(data);
      });
  }, [selectedEstate]);

  useEffect(() => {
    if (!selectedEstate || !payments) return;

    const filtered = payments
      .filter((payment) => payment.estateId === selectedEstate.id)
      .filter(
        (payment) =>
          new Date(payment.year, payment.month - 1) >=
          new Date(selectedEstate.startDate)
      )
      .map((payment) => ({ ...payment, estate: selectedEstate }))
      .sort((a, b) => {
        // Explicitly convert year and month to numbers
        const yearA = Number(a.year);
        const monthA = Number(a.month) - 1;
        const yearB = Number(b.year);
        const monthB = Number(b.month) - 1;

        // Check if the conversion resulted in valid numbers
        if (isNaN(yearA) || isNaN(monthA) || isNaN(yearB) || isNaN(monthB)) {
          return 0; // If any value is NaN, keep the original order
        }

        const dateA = new Date(yearA, monthA);
        const dateB = new Date(yearB, monthB);

        return dateB.getTime() - dateA.getTime();
      });

    setFilteredPayments(filtered);
  }, [selectedEstate, payments]);

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

  return (
    <div>
      <div className="flex flex-col p-4 ">
        <div className="bg-white rounded-lg">
          <div className="flex flex-col gap-2">
            <div className="flex mb-4">
              <LuFileText className="mr-2 h-4 w-4" />
              <h3 className=" font-semibold  text-[12px]">
                Pagamentos feitos por unidade desde o contrato até o momento
              </h3>
            </div>

            <div className="flex md:gap-4 gap-1 flex-wrap mb-4">
              <div className="flex flex-wrap flex-col gap-2">
                <h3 className="font-semibold  text-[12px]">
                  Selecione o Imóvel:
                </h3>

                <Select
                  className="text-[12px] w-[300px] normal-case"
                  size="small"
                  onChange={(e) => {
                    const estate = estates?.find(
                      (estate) => estate.id === e.target.value
                    );
                    setSelectedEstate(estate || null);
                  }}
                  label="Escolha um imóvel">
                  {estates?.map((estate) => (
                    <MenuItem
                      className="text-[12px] normal-case"
                      key={estate.id}
                      value={estate.id}>
                      {estate.nickname}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex">
              <Table className="w-full overflow-auto table-bordered">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-normal text-black w-[150px]">
                      Início do contrato
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
                  </TableRow>
                </TableHeader>
                <TableBody className="h-fit overflow-scroll">
                  {filteredPayments?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="">
                        {selectedEstate?.startDate
                          ? FormatterUtils.formatDate(selectedEstate?.startDate)
                          : "Sem registro de data"}
                      </TableCell>

                      <TableCell>{selectedEstate?.administrator}</TableCell>
                      <TableCell
                        className={`${
                          item?.statusPropertyTaxIPTU === "Pago em atraso" ||
                          item?.statusPropertyTaxIPTU === "Não foi pago"
                            ? "text-[#BE1A1A]"
                            : item?.statusPropertyTaxIPTU === "Pago em dia"
                            ? "text-[#1B972F]"
                            : "text-[#CBD5E1]"
                        }`}>
                        {formatMoneyBRL(Number(selectedEstate?.taxIPTU))}
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
                        {formatMoneyBRL(Number(selectedEstate?.rentalValue))}
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
                        {formatMoneyBRL(Number(selectedEstate?.condominium))}
                        <br />
                        {item.condominium}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
