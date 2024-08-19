"use client";
import { redirect } from "next/navigation";
import UnidadesLocar from "@/components/home/UnidadesLocar";
import ImoveisIrregulares from "@/components/home/ImoveisIrregulares";
import RelatoriosConteudo from "@/components/home/Relatorios";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import ImoveisVagosHome from "@/components/home/ImoveisVagos";

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
      <div className="flex flex-col md:flex-row w-[100vw] justify-between p-4  md:p-0">
        <div className="flex flex-col items-start w-full md:w-[60%]  gap-5 md:p-10">
          <UnidadesLocar />
          <ImoveisIrregulares />
          <ImoveisVagosHome />
        </div>
        <div className="flex rounded-lg w-[100%] md:rounded-none md:w-[40%] bg-[#F4F4F4] p-10">
          <RelatoriosConteudo />
        </div>
      </div>
    </div>
  );
}
