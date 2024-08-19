"use client";

import RelatoriosConteudo from "@/components/home/Relatorios";
import Loading from "@/components/loading";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

export default function Relatorios(props: Props) {
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
    <div className="p-4 md:p-10  ">
      <div className="bg-white  rounded-md p-6">
        <RelatoriosConteudo botao />
      </div>
    </div>
  );
}
