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
import SubMenu from "@/components/submenu";

export default function Index() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const menuItems = [
    { label: "Todos os imóveis", href: "/" },
    { label: "Imóveis vagos", href: "/relatorios/imoveis-vagos" },
    { label: "Imóveis alugados", href: "/relatorios/imoveis-alugados" },
    { label: "A Alugar", href: "/relatorios/a-alugar" },
    { label: "Proprietários", href: "/relatorios/proprietarios" },
    { label: "Contratos a vencer", href: "/relatorios/contratos-a-vencer" },
  ];

  if (loading) return <Loading />;
  return (
    <div className="flex w-full">
      <div className="flex flex-col justify-between w-full">
        <div className="py-2 px-4">
          <SubMenu menuItems={menuItems} />
          <MainTable />
        </div>
      </div>
    </div>
  );
}
