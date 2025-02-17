"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, TextField, IconButton } from "@mui/material";
import { HiOutlinePencil } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import "./index.css";
import { EstateLike } from "@/app/imovel/page";
import { LuFileText } from "react-icons/lu";

export default function RelatorioPendenciaImoveis() {
  const [loading, setLoading] = useState(true);
  const [imoveis, setImoveis] = useState<EstateLike[] | null>();
  const [observacoes, setObservacoes] = useState<{
    [key: number]: string;
  }>({});
  const [novaObservacao, setNovaObservacao] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [imovelSelecionado, setImovelSelecionado] = useState<number>();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const { data: estatesData, error: estatesError } = await supabase
      .from("estates")
      .select("*");
    const { data: paymentsData, error: paymentsError } = await supabase
      .from("financialRecord")
      .select("*");

    if (estatesError || paymentsError) {
      console.error(
        "Erro ao buscar imóveis ou pagamentos:",
        estatesError,
        paymentsError
      );
    } else {
      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1;
      const anoAtual = hoje.getFullYear();

      const imoveisFiltrados = estatesData
        .map((imovel) => {
          const pagamentos = paymentsData.find(
            (p) =>
              p.estateId === imovel.id &&
              p.month == mesAtual &&
              p.year == anoAtual
          );

          let pendencias = "";

          if (!pagamentos) {
            pendencias = "Sem registro de pagamento de todos os itens";
          } else {
            const camposPendentes = [
              "propertyTaxIPTUValue",
              "rentValue",
              "condominiumValue",
              "sabespValue",
              "enelValue",
              "gasValue",
              "extraValue",
            ]
              .filter((key) => !pagamentos[key] || pagamentos[key] === "")
              .map(
                (key) =>
                  ({
                    propertyTaxIPTUValue: "IPTU/Impostos",
                    rentValue: "Aluguel",
                    condominiumValue: "Condomínio",
                    sabespValue: "Sabesp",
                    enelValue: "Enel",
                    gasValue: "Gás",
                    extraValue: "Extra",
                  }[key])
              );
            pendencias = camposPendentes.length
              ? camposPendentes.join(", ")
              : "Nenhuma pendência";
          }

          return {
            ...imovel,
            pendencias,
          };
        })
        .filter((imovel) => imovel.pendencias !== "Nenhuma pendência");

      setImoveis(imoveisFiltrados);
    }
    setLoading(false);
  };

  const handleOpenModal = (id: number, obs: string) => {
    setImovelSelecionado(id);
    setNovaObservacao(obs || "");
    setModalOpen(true);
  };

  const saveObservation = async () => {
    if (!imovelSelecionado) return;
    const supabase = createClient();
    await supabase
      .from("estates")
      .update({ observation: novaObservacao })
      .eq("id", imovelSelecionado);
    setObservacoes({ ...observacoes, [imovelSelecionado]: novaObservacao });
    setModalOpen(false);
  };

  if (loading) return <Loading />;
  return (
    <div className="p-4">
      <div className="flex mb-4">
        <LuFileText className="mr-2 h-4 w-4" />
        <h3 className="font-semibold  text-[12px]">
          Relatório de pendências dos imóveis
        </h3>
      </div>

      <Table className="w-full overflow-auto table-bordered">
        <TableHeader>
          <TableRow>
            <TableHead>Imóvel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Contrato</TableHead>
            <TableHead>Pendencia de pagamento</TableHead>
            <TableHead>Observações</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {imoveis?.map((imovel) => (
            <TableRow key={imovel.id}>
              <TableCell>{imovel.nickname}</TableCell>
              <TableCell
                className={`${
                  imovel.status === "Ocioso" ? "text-red-500 font-bold" : ""
                }`}>
                {imovel.status}
              </TableCell>
              <TableCell
                className={`${
                  imovel.contractWith ? "" : "text-red-500 font-bold"
                }`}>
                {imovel.contractWith
                  ? "Ativo"
                  : "Pendência de informações de contrato"}
              </TableCell>

              <TableCell
                className={`${
                  imovel.pendencias === "Nenhuma pendência"
                    ? ""
                    : "text-red-500 font-bold"
                }`}>
                {imovel.pendencias}
              </TableCell>
              <TableCell>
                <div className="flex justify-between">
                  {observacoes[imovel.id] || imovel.observation || ""}
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleOpenModal(imovel.id, imovel?.observation ?? "")
                    }>
                    {observacoes[imovel.id] || imovel.observation ? (
                      <HiOutlinePencil />
                    ) : (
                      <FiPlus size={12} />
                    )}
                  </IconButton>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  href={`/imovel/${imovel.id}`}
                  className="underline text-black">
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold">Editar Observação</h2>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={novaObservacao}
              onChange={(e) => setNovaObservacao(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button className="bg-black text-white" onClick={saveObservation}>
                Salvar
              </Button>
              <Button
                className="text-black"
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
