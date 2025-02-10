"use client";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { LuFileText } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EstateLike } from "@/app/imovel/page";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Loading from "@/components/loading";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { pendencyState } from "@/@types/PendencyState";
import { toast } from "@/components/ui/use-toast";
import { ucs2 } from "punycode";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";

import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PendencyStatemComponent } from "@/components/imoveis/EstatePendencia/form";
import { formSchema } from "@/components/imoveis/EstatePendencia/formSchema";
import { PendencyAcronymComponent } from "@/app/imovel/adicionar-sigla-pendencia/form";
import { formSchemaAcronym } from "@/app/imovel/adicionar-sigla-pendencia/formSchema";
import AcronymPendencyTable from "@/components/imoveis/Pendencias";
import AddSigla from "@/components/imoveis/addsigla";
import { pendencyAcronym } from "@/@types/PendencyAcronym";

export default function ItensMesRelatorio() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const [pendency, setPendency] = useState<pendencyState[] | null>();

  const deletePendency = async (id: number) => {
    const client = createClient();

    try {
      const { error } = await client
        .from("pendencyState")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: `Erro ao excluir pendência!`,
          variant: `destructive`,
        });
        return;
      }

      toast({
        title: `Pendência excluída com sucesso!`,
      });
      location.reload();
    } catch (error) {
      toast({
        title: `Erro ao excluir pendência!`,
        variant: `destructive`,
      });
    }
  };

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("pendencyState")
      .select("*")
      .then(({ data }) => {
        if (!data) return;

        setPendency(data);
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
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao adicionar Pendência",
      });
    }
  }

  async function onSubmitAcronym({
    acronym,
    description,
  }: z.infer<typeof formSchemaAcronym>) {
    const client = createClient();
    try {
      const { data: estatesData, error } = await client
        .from("pendencyAcronym")
        .insert([
          {
            acronym,
            description,
          },
        ])
        .select();

      if (error) {
        console.log({ error });
        return;
      }
      toast({
        title: "Sigla adicionada com sucesso!",
      });
      router.replace("/imovel/sigla-pendencia/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao adicionar sigla",
      });
    }
  }
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

  if (loading) return <Loading />;
  if (!pendency) return <Loading />;
  if (!acronym) return;
  return (
    <div>
      <div className="flex flex-col p-4 md:p-10">
        <div className="bg-white p-6 rounded-lg w-[90vw]">
          <div className="flex mb-[60px] ">
            <Link href="/relatorios" className="flex items-center">
              <IoArrowBackCircleOutline className="mr-2 h-6 w-6" />
              <h3 className="text-lg">Voltar ao painel de relatórios</h3>
            </Link>
          </div>
          <div className="flex flex-wrap flex-col gap-8">
            <div className="flex mb-4">
              <LuFileText className="mr-2 h-6 w-6" />
              <h3 className="font-black  text-lg">
                Lista de Pendências imóveis
              </h3>
            </div>
            <div className="flex flex-wrap content-start flex-col md:flex-row gap-3">
              <Button className="w-fit">
                <Link href={`/imovel/sigla-pendencia`}>
                  Ver lista de siglas de pendências
                </Link>
              </Button>
              <Dialog>
                <DialogTrigger>
                  <Button className="w-fit self-start" variant="blue">
                    Adicionar sigla de pendência
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-[70%]">
                  <DialogHeader>
                    <DialogTitle className="mb-8">
                      Adicionar sigla de pendência
                    </DialogTitle>
                    <DialogDescription className="md:h-[30vh] ">
                      <PendencyAcronymComponent onSubmit={onSubmitAcronym} />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger>
                  <Button className="w-fit self-start" variant="red">
                    Adicionar pendência
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-[60%]">
                  <DialogHeader>
                    <DialogTitle className="mb-8">
                      Adicionar Pendência
                    </DialogTitle>
                    <DialogDescription className="h-[40vh] md:h-[30vh] ">
                      <PendencyStatemComponent onSubmit={onSubmit} />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col justify-between items-end md:h-[30vh] w-[80vw]  md:w-[90VW] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[400px] font-black">
                      Imóvel
                    </TableHead>
                    <TableHead className="font-black">
                      Sigla da pendência
                    </TableHead>
                    <TableHead className="font-black">
                      Data da Pendência
                    </TableHead>

                    <TableHead className="font-black text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendency?.map((item) => (
                    <TableRow>
                      <TableCell className="font-bold">
                        {item.nameEstate}
                      </TableCell>
                      <TableCell className="">
                        {item.pendency_acronym}
                      </TableCell>
                      <TableCell className="">
                        {format(String(item.date), "PPP", {
                          locale: ptBR,
                        })}
                      </TableCell>

                      <TableCell className="font-bold text-right ">
                        <Button asChild className="mr-3">
                          <Link href={`/imovel/${item.idstate}`}>
                            Ver imóvel
                          </Link>
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => {
                            deletePendency(item.id);
                          }}>
                          Deletar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <AcronymPendencyTable data={acronym} />
            <div className="mb-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
