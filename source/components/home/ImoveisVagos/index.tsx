"use client";
import React, { useEffect, useState } from "react";

import { LuAlertTriangle } from "react-icons/lu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ImoveisIrregularesComponent from "@/components/ImoveisIrregularesPage";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import Loading from "@/components/loading";
import { EstateLike } from "@/app/imovel/page";

const ImoveisVagosHome = () => {
  const [estates, setEstates] = useState<EstateLike[] | null>();

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

  if (!estates) return;
  return (
    <div className="flex flex-col mb-5 md:mb-[70px] bg-white p-6 rounded-lg">
      <div className="flex flex-col gap-4">
        <Link className="flex" href="/relatorios/imoveis-vagos-neste-mes">
          <LuAlertTriangle className="mr-2 h-6 w-6" />
          <h3 className="font-black  text-lg">Imóveis vagos neste mês</h3>
        </Link>

        <div className="flex flex-col justify-between items-end ">
          <ScrollArea className="border rounded-md w-[80vw]  md:w-[50vw] h-[50vh] md:h-[30vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px] font-black">Imóvel</TableHead>
                  <TableHead className="font-black ">Status</TableHead>

                  <TableHead className="font-black w-[20%]"></TableHead>
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
                      <Button variant="underline" asChild>
                        <Link href={`/imovel/${item.id}`}>Ver imóvel</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ImoveisVagosHome;
