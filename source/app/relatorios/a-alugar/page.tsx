"use client";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createClient } from "@/utils/supabase/client";
import { differenceInDays, format } from "date-fns";

import Link from "next/link";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import Loading from "@/components/loading";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";
import { Estate } from "@/@types/estate";
import { ptBR } from "date-fns/locale";
import "./index.css";
import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import SubMenu from "@/components/submenu";
import { FiPlus } from "react-icons/fi";
import { HiOutlinePencil } from "react-icons/hi2";
import { FormatterUtils } from "@/utils/formatter.utils";

export default function ImoveisAAlugarRelatorio() {
  const [loading, setloading] = useState(true);
  const [estateObservations, setEstateObservations] = useState<{
    [key: number]: string;
  }>({});
  const [newObservation, setNewObservation] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEstateId, setSelectedEstateId] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      setloading(true);

      try {
        const { data: estatesData, error: estatesError } = await supabase
          .from("estates")
          .select("*");

        if (estatesError) throw estatesError;

        const filteredEstates = estatesData.filter((estate) =>
          ["Ocioso", "À venda", "A alugar", "A Adquirir", "Demandas"].includes(
            estate.status
          )
        );

        setEstates(filteredEstates);

        const { data: observationsData, error: observationsError } =
          await supabase.from("empityEstates").select("estate_id, obs");

        if (observationsError) throw observationsError;

        setEstateObservations(
          observationsData.reduce(
            (acc, obs) => ({ ...acc, [obs.estate_id]: obs.obs }),
            {}
          )
        );
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, []);

  const [estates, setEstates] = useState<Estate[] | null>();

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      setloading(true);

      const { data: estatesData, error: estatesError } = await supabase
        .from("estates")
        .select("*");

      if (estatesError) {
        console.error("Erro ao buscar imóveis:", estatesError);
        return;
      }

      const filteredEstates = estatesData.filter(
        (estate) => estate.status === "A alugar"
      );

      setEstates(filteredEstates);

      const { data: observationsData, error: observationsError } =
        await supabase.from("to_rent_estates").select("estate_id, obs");

      if (observationsError) {
        console.error("Erro ao buscar observações:", observationsError);
        return;
      }

      const observationsMap: { [key: number]: string } = {};
      observationsData.forEach((obs) => {
        observationsMap[obs.estate_id] = obs.obs;
      });

      setEstateObservations(observationsMap);
      setloading(false);
    };

    fetchData();
  }, []);

  const handleOpenModal = (estateId: number, currentObs: string) => {
    setSelectedEstateId(estateId);
    setNewObservation(currentObs);
    setModalOpen(true);
  };

  const saveObservation = async () => {
    if (selectedEstateId === null) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("to_rent_estates")
      .upsert([{ estate_id: selectedEstateId, obs: newObservation }]);
    if (error) {
      console.error("Erro ao salvar observação:", error);
      return;
    }

    setEstateObservations((prev) => ({
      ...prev,
      [selectedEstateId]: newObservation,
    }));

    setModalOpen(false);
  };

  const calculateTimeLeft = (endDate: Date) => {
    const difference = differenceInDays(new Date(endDate), new Date());
    return Math.abs(difference);
  };

  const menuItems = [
    { label: "Todos os imóveis", href: "/" },
    { label: "Imóveis vagos", href: "/relatorios/imoveis-vagos" },
    { label: "Imóveis alugados", href: "/relatorios/imoveis-alugados" },
    { label: "A Alugar", href: "/relatorios/a-alugar" },
    { label: "Proprietários", href: "/relatorios/proprietarios" },
    { label: "Contratos a vencer", href: "/relatorios/contratos-a-vencer" },
  ];

  if (loading) return <Loading />;

  if (!estates) return <Loading />;

  return (
    <div>
      <div className="flex flex-col p-4 mb-[100px]">
        <SubMenu menuItems={menuItems} />
        <div>
          <div>
            <div>
              <div>
                <Table className="w-full overflow-auto table-bordered">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-normal text-black">
                        Imóvel
                      </TableHead>

                      <TableHead className="font-normal text-black">
                        Desocupado desde
                      </TableHead>

                      <TableHead className="font-normal text-black">
                        Dias desocupados
                      </TableHead>
                      <TableHead className="font-normal text-black">
                        Proprietário
                      </TableHead>
                      <TableHead className="font-normal text-black">
                        Observações
                      </TableHead>
                      <TableHead className="font-normal text-black">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estates?.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium ">
                          {item.nickname}
                        </TableCell>

                        <TableCell className="font-medium">
                          {item.unoccupied &&
                          item.unoccupied !== new Date("1970-01-01")
                            ? FormatterUtils.formatDate(item.unoccupied)
                            : item.unoccupied === new Date("1970-01-01")
                            ? "Não existe data de desocupação"
                            : "Não existe data de desocupação"}
                        </TableCell>
                        <TableCell className="font-medium text-[#BE1A1A]">
                          {item.unoccupied
                            ? calculateTimeLeft(
                                new Date(String(item.endDate))
                              ) + " dias"
                            : "Não existe data de desocupação"}
                        </TableCell>
                        <TableCell className="font-medium text-[#BE1A1A]"></TableCell>
                        <TableCell className={`font-medium`}>
                          <div
                            className={`flex ${
                              estateObservations[item.id]
                                ? "justify-between"
                                : "justify-end"
                            }`}>
                            {estateObservations[item.id] || ""}
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleOpenModal(
                                  item.id,
                                  estateObservations[item.id] || ""
                                )
                              }>
                              {estateObservations[item.id] ? (
                                <HiOutlinePencil fontSize="small" />
                              ) : (
                                <FiPlus size={12} />
                              )}
                            </IconButton>
                          </div>
                        </TableCell>

                        <TableCell className="font-medium ">
                          <Button
                            href={`/imovel/${item.id}`}
                            type="text"
                            className="normal-case underline text-black text-[12px]">
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              {estateObservations[selectedEstateId || 0]
                ? "Editar"
                : "Adicionar"}{" "}
              Observação
            </h2>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={newObservation}
              onChange={(e) => setNewObservation(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="contained"
                className="normal-case text-white bg-black text-[12px]"
                onClick={saveObservation}>
                Salvar
              </Button>
              <Button
                variant="text"
                className="normal-case text-black text-[12px]"
                onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
