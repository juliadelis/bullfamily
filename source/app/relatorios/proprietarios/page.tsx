"use client";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";

import MainTable from "@/components/home/MainTable";
import SubMenu from "@/components/submenu";
import { Autocomplete, TextField } from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import { Estate } from "@/@types/estate";

export default function Proprietarios() {
  const [loading, setloading] = useState(true);
  const [estates, setEstates] = useState<Estate[] | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("estates").select("*");

      if (error) {
        console.error("Erro ao buscar dados:", error);
      } else {
        const sortedData = (data || []).sort((a, b) => a.id - b.id);
        setEstates(sortedData);
      }

      setloading(false);
    };

    fetchData();
  }, []);

  const uniqueOwners = Array.from(
    new Set(estates?.map((estate) => estate?.proprietary))
  );

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
          <div className="my-4 w-[300px]">
            <Autocomplete
              value={selectedOwner || null}
              onChange={(event, newValue) => setSelectedOwner(newValue ?? null)}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) =>
                setInputValue(newInputValue)
              }
              options={uniqueOwners}
              getOptionLabel={(option) => (option && option ? option : "")}
              renderInput={(params) => (
                <TextField {...params} label="Proprietário" />
              )}
              size="small"
            />
          </div>

          <MainTable filter={selectedOwner} />
        </div>
      </div>
    </div>
  );
}
