"use client";

import { pendencyAcronym } from "@/@types/PendencyAcronym";
import AcronymPendencyTable from "@/components/imoveis/Pendencias";
import Loading from "@/components/loading";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AddSigla from "@/components/imoveis/addsigla";
import Link from "next/link";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function SiglaPendencias() {
  const [loading, setloading] = useState(true);
  const [acronym, setAcronym] = useState<pendencyAcronym[] | null>();

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
      .from("pendencyAcronym")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.log(error);

        if (!data) return;

        setAcronym(data);
      });
  }, []);

  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  if (loading) return <Loading />;
  if (!acronym) return;
  return (
    <div className="p-10 flex flex-col gap-7">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex ">
          <button onClick={goBack} className="flex items-center">
            <IoArrowBackCircleOutline className="mr-2 h-6 w-6" />
            <h3 className="text-lg">Voltar</h3>
          </button>
        </div>
        <AcronymPendencyTable data={acronym} />
        <div className="mb-6"></div>
        <AddSigla />
      </div>
    </div>
  );
}
