import React from "react";

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

const ImoveisIrregularesHome = () => {
  return (
    <div className="flex flex-col bg-white p-6 rounded-lg">
      <div className="flex flex-col gap-4">
        <Link className="flex" href="/inadimplentes">
          <LuAlertTriangle className="mr-2 h-6 w-6 text-[#BE1A1A]" />

          <h3 className="font-black text-[#BE1A1A] text-lg">
            Imóveis Inadimplentes
          </h3>
        </Link>

        <ScrollArea className="flex flex-col justify-between border rounded-md h-[50vh] md:h-[30vh] w-[80vw] md:w-[50vw] overflow-hidden  ">
          <ImoveisIrregularesComponent />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default ImoveisIrregularesHome;
