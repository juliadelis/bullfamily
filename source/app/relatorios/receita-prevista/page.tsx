"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { LuFileText } from "react-icons/lu";
import { createClient } from "@/utils/supabase/client";
import { FinancialRecord } from "@/components/payments-table";
import Loading from "@/components/loading";
import "./index.css";

import { Estate } from "@/@types/estate";

type FinancialRecorMoreEstate = FinancialRecord & {
  estate: Estate | undefined;
};

export default function ReceitaPrevistaImoveis() {
  const [loading, setLoading] = useState(true);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [payments, setPayments] = useState<FinancialRecord[]>([]);
  const [filteredEstates, setFilteredEstates] = useState<any>([]);
  const supabase = createClient();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expectedTotalPayment, setExpectedTotalPayment] = useState(0);
  const [receivedTotalPayment, setReceivedTotalPayment] = useState(0);
  const [totalLosses, setTotalLosses] = useState(0);

  useEffect(() => {
    const fetchEstates = async () => {
      const { data, error } = await supabase
        .from("estates")
        .select("*")
        .eq("status", "Alugado");
      if (error) {
        console.error("Erro ao buscar imóveis:", error);
        return;
      }
      setEstates(data || []);
    };

    fetchEstates();
  }, []);

  useEffect(() => {
    if (estates.length === 0) return;

    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("financialRecord")
        .select("*");
      if (error) {
        console.error("Erro ao buscar pagamentos:", error);
        return;
      }
      setPayments(data || []);
      setLoading(false);
    };

    fetchPayments();
  }, [estates]);

  useEffect(() => {
    if (
      !startDate ||
      !endDate ||
      payments.length === 0 ||
      estates.length === 0
    ) {
      setFilteredEstates([]);
      setExpectedTotalPayment(0);
      setReceivedTotalPayment(0);
      setTotalLosses(0);
      return;
    }

    console.log("Filtrando dados entre:", startDate, "e", endDate);

    const [startYear, startMonth] = startDate.split("-").map(Number);
    const [endYear, endMonth] = endDate.split("-").map(Number);

    const filtered = payments
      .filter((payment) => {
        const paymentMonth = Number(payment.month);
        const paymentYear = Number(payment.year);

        return (
          (paymentYear > startYear ||
            (paymentYear === startYear && paymentMonth >= startMonth)) &&
          (paymentYear < endYear ||
            (paymentYear === endYear && paymentMonth <= endMonth))
        );
      })
      .map((payment) => {
        const estate = estates.find((estate) => payment.estateId === estate.id);
        return {
          ...payment,
          estate,
          estateName: estate?.nickname || "",
          owner: estate?.proprietary || "",
          expectedEarnings: estate?.rentValue || 0,
          receivedEarnings:
            payment.statusRent === "Não foi pago" ? 0 : payment.rentValue || 0,
        };
      });

    // Agrupar por imóvel e somar ganhos esperados e ganhos recebidos
    const groupedEstates = filtered.reduce((acc, item) => {
      if (!item.estate) return acc;

      const key = item.estate.id;
      if (!acc[key]) {
        acc[key] = {
          estateName: item.estateName,
          owner: item.owner,
          expectedEarnings: 0,
          receivedEarnings: 0,
        };
      }

      acc[key].expectedEarnings += Number(item.expectedEarnings);
      acc[key].receivedEarnings += Number(item.receivedEarnings);

      return acc;
    }, {} as Record<string, { estateName: string; owner: string; expectedEarnings: number; receivedEarnings: number }>);

    const groupedArray = Object.values(groupedEstates);

    // Calcular os totais
    const totalExpected = groupedArray.reduce(
      (sum, item) => sum + item.expectedEarnings,
      0
    );
    const totalReceived = groupedArray.reduce(
      (sum, item) => sum + item.receivedEarnings,
      0
    );
    const totalLoss = totalExpected - totalReceived;

    setFilteredEstates(groupedArray);
    setExpectedTotalPayment(totalExpected);
    setReceivedTotalPayment(totalReceived);
    setTotalLosses(totalLoss);
  }, [payments, startDate, endDate, estates]);

  useEffect(() => {
    console.log("Imóveis carregados:", estates);
  }, [estates]);

  useEffect(() => {
    console.log("Pagamentos carregados:", payments);
  }, [payments]);

  useEffect(() => {
    console.log("Dados filtrados:", filteredEstates);
  }, [filteredEstates]);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <LuFileText className="h-4 w-4" />
          <h3 className="font-semibold text-sm">Receita prevista</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-[12px]">Data de início do filtro:</h3>
            <input
              type="month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded text-[12px]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-[12px]">Data de fim do filtro:</h3>
            <input
              type="month"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded text-[12px]"
            />
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
              {receivedTotalPayment?.toLocaleString("pt-BR", {
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

        <Table className="w-full overflow-auto table-bordered">
          <TableHeader>
            <TableRow>
              <TableHead>Imóvel</TableHead>
              <TableHead>Proprietário</TableHead>
              <TableHead>Ganhos esperados</TableHead>
              <TableHead>Ganhos recebidos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEstates?.map(
              (
                item: {
                  estateName:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined;
                  owner:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined;
                  expectedEarnings: number;
                  receivedEarnings: number;
                },
                i: React.Key | null | undefined
              ) => (
                <TableRow key={i}>
                  <TableCell>{item.estateName}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>R$ {item.expectedEarnings.toFixed(2)}</TableCell>
                  <TableCell>R$ {item.receivedEarnings.toFixed(2)}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
