"use client";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";

import MainTable from "@/components/home/MainTable";
import SubMenu from "@/components/submenu";
import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import { Estate } from "@/@types/estate";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormatterUtils } from "@/utils/formatter.utils";
import { HiOutlinePencil } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { addMonths, differenceInDays } from "date-fns";
import "./index.css";

export default function ContratosAVencer() {
  const [loading, setloading] = useState(true);
  const [estates, setEstates] = useState<Estate[] | null>(null);
  const [estateObservations, setEstateObservations] = useState<{
    [key: number]: string;
  }>({});
  const [newObservation, setNewObservation] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEstateId, setSelectedEstateId] = useState<number | null>(null);
  const [monthsFilter, setMonthsFilter] = useState<number | "">("");

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

  const handleOpenModal = (estateId: number, currentObs: string) => {
    setSelectedEstateId(estateId);
    setNewObservation(currentObs);
    setModalOpen(true);
  };

  const saveObservation = async () => {
    if (selectedEstateId === null) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("contracts_to_expired")
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

  const calculateTimeLeft = (endDate: string | null) => {
    if (!endDate) return "Sem data de fim";

    const end = new Date(endDate);
    const today = new Date();

    const difference = differenceInDays(end, today);
    return difference >= 0 ? `${difference} dias` : "Contrato vencido";
  };

  const menuItems = [
    { label: "Todos os imóveis", href: "/" },
    { label: "Imóveis vagos", href: "/relatorios/imoveis-vagos" },
    { label: "Imóveis alugados", href: "/relatorios/imoveis-alugados" },
    { label: "A Alugar", href: "/relatorios/a-alugar" },
    { label: "Proprietários", href: "/relatorios/proprietarios" },
    { label: "Contratos a vencer", href: "/relatorios/contratos-a-vencer" },
  ];

  const updateEstateStatus = async (id: number, newStatus: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("estates")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar status:", error);
        return;
      }

      setEstates((prev) =>
        prev
          ? prev.map((estate) =>
              estate.id === id ? { ...estate, status: newStatus } : estate
            )
          : null
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleChangeStatus = (id: number, event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value;
    updateEstateStatus(id, newStatus);
  };

  const filteredEstates = estates?.filter((estate) => {
    if (monthsFilter === "" || isNaN(Number(monthsFilter))) {
      return estate.status === "Alugado";
    }

    const today = new Date();
    const maxDate = addMonths(today, Number(monthsFilter));

    return (
      estate.endDate &&
      new Date(estate.endDate) <= maxDate &&
      new Date(estate.endDate) >= today
    );
  });

  if (loading) return <Loading />;
  return (
    <div className="flex w-full">
      <div className="flex flex-col justify-between w-full">
        <div className="py-2 px-4">
          <SubMenu menuItems={menuItems} />
          <div className="my-4 w-[300px]">
            <TextField
              size="small"
              type="number"
              label="Filtrar por meses"
              value={monthsFilter}
              onChange={(e) =>
                setMonthsFilter(e.target.value ? Number(e.target.value) : "")
              }
            />
          </div>
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
                        <TableHead className="font-normal text-black ">
                          Status
                        </TableHead>

                        <TableHead className="font-normal text-black">
                          Inicio do contrato
                        </TableHead>

                        <TableHead className="font-normal text-black">
                          Fim do contrato
                        </TableHead>

                        <TableHead className="font-normal text-black">
                          Dias para o fim do contrato
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
                      {filteredEstates?.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium ">
                            {item.nickname}
                          </TableCell>
                          <TableCell className="font-medium">
                            <FormControl
                              variant="standard"
                              sx={{ m: 1, minWidth: 120 }}
                              size="small"
                              className="text-[12px]">
                              <Select
                                value={item.status}
                                onChange={(e) => handleChangeStatus(item.id, e)}
                                className="text-[12px]">
                                <MenuItem
                                  className="text-[12px]"
                                  value="Alugado">
                                  Alugado
                                </MenuItem>
                                <MenuItem
                                  className="text-[12px]"
                                  value="À venda">
                                  À venda
                                </MenuItem>
                                <MenuItem
                                  className="text-[12px]"
                                  value="A alugar">
                                  A alugar
                                </MenuItem>
                                <MenuItem
                                  className="text-[12px]"
                                  value="Ocioso">
                                  Ocioso
                                </MenuItem>
                                <MenuItem
                                  className="text-[12px]"
                                  value="A Adquirir">
                                  A Adquirir
                                </MenuItem>
                                <MenuItem
                                  className="text-[12px]"
                                  value="Demandas">
                                  Demandas
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>

                          <TableCell className="font-medium">
                            {item.startDate &&
                            item.startDate !== new Date("1970-01-01")
                              ? FormatterUtils.formatDate(item.startDate)
                              : item.startDate === new Date("1970-01-01")
                              ? "Não existe data de desocupação"
                              : "Não existe data de desocupação"}
                          </TableCell>

                          <TableCell className="font-medium">
                            {item.endDate &&
                            item.endDate !== new Date("1970-01-01")
                              ? FormatterUtils.formatDate(item.endDate)
                              : item.endDate === new Date("1970-01-01")
                              ? "Não existe data de desocupação"
                              : "Não existe data de desocupação"}
                          </TableCell>

                          <TableCell className="font-medium text-[#BE1A1A]">
                            {calculateTimeLeft(String(item.endDate))}
                          </TableCell>
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
