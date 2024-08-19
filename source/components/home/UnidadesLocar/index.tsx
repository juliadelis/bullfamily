"use client";
import React, { FormEventHandler, useEffect, useState } from "react";

import { LuHome } from "react-icons/lu";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Estate } from "@/@types/estate";
import { createClient } from "@/utils/supabase/client";
import { SelectManual } from "@/components/SelectManual";
import AddImovel from "@/components/imoveis/addImovel";
import { isObserver } from "@/utils/isObserver";

const UnidadesLocar = () => {
  const [value, setValue] = useState("");
  const [isObserverBoolean, setIsObserverBoolean] = useState<boolean>(false);
  useEffect(() => {
    isObserver().then((data) => {
      setIsObserverBoolean(Boolean(data));
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  const [estates, setEstate] = useState<Estate[]>([]);
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data }) => {
        if (!data) return;

        setEstate(data.sort((a: Estate, b: Estate) => a.id - b.id));
      });
  }, []);

  if (estates.length <= 0) return null;

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-lg ">
      <div className="flex flex-col gap-4 w-[80vw] md:w-[50vw]">
        <div className="flex">
          <LuHome className="mr-2 h-6 w-6" />
          <h3 className="font-black  text-lg">Unidades a locar</h3>
        </div>
        <p className="w-full text-md">Ir para imóvel específico</p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <SelectManual
          label=""
          options={estates}
          value={value}
          onChange={handleChange}></SelectManual>

        <div className="flex gap-4">
          <Button asChild className="w-fit">
            <Link href={`/imovel/${value}`}>Ir para o imóvel</Link>
          </Button>
          {isObserverBoolean ? <></> : <AddImovel />}
        </div>
      </div>
    </div>
  );
};

export default UnidadesLocar;
