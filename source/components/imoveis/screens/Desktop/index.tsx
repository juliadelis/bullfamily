"use client";
import React, { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  useEffect(() => {
    isObserver().then((data) => {
      setIsObserverBoolean(Boolean(data));
    });
  }, []);
  return (
    <div className="hidden md:block">
      <div className="flex gap-[3%]">
        <div className="flex flex-col ">
          <ImovelTable {...estate} />
          {isObserverBoolean ? (
            <></>
          ) : (
            <div className="mt-4 ml-0">
              <Button variant={"default"} asChild>
                <Link href={`/imovel/${slug}/editar`}>Editar informações</Link>
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
                {isObserverBoolean ? (
                  <></>
                ) : (
                  <DialogTrigger>
                    <Button variant="blue">Adicionar histórico</Button>
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
