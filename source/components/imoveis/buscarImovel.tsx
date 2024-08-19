import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";

import { LuHome } from "react-icons/lu";
import { Button } from "../ui/button";
import Link from "next/link";
import { SelectManual } from "../SelectManual";
import { Estate } from "@/@types/estate";
import { createClient } from "@/utils/supabase/client";
import AddImovel from "./addImovel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PendencyStatemComponent } from "./EstatePendencia/form";
import { formSchema } from "./EstatePendencia/formSchema";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { isObserver } from "@/utils/isObserver";

export default function BuscarImovel() {
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

  const [estates, setEstates] = useState<Estate[]>([]);
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data, error }) => {
        console.log(error);

        if (!data) return;

        setEstates(data.sort((a: Estate, b: Estate) => a.id - b.id));
      });
  }, []);

  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit({
    nameEstate,
    pendency_acronym,
    date,
  }: z.infer<typeof formSchema>) {
    const client = createClient();
    try {
      const [idpendency, pendencyAcronym] = pendency_acronym.split("-");

      const [idestate, name_Estate] = nameEstate.split("-");

      const { data: estatesData, error } = await client
        .from("pendencyState")
        .insert([
          {
            idstate: Number(idestate),
            nameEstate: name_Estate,
            idpendency: Number(idpendency),
            pendency_acronym: pendencyAcronym,
            date,
          },
        ])
        .select();

      if (error) {
        console.log({ error });
        return;
      }
      toast({
        title: "Pendência adicionada com sucesso!",
      });
      router.replace("/relatorios/pendencias-imoveis");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao adicionar Pendência",
      });
    }
  }

  if (estates && estates.length <= 0) return null;
  return (
    <div className="flex flex-col gap-6 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex">
          <LuHome className="mr-2 h-6 w-6" />
          <h3 className="font-black  text-lg">Imóveis</h3>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-10">
        <SelectManual
          label=""
          options={estates}
          value={value}
          onChange={handleChange}></SelectManual>

        <div className="flex gap-4 flex-wrap">
          <Button asChild className="w-fit">
            <Link href={`/imovel/${value}`}>Ir para imóvel</Link>
          </Button>

          {isObserverBoolean ? <></> : <AddImovel />}

          {isObserverBoolean ? (
            <></>
          ) : (
            <div className="mb-6">
              <Dialog>
                <DialogTrigger>
                  <Button variant="red">Adicionar Pendência</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="mb-8">
                      Adicionar Pendência
                    </DialogTitle>
                    <DialogDescription className="h-[30vh] ">
                      <PendencyStatemComponent onSubmit={onSubmit} />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
