"use client";
import React, { useEffect, useState } from "react";

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
import { createClient } from "@/utils/supabase/client";
import { differenceInDays, format } from "date-fns";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import Loading from "@/components/loading";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";
import { Estate } from "@/@types/estate";
import { ptBR } from "date-fns/locale";

export default function ItensMesRelatorio() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const [estates, setEstates] = useState<Estate[] | null>();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data, error }) => {
        console.log(error);

        if (!data) return;

        setEstates(data);

        const filteredEstates = data.filter(
          (estate) =>
            estate.status.toLowerCase() === "desocupado" ||
            estate.status === "À venda" ||
            estate.status.toLowerCase() === "em construção" ||
            estate.status === "Imóvel novo" ||
            estate.status === "Em construção" ||
            estate.status === "Em reforma"
        );
        setEstates(filteredEstates);
      });
  }, []);

  const calculateTimeLeft = (endDate: Date) => {
    const difference = differenceInDays(new Date(endDate), new Date());
    return Math.abs(difference);
  };

  if (loading) return <Loading />;

  if (!estates) return <Loading />;

  return (
    <div>
      <div className="flex flex-col p-4 md:p-10 mb-[100px]">
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
              <h3 className="font-black  text-lg">Imóveis vagos neste mês</h3>
            </div>
            <div className="flex flex-col justify-between items-end ">
              <div className="border rounded-md w-[80vw]  md:w-[90vw] ">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px] font-black">
                        Imóvel
                      </TableHead>
                      <TableHead className="font-black ">Status</TableHead>

                      <TableHead className="font-black ">
                        Desocupado desde
                      </TableHead>

                      <TableHead className="font-black ">
                        Dias desocupados
                      </TableHead>

                      <TableHead className="font-black w-[20%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estates?.map((item) => (
                      <TableRow>
                        <TableCell className="font-medium">
                          {item.nickname}
                        </TableCell>
                        <TableCell className="font-bold">
                          {item.status}
                        </TableCell>
                        <TableCell className="font-bold">
                          {item.unoccupied &&
                          item.unoccupied !== new Date("1970-01-01")
                            ? format(String(item.unoccupied), "PPP", {
                                locale: ptBR,
                              })
                            : item.unoccupied === new Date("1970-01-01")
                            ? "Não existe data de desocupação"
                            : "Não existe data de desocupação"}
                        </TableCell>
                        <TableCell className="font-bold text-[#BE1A1A]">
                          {item.unoccupied
                            ? calculateTimeLeft(
                                new Date(String(item.endDate))
                              ) + " dias"
                            : "Não existe data de desocupação"}
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
    </div>
  );
}
