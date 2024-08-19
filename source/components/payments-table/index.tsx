"use client";
import { useEffect, useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "../ui/use-toast";
import { Estate } from "@/@types/estate";
import { pendencyState } from "@/@types/PendencyState";
import { isObserver } from "@/utils/isObserver";

export interface FinancialRecord {
  id: number;
  month: number;
  year: number;
  estateId: number;
  rent: string;
  condominium: string;
  sabesp: string;
  enel: string;
  gas: string;
  observations: string;
  tenatFines: number;
  condominiumFines: number;
  extraConstructions: string;
  propertyTaxIPTU: string;
  statusPropertyTaxIPTU: string;
  statusRent: string;
  statusCondominium: string;
  statusExtraConstructions: string;
  statusSabesp: string;
  statusEnel: string;
  statusGas: string;
  propertyTaxIPTUValue: number;
  rentValue: number;
  condominiumValue: number;
  sabespValue: number;
  enelValue: number;
  gasValue: number;
  extra: string;
  extraValue: number;
  extraStatus: string;
  rentPerson: string;
  condominiumPerson: string;
  sabespPerson: string;
  enelPerson: string;
  gasPerson: string;
  extraPerson: string;
  propertyTaxIPTUPerson: string;
}
interface Props {
  data: FinancialRecord[];
  pendencies: pendencyState[];
  year: number;
  nextYear: () => void;
  lastYear: () => void;
  className?: string;
  estate: Estate;
}

export const PaymentTable = (props: Props) => {
  const { data, year, estate } = props;
  const { id: estateId } = estate;
  const [isObserverBoolean, setIsObserverBoolean] = useState<boolean>(false);
  useEffect(() => {
    isObserver().then((data) => {
      setIsObserverBoolean(Boolean(data));
    });
  }, []);

  const pendencies = props.pendencies
    .map((pendency) => {
      const date = new Date(pendency.date);
      const month = date.getMonth();
      const year = date.getFullYear();

      return {
        month,
        year,
        ...pendency,
      };
    })
    .filter((pendency) => pendency.year === year);

  const months = useMemo(() => {
    return [
      { value: 1, label: "Jan" },
      { value: 2, label: "Fev" },
      { value: 3, label: "Mar" },
      { value: 4, label: "Abr" },
      { value: 5, label: "Mai" },
      { value: 6, label: "Jun" },
      { value: 7, label: "Jul" },
      { value: 8, label: "Ago" },
      { value: 9, label: "Set" },
      { value: 10, label: "Out" },
      { value: 11, label: "Nov" },
      { value: 12, label: "Dez" },
    ];
  }, []);

  function formatMoneyBRL(amount: number | null) {
    if (amount === 0 || !amount) {
      return "Valor não inserido";
    }

    const [integerPart, decimalPart] = amount.toFixed(2).split(".");

    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );

    return `R$ ${formattedIntegerPart},${decimalPart}`;
  }

  function formatDate(stringDate: string) {
    const date = new Date(stringDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const formatedData = useMemo(() => {
    if (!data) return [];
    return months.map((month) => {
      const monthData = data.find((data) => data.month === month.value);
      const pendenciesForMonth = pendencies.filter(
        (pendency) => pendency.month === month.value
      );

      const res = monthData
        ? { ...monthData, monthLabel: month.label, pendenciesForMonth }
        : { monthLabel: month.label, month: month.value, pendenciesForMonth };

      return res as FinancialRecord & {
        monthLabel: string;
        pendenciesForMonth: pendencyState[];
      };
    });
  }, [data]);

  return (
    <div className="border rounded-md bg-white  ">
      <div className="flex items-center  justify-between [#F1F5F9] px-4 py-[0.75rem]  rounded-t-md border-b">
        <button onClick={props.lastYear}>
          <ArrowLeftIcon width={20} height={20} />
        </button>
        <p className="text-[#334155] text-md font-semibold">{year}</p>
        <button onClick={props.nextYear}>
          <ArrowRightIcon width={20} height={20} />
        </button>
      </div>

      <ScrollArea className="md:w-[56vw] w-full   whitespace-nowrap h-[35vh] ">
        <Table>
          <ScrollArea className="h-[70vh] w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead>Imposto/IPTU</TableHead>
                <TableHead>Aluguel</TableHead>
                <TableHead>Condominio</TableHead>
                <TableHead>Água</TableHead>
                <TableHead>Luz</TableHead>
                <TableHead>Gás</TableHead>
                <TableHead>Extra</TableHead>
                <TableHead className="w-[200px]">Obs</TableHead>
                {isObserverBoolean ? <></> : <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {formatedData.map((monthData) => {
                return (
                  <TableRow>
                    <TableCell>{monthData.monthLabel}</TableCell>
                    <TableCell
                      className={`font-semibold 
                        ${
                          monthData.statusPropertyTaxIPTU ===
                            "Pago em atraso" ||
                          monthData.statusPropertyTaxIPTU === "Não foi pago"
                            ? "text-[#BE1A1A]"
                            : monthData.statusPropertyTaxIPTU === "Pago em dia"
                            ? "text-[#1B972F]"
                            : ""
                        }`}>
                      <div className="flex flex-col gap-2">
                        {monthData.propertyTaxIPTU &&
                          formatDate(monthData.propertyTaxIPTU)}
                        {monthData.propertyTaxIPTUValue && (
                          <div
                            className={` ${
                              monthData.statusPropertyTaxIPTU ===
                                "Pago em atraso" ||
                              monthData.statusPropertyTaxIPTU === "Não foi pago"
                                ? "text-[#BE1A1A]"
                                : monthData.statusPropertyTaxIPTU ===
                                  "Pago em dia"
                                ? "text-[#1b972f]"
                                : monthData.statusPropertyTaxIPTU ===
                                  "Pago adiantado"
                                ? "text-[#CC64C2]"
                                : "text-[#CBD5E1]"
                            }`}>
                            {formatMoneyBRL(monthData.propertyTaxIPTUValue)}
                          </div>
                        )}
                        <span
                          className={` ${
                            monthData.statusPropertyTaxIPTU
                              ? "text-[#216CB1]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {monthData.statusPropertyTaxIPTU === "Não foi pago"
                            ? monthData.statusPropertyTaxIPTU
                            : formatMoneyBRL(estate.taxIPTU)}
                        </span>
                        {monthData.propertyTaxIPTUPerson ? (
                          <span>
                            Pago por {monthData.propertyTaxIPTUPerson}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-semibold  ${
                        monthData.statusRent === "Pago em atraso" ||
                        monthData.statusRent === "Não foi pago"
                          ? "text-[#BE1A1A]"
                          : monthData.statusRent === "Pago em dia"
                          ? "text-[#1B972F]"
                          : ""
                      }`}>
                      <div className="flex flex-col gap-2">
                        {monthData.rentValue && (
                          <div
                            className={` ${
                              monthData.statusRent === "Pago em atraso" ||
                              monthData.statusRent === "Não foi pago"
                                ? "text-[#BE1A1A]"
                                : monthData.statusRent === "Pago em dia"
                                ? "text-[#1b972f]"
                                : monthData.statusRent === "Pago adiantado"
                                ? "text-[#CC64C2]"
                                : "text-[#CBD5E1]"
                            }`}>
                            {formatMoneyBRL(monthData.rentValue)}
                          </div>
                        )}
                        <div>
                          {monthData.rent && formatDate(monthData.rent)}
                          {monthData.pendenciesForMonth?.map((pendency) => {
                            return (
                              <span className="text-black pl-2">
                                {pendency.pendency_acronym}
                              </span>
                            );
                          })}
                        </div>
                        <span
                          className={` ${
                            monthData.statusRent
                              ? "text-[#216CB1]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {monthData.statusRent === "Não foi pago"
                            ? monthData.statusRent
                            : formatMoneyBRL(estate.rentValue)}
                        </span>
                        {monthData.rentPerson ? (
                          <span>Pago por {monthData.rentPerson}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-semibold  ${
                        monthData.statusCondominium === "Pago em atraso" ||
                        monthData.statusCondominium === "Não foi pago"
                          ? "text-[#BE1A1A]"
                          : monthData.statusCondominium === "Pago em dia"
                          ? "text-[#1B972F]"
                          : ""
                      }`}>
                      <div className="flex flex-col gap-2">
                        {monthData.condominium &&
                          formatDate(monthData.condominium)}

                        {monthData.condominiumValue && (
                          <div
                            className={` ${
                              monthData.statusCondominium ===
                                "Pago em atraso" ||
                              monthData.statusCondominium === "Não foi pago"
                                ? "text-[#BE1A1A]"
                                : monthData.statusCondominium === "Pago em dia"
                                ? "text-[#1b972f]"
                                : monthData.statusCondominium ===
                                  "Pago adiantado"
                                ? "text-[#CC64C2]"
                                : "text-[#CBD5E1]"
                            }`}>
                            {formatMoneyBRL(monthData.condominiumValue)}
                          </div>
                        )}
                        <span
                          className={` ${
                            monthData.statusCondominium
                              ? "text-[#216CB1]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {monthData.statusCondominium === "Não foi pago"
                            ? monthData.statusCondominium
                            : formatMoneyBRL(Number(estate.condominium))}
                        </span>
                        {monthData.condominiumPerson ? (
                          <span>Pago por {monthData.condominiumPerson}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        monthData.statusSabesp === "Pago em atraso" ||
                        monthData.statusSabesp === "Não foi pago"
                          ? "text-[#BE1A1A]"
                          : monthData.statusSabesp === "Pago em dia"
                          ? "text-[#1B972F]"
                          : ""
                      }`}>
                      <div className="flex flex-col gap-2">
                        {monthData.sabesp ? formatDate(monthData.sabesp) : null}

                        {monthData.sabespValue && (
                          <div
                            className={` ${
                              monthData.statusSabesp === "Pago em atraso" ||
                              monthData.statusSabesp === "Não foi pago"
                                ? "text-[#BE1A1A]"
                                : monthData.statusSabesp === "Pago em dia"
                                ? "text-[#1b972f]"
                                : monthData.statusSabesp === "Pago adiantado"
                                ? "text-[#CC64C2]"
                                : "text-[#CBD5E1]"
                            }`}>
                            {formatMoneyBRL(monthData.sabespValue)}
                          </div>
                        )}
                        <span
                          className={` ${
                            monthData.statusSabesp
                              ? "text-[#216CB1]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {monthData.statusSabesp === "Não foi pago"
                            ? monthData.statusSabesp
                            : formatMoneyBRL(estate.water)}
                        </span>
                        {monthData.sabespPerson ? (
                          <span>Pago por {monthData.sabespPerson}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        monthData.statusEnel === "Pago em atraso" ||
                        monthData.statusEnel === "Não foi pago"
                          ? "text-[#BE1A1A]"
                          : monthData.statusEnel === "Pago em dia"
                          ? "text-[#1B972F]"
                          : ""
                      }`}>
                      <div className="flex flex-col gap-2">
                        {monthData.enel && formatDate(monthData.enel)}

                        {monthData.enelValue && (
                          <div
                            className={` ${
                              monthData.statusEnel === "Pago em atraso" ||
                              monthData.statusEnel === "Não foi pago"
                                ? "text-[#BE1A1A]"
                                : monthData.statusEnel === "Pago em dia"
                                ? "text-[#1b972f]"
                                : monthData.statusEnel === "Pago adiantado"
                                ? "text-[#CC64C2]"
                                : "text-[#CBD5E1]"
                            }`}>
                            {formatMoneyBRL(monthData.enelValue)}
                          </div>
                        )}
                        <span
                          className={` ${
                            monthData.statusEnel
                              ? "text-[#216CB1]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {monthData.statusEnel === "Não foi pago"
                            ? monthData.statusEnel
                            : formatMoneyBRL(estate.light)}
                        </span>
                        {monthData.enelPerson ? (
                          <span>Pago por {monthData.enelPerson}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-semibold  ${
                        monthData.statusGas === "Pago em atraso" ||
                        monthData.statusGas === "Não foi pago"
                          ? "text-[#BE1A1A]"
                          : monthData.statusGas === "Pago em dia"
                          ? "text-[#1B972F]"
                          : ""
                      }`}>
                      <div className="flex flex-col gap-4">
                        {monthData.gas && formatDate(monthData.gas)}
                        {monthData.gasValue && (
                          <div
                            className={` ${
                              monthData.statusGas === "Pago em atraso" ||
                              monthData.statusGas === "Não foi pago"
                                ? "text-[#BE1A1A]"
                                : monthData.statusGas === "Pago em dia"
                                ? "text-[#1b972f]"
                                : monthData.statusGas === "Pago adiantado"
                                ? "text-[#CC64C2]"
                                : "text-[#CBD5E1]"
                            }`}>
                            {formatMoneyBRL(monthData.gasValue)}
                          </div>
                        )}
                        <span
                          className={` ${
                            monthData.statusGas
                              ? "text-[#216CB1]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {monthData.statusGas === "Não foi pago"
                            ? monthData.statusGas
                            : formatMoneyBRL(estate.gas)}
                        </span>
                        {monthData.gasPerson ? (
                          <span>Pago por {monthData.gasPerson}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-semibold  ${
                        monthData.extraStatus === "Pago em atraso" ||
                        monthData.extraStatus === "Não foi pago"
                          ? "text-[#BE1A1A]"
                          : monthData.extraStatus === "Pago em dia"
                          ? "text-[#1B972F]"
                          : ""
                      }`}>
                      <div className="flex flex-col gap-2">
                        {monthData.extra && formatDate(monthData.extra)}
                        {monthData.extraValue && (
                          <div
                            className={` ${
                              monthData.extraStatus === "Pago em atraso" ||
                              monthData.extraStatus === "Não foi pago"
                                ? "text-[#BE1A1A]"
                                : monthData.extraStatus === "Pago em dia"
                                ? "text-[#1b972f]"
                                : monthData.extraStatus === "Pago adiantado"
                                ? "text-[#CC64C2]"
                                : "text-[#CBD5E1]"
                            }`}>
                            {formatMoneyBRL(monthData.extraValue)}
                          </div>
                        )}
                        <span
                          className={` ${
                            monthData.extraStatus
                              ? "text-[#216CB1]"
                              : "text-[#CBD5E1]"
                          }`}>
                          {monthData.extraStatus === "Não foi pago"
                            ? monthData.extraStatus
                            : formatMoneyBRL(estate.extra)}
                        </span>

                        {monthData.extraPerson ? (
                          <span>Pago por {monthData.extraPerson}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{monthData.observations}</TableCell>

                    {isObserverBoolean ? (
                      <></>
                    ) : (
                      <TableCell className="gap-[30px]">
                        <Link
                          href={
                            monthData.estateId && monthData.id
                              ? `/imovel/${monthData.estateId}/editar/financeiro/${monthData.id}`
                              : `/imovel/${estateId}/criar/financeiro?month=${monthData.month}&year=${year}`
                          }>
                          <Button>Editar</Button>
                        </Link>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </ScrollArea>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
