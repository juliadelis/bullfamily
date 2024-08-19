"use client";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { LuFileText } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Estate } from "@/app/imovel/page";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Loading from "@/components/loading";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";

export default function ItensMesRelatorio() {
  const [loading, setloading] = useState(true);
  const [estates, setEstates] = useState<Estate[] | null>();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data }) => {
        if (!data) return;

        setEstates(data);
        const eighteenMonthsAhead = new Date();
        eighteenMonthsAhead.setMonth(eighteenMonthsAhead.getMonth() + 18);

        const filteredEstates = data.filter((estate: Estate) => {
          //@ts-ignore
          const endDate = new Date(estate.endDate);
          return endDate >= new Date() && endDate <= eighteenMonthsAhead;
        });

        setEstates(filteredEstates);
      });
  }, []);

  const calculateTimeLeft = (endDate: Date) => {
    const difference = differenceInDays(new Date(endDate), new Date());
    return difference;
  };

  console.log(estates);

  if (loading) return <Loading />;
  if (!estates) return <Loading />;
  return (
    <div>
      <div className="flex flex-col p-4 md:p-10">
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
                Contratos a vencer nos próximos 18 meses
              </h3>
            </div>
            <div className="flex flex-col justify-between items-end  w-[80vw] md:w-[90VW] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px] font-black">
                      Imóvel
                    </TableHead>
                    <TableHead className="font-black ">Status</TableHead>
                    <TableHead className="font-black ">
                      Data de Início de Contrato
                    </TableHead>
                    <TableHead className="font-black ">
                      Data de Fim de Contrato
                    </TableHead>
                    <TableHead className="font-black ">
                      Tempo para fim de contrato
                    </TableHead>

                    <TableHead className="font-black "></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estates?.map((item) => (
                    <TableRow>
                      <TableCell className="font-medium">
                        {item.nickname}
                      </TableCell>
                      <TableCell className="font-bold">{item.status}</TableCell>
                      <TableCell className="font-bold">
                        {format(String(item.startDate), "PPP", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell className="font-bold">
                        {format(String(item.endDate), "PPP", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell className="font-bold">
                        {calculateTimeLeft(new Date(String(item.endDate)))} dias
                      </TableCell>

                      <TableCell className="font-bold">
                        <Button variant="underline" asChild>
                          <Link href={`/imovel/${item.id}`}>Ver imóvel</Link>
                        </Button>
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
