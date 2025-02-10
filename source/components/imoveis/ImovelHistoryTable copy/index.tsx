import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ImovelDataProps } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

import { isObserver } from "@/utils/isObserver";
import { Button } from "@mui/material";
import { FormatterUtils } from "@/utils/formatter.utils";

import "./index.css";
import { registerAction } from "@/components/actionRegister";
import { redirect } from "next/navigation";
import { isDelethistory } from "@/utils/isDelethistory";

const ImovelHistoryTable = ({ data }: { data: ImovelDataProps }) => {
  const [userName, setUserName] = useState<any>(null);

  useEffect(() => {
    const res = localStorage.getItem("user");
    if (!res) {
      redirect("/login");
    }

    const parsedUser = JSON.parse(res).data.user;

    const client = createClient();

    client
      .from("profiles")
      .select("*")
      .eq("id", parsedUser.id)
      .then(({ data }) => {
        if (!data) return;
        setUserName(data[0]);
      });
  }, []);

  const requestDeleteHistory = async (id: number, estate_id: number) => {
    const client = createClient();
    const user = localStorage.getItem("user");

    if (!user) {
      toast({
        title: "Erro: Usuário não autenticado!",
        variant: "destructive",
      });
      return;
    }

    const success = await registerAction(
      userName.name,
      `Apagar histórico do imovel de id ${estate_id}`,
      "excluir historico",
      { id }
    );

    if (success) {
      toast({
        title: "Solicitação de exclusão registrada com sucesso!",
      });
    } else {
      toast({
        title: "Erro ao registrar solicitação de exclusão!",
        variant: "destructive",
      });
    }
  };

  // const deleteHistory = async (id: number) => {
  //   const client = createClient();

  //   try {
  //     const { error } = await client.from("historys").delete().eq("id", id);

  //     if (error) {
  //       toast({
  //         title: `Erro ao excluir histórico!`,
  //         variant: `destructive`,
  //       });
  //       return;
  //     }

  //     toast({
  //       title: `Histórico excluído com sucesso!`,
  //     });
  //     location.reload();
  //   } catch (error) {
  //     toast({
  //       title: `Erro ao excluir histórico!`,
  //       variant: `destructive`,
  //     });
  //   }
  // };
  const [isObserverBoolean, setIsObserverBoolean] = useState<boolean>(false);
  const [isdelethistoryBoolean, setIsdelethistoryBoolean] =
    useState<boolean>(false);
  useEffect(() => {
    isObserver().then((data) => {
      setIsObserverBoolean(Boolean(data));
    });
  }, []);
  useEffect(() => {
    isDelethistory().then((data) => {
      setIsdelethistoryBoolean(Boolean(data));
    });
  }, []);
  return (
    <div className="bg-white  ">
      <div className="border border-b-0 rounded-b-none flex items-center  [#F1F5F9] px-1 py-1">
        <p className="text-[#334155] text-[12px] font-semibold">Histórico</p>
      </div>
      <Table className="">
        <TableBody>
          <ScrollArea className="h-[18vh] border  ">
            {data?.map((item, i) => (
              <TableRow key={i}>
                {item.data && item.created_at && (
                  <>
                    <TableCell className="font-medium w-[100px] text-[12px]">
                      {FormatterUtils.formatDate(item.created_at)}
                    </TableCell>
                    <TableCell className="font-medium text-[12px]">
                      {String(item.data)}
                    </TableCell>
                    {isObserverBoolean || !isdelethistoryBoolean ? (
                      <></>
                    ) : (
                      <TableCell className="font-medium text-[12px]">
                        <Button
                          onClick={() => {
                            requestDeleteHistory(item.id, item.estate_id);
                          }}
                          className="normal-case text-[12px] text-black underline">
                          Deletar
                        </Button>
                      </TableCell>
                    )}
                  </>
                )}
              </TableRow>
            ))}
          </ScrollArea>
        </TableBody>
      </Table>
    </div>
  );
};

export default ImovelHistoryTable;
