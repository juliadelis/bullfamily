"use client";
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
import { Button } from "@mui/material";
import { LuPencil, LuPlus } from "react-icons/lu";
import { isEditestate } from "@/utils/isEditestate";
import { isEdithistory } from "@/utils/isEdithistory";

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

export const DesktopEstateLayout = ({
  estate,
  estateHistory,
  lastYear,
  nextYear,
  onSubmitHistory,
  payments,
  pendencies,
  slug,
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
    <div className="hidden md:block p-4">
      <div className="flex gap-4">
        <div className="flex flex-col ">
          <div>
            <ImovelTable {...estate} />
          </div>
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
        </div>
      </div>
    </div>
  );
};
