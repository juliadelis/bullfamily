"use client";
import { redirect } from "next/navigation";
import UnidadesLocar from "@/components/home/UnidadesLocar";
import ImoveisIrregulares from "@/components/home/ImoveisIrregulares";
import RelatoriosConteudo from "@/components/home/Relatorios";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import ImoveisVagosHome from "@/components/home/ImoveisVagos";
import { Button, ButtonGroup } from "@mui/material";
import MainTable from "@/components/home/MainTable";

export default function Index() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  if (loading) return <Loading />;
  return (
    <div className="flex w-full">
      <div className="flex flex-col justify-between w-full">
        <div className="py-2 px-4">
          <ButtonGroup
            size="small"
            color={"inherit"}
            variant="text"
            aria-label="Basic button group">
            <Button>Todos os imóveis</Button>
            <Button>Imóveis vagos</Button>
            <Button>Imóveis alugados</Button>
            <Button>A Alugar</Button>
            <Button>Proprietários</Button>
            <Button>Contratos a vencer</Button>
          </ButtonGroup>

          <MainTable />
        </div>
      </div>
    </div>
  );
}
