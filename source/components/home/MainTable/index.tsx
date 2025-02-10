"use client";
import { Estate } from "@/@types/estate";
import Loading from "@/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

import "./index.css";
import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { isObserver } from "@/utils/isObserver";
import PopupDelete from "@/components/imoveis/PopupDelete/PopupDelete";
import { pendencyState } from "@/@types/PendencyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PendencyStatemComponent } from "@/components/imoveis/EstatePendencia/form";
import { z } from "zod";
import { formSchema } from "@/components/imoveis/EstatePendencia/formSchema";
import { toast } from "@/components/ui/use-toast";
import { FiPlus } from "react-icons/fi";
import { PendencyStateComponent } from "@/components/imoveis/EstatePendencia/adicionar-pendencia/form";
import { formSchemaPendency } from "@/components/imoveis/EstatePendencia/adicionar-pendencia/formSchema";
import { registerAction } from "@/components/actionRegister";
import { redirect } from "next/navigation";
import { isDeleteestate } from "@/utils/isDeleteestate";

const MainTable = ({ filter }: { filter?: string | null }) => {
  const [data, setData] = useState<Estate[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [deletePopUpOpened, setDeletePopUpOpened] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);
  const [pendencies, setPendencies] = useState<Record<number, pendencyState[]>>(
    {}
  );

  const [isObserverBoolean, setIsObserverBoolean] = useState<boolean>(false);
  const [isdeleteestateBoolean, setIsdeleteestateBoolean] =
    useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = useState<any>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const supabase = createClient();

  useEffect(() => {
    isObserver().then((data) => {
      setIsObserverBoolean(Boolean(data));
    });
  }, []);

  useEffect(() => {
    isDeleteestate().then((data) => {
      setIsdeleteestateBoolean(Boolean(data));
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("estates").select("*");

      if (error) {
        console.error("Erro ao buscar dados:", error);
      } else {
        const sortedData = (data || []).sort((a, b) => a.id - b.id);
        setData(sortedData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;

    const fetchPendencies = async () => {
      const pendenciesMap: Record<number, pendencyState[]> = {};

      for (const estate of data) {
        const { data: pendencyData, error } = await supabase
          .from("pendencyState")
          .select("*")
          .eq("idState", estate.id);

        if (error) {
          console.error("Erro ao buscar pendências:", error);
        } else {
          pendenciesMap[estate.id] = pendencyData || [];
        }
      }

      setPendencies(pendenciesMap);
    };

    fetchPendencies();
  }, [data]);

  const openDeletePopUp = (estate: Estate) => {
    setSelectedEstate(estate);
    setDeletePopUpOpened(true);
  };

  const closeDeletePopUp = () => {
    setDeletePopUpOpened(false);
    setSelectedEstate(null);
  };

  useEffect(() => {
    const res = localStorage.getItem("user");
    if (!res) {
      redirect("/login");
      return;
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

  const requestDeleteEstate = async () => {
    if (!selectedEstate) {
      console.log("Nenhum imóvel selecionado.");
      return;
    }

    const user = localStorage.getItem("user");
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    const success = await registerAction(
      userName.name,
      `Deletar imóvel ${selectedEstate.nickname}`,
      "excluir",
      { id: selectedEstate.id }
    );

    if (success) {
      toast({
        title: "Solicitação de exclusão registrada com sucesso.",
        description:
          "O administrador revisará sua solicitação antes da alteração ser aplicada.",
      });
      closeDeletePopUp();
    } else {
      toast({ title: "Erro ao registrar solicitação de exclusão." });
    }
  };

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

      setData((prev) =>
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

  async function onPendencySubmit({
    nameEstate,
    pendency_acronym,
    date,
    idState,
  }: z.infer<typeof formSchemaPendency>) {
    const client = createClient();
    try {
      const [idpendency, pendencyAcronym] = pendency_acronym.split("-");
      const [idestate, name_Estate] = nameEstate.split("-");

      const payload = {
        idState,
        nameEstate,
        idpendency: Number(idpendency),
        pendency_acronym: pendencyAcronym,
        date,
      };

      console.log("Dados a serem enviados:", payload);

      const { data: estatesData, error } = await client
        .from("pendencyState")
        .insert([payload])
        .select();

      if (error) {
        console.error("Erro ao adicionar pendência:", error);
        toast({
          title: "Erro ao adicionar Pendência",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Pendência adicionada com sucesso!",
      });

      // Atualizar estado local ou redirecionar após o sucesso
      window.location.reload();
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({
        title: "Erro ao adicionar Pendência",
      });
    }
  }

  const filteredData = filter
    ? data?.filter((estate) => estate.proprietary === filter)
    : data;

  if (loading) return <Loading />;
  if (!filteredData || filteredData.length === 0)
    return <p>Nenhum dado encontrado.</p>;

  return (
    <div className="bg-white rounded-md overflow-scroll">
      <Table className="w-full overflow-auto table-bordered">
        <TableHeader>
          <TableRow>
            <TableHead>N.º</TableHead>
            <TableHead>Apelido</TableHead>
            <TableHead>Sigla de pendências</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="lowercase">{item.nickname}</TableCell>
              <TableCell>
                <div className="flex justify-between items-center">
                  {pendencies[item.id]?.map((pendency, idx) => (
                    <span key={idx}>
                      {pendency.pendency_acronym}
                      {idx < pendencies[item.id].length - 1 ? " | " : ""}
                    </span>
                  ))}

                  <Dialog>
                    <DialogTrigger>
                      <div>
                        <IconButton aria-label="adicionar" size="small">
                          <FiPlus size={14} />
                        </IconButton>

                        {pendencies[item.id]?.length === 0 && (
                          <Button
                            className="normal-case text-black underline text-[12px]"
                            size="small"
                            variant="text">
                            Adicionar Pendência
                          </Button>
                        )}
                      </div>
                    </DialogTrigger>
                    <DialogContent className="h-[60%]">
                      <DialogHeader>
                        <DialogTitle className="mb-8">
                          {`Adicionar pendência no imóvel ${item.nickname.toLowerCase()}`}
                        </DialogTitle>
                        <DialogDescription className="max-h-[550px]">
                          <PendencyStateComponent
                            onSubmit={onPendencySubmit}
                            nameEstate={item.nickname}
                            idState={item.id}
                          />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
              <TableCell>
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                  className="text-[12px]">
                  <Select
                    value={item.status}
                    onChange={(e) => handleChangeStatus(item.id, e)}
                    className="text-[12px]">
                    <MenuItem className="text-[12px]" value="Alugado">
                      Alugado
                    </MenuItem>
                    <MenuItem className="text-[12px]" value="À venda">
                      À venda
                    </MenuItem>
                    <MenuItem className="text-[12px]" value="A alugar">
                      A alugar
                    </MenuItem>
                    <MenuItem className="text-[12px]" value="Ocioso">
                      Ocioso
                    </MenuItem>
                    <MenuItem className="text-[12px]" value="A Adquirir">
                      A Adquirir
                    </MenuItem>
                    <MenuItem className="text-[12px]" value="Demandas">
                      Demandas
                    </MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-1">
                  <Button
                    size="small"
                    href={`/imovel/${item.id}`}
                    className="w-fit normal-case text-black underline text-[12px] p-0">
                    Ver imóvel
                  </Button>
                  {isObserverBoolean || !isdeleteestateBoolean ? (
                    <></>
                  ) : (
                    <Button
                      className="normal-case text-black underline text-[12px] p-0"
                      size="small"
                      onClick={() => openDeletePopUp(item)}>
                      Excluir
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PopupDelete
        estate={selectedEstate}
        closeDeletePopUp={closeDeletePopUp}
        Open={deletePopUpOpened}
        deleteEstate={requestDeleteEstate}
      />
    </div>
  );
};

export default MainTable;
