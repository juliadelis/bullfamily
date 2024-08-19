"use client";

import ImoveisIrregularesComponent from "@/components/ImoveisIrregularesPage";

import Loading from "@/components/loading";
import { isAuthenticated } from "@/utils/isAuthenticated";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { LuAlertTriangle } from "react-icons/lu";

export default function Irregulares() {
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
    <div className="p-4 md:p-10 flex flex-col gap-8 w-[100vw] md:w-full">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex mb-4">
          <Link href="/" className="flex items-center">
            <IoArrowBackCircleOutline className="mr-2 h-6 w-6" />
            <h3 className="text-lg">Voltar</h3>
          </Link>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex mb-4">
            <LuAlertTriangle className="mr-2 h-6 w-6" />
            <h3 className="font-black  text-lg">Imóveis Inadimplentes</h3>
          </div>
        </div>
        <div className="rounded-md border w-[80vw] md:w-[90vw]">
          <ImoveisIrregularesComponent />
        </div>
      </div>
    </div>
  );
}
