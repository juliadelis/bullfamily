"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Link from "next/link";
import ImovelTable from "@/components/imoveis/ImovelTable";
import { Estate } from "@/@types/estate";
import ImovelHistoryTable from "@/components/imoveis/ImovelHistoryTable copy";
import { ImovelHistory } from "@/components/imoveis/ImovelHistoryTable copy/types";
import { FinancialRecord, PaymentTable } from "@/components/payments-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { pendencyState } from "@/@types/PendencyState";
import { HistoryFormComponent } from "@/app/imovel/HistoryForm/form";
import { formSchemaHistory } from "@/app/imovel/HistoryForm/formSchema";
import { isObserver } from "@/utils/isObserver";
import { isEditestate } from "@/utils/isEditestate";
import { isEdithistory } from "@/utils/isEdithistory";
import { Button } from "@mui/material";
import { LuPencil, LuPlus } from "react-icons/lu";

type Props = {
  pendencies: pendencyState[];
  slug: string;
  estate: Estate;
  lastYear: () => void;
  nextYear: () => void;
  payments: FinancialRecord[];
  year: number;
  estateHistory: ImovelHistory[];
  onSubmitHistory: ({
    data,
  }: z.infer<typeof formSchemaHistory>) => Promise<void>;
};
export const EstateMobilLayout = ({
  estate,
  slug,
  pendencies,
  estateHistory,
  lastYear,
  nextYear,
  onSubmitHistory,
  payments,
  year,
}: Props) => {
  const [isObserverBoolean, setIsObserverBoolean] = useState<boolean>(false);
  const [iseditestate, setIseditestate] = useState<boolean>(false);
  const [isedithistory, setIsedithistory] = useState<boolean>(false);
  useEffect(() => {
    isObserver().then((data) => {
      setIsObserverBoolean(Boolean(data));
    });
  }, []);
  useEffect(() => {
    isEditestate().then((data) => {
      setIseditestate(Boolean(data));
    });
  }, []);
  useEffect(() => {
    isEdithistory().then((data) => {
      setIsedithistory(Boolean(data));
    });
  }, []);
  return (
    <Tabs defaultValue="principal" className=" md:hidden">
      <TabsList>
        <TabsTrigger value="principal">Tabela Principal</TabsTrigger>
        <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        <TabsTrigger value="historico">Histórico</TabsTrigger>
      </TabsList>
      <TabsContent value="principal">
        <div className="flex flex-col ">
          <ImovelTable {...estate} />
          {isObserverBoolean || !iseditestate ? (
            <></>
          ) : (
            <div className="mt-1 ml-0">
              <Button
                href={`/imovel/${slug}/editar`}
                variant={"text"}
                className="text-[12px] text-black normal-case underline"
                startIcon={<LuPencil size={12} />}>
                Editar informações
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="pagamentos">
        <div className="flex flex-col gap-3">
          <div>
            <PaymentTable
              pendencies={pendencies}
              lastYear={lastYear}
              nextYear={nextYear}
              data={payments as FinancialRecord[]}
              year={year}
              estate={estate}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="historico">
        <div>
          <ImovelHistoryTable data={estateHistory} />
          <div className="mt-4 ml-0">
            <Dialog>
              {isObserverBoolean || !isedithistory ? (
                <></>
              ) : (
                <DialogTrigger>
                  <Button
                    className="text-[12px] text-black normal-case underline"
                    startIcon={<LuPlus size={12} />}>
                    Adicionar histórico
                  </Button>
                </DialogTrigger>
              )}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-8">
                    Adicionar histórico
                  </DialogTitle>
                  <DialogDescription className="h-[30vh] ">
                    <HistoryFormComponent onSubmit={onSubmitHistory} />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
