"use client";
import AddImovel from "@/components/imoveis/addImovel";
import BuscarImovel from "@/components/imoveis/buscarImovel";
import ImoveisList from "@/components/imoveis/imoveisList";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import PopupDelete from "@/components/imoveis/PopupDelete/PopupDelete";

import Loading from "@/components/loading";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";
import { registerAction } from "@/components/actionRegister";
import { toast } from "@/components/ui/use-toast";

export interface EstateLike {
  pendencias?: any;
  pagamentoPendente?: any;
  id: number;
  status: string;
  nickname: string;
  address: string;
  paymentDay?: number;
  paymentLocation?: string;
  rentalValue?: number;
  numOfRooms?: number;
  cleaning: boolean;
  elevator: boolean;
  garage?: boolean;
  contractWith?: string;
  startDate?: string;
  endDate?: string;
  readjustmentIndex: string;
  administrator?: string;
  administratorPhoneNumber?: number;
  admistratorEmail?: string;
  administrateTax?: string;
  lessee?: string;
  lesseePhone?: number;
  optionalContactName?: string;
  optionalContactNumber?: number;
  guarantor?: string;
  guarnatorData?: string;
  guarnatorNumber?: string;
  condominium?: string;
  IPTU?: string;
  observation?: string;
  userId?: string;
  type?: string;
}

export default function Imovel() {
  const [loading, setLoading] = useState(true);
  const [estates, setEstates] = useState<EstateLike[] | null>(null);
  const [deletePopUpOpened, setDeletePopUpOpened] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<EstateLike | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchEstates = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("estates").select("*");

      if (error) {
        toast({
          title: `Erro ao buscar imóveis: ${error}`,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setEstates(data.sort((a: EstateLike, b: EstateLike) => a.id - b.id));
      }
    };

    fetchEstates();
  }, []);

  const openDeletePopUp = (estate: EstateLike) => {
    setSelectedEstate(estate);
    setDeletePopUpOpened(true);
  };

  const closeDeletePopUp = () => {
    setDeletePopUpOpened(false);
    setSelectedEstate(null);
  };

  const requestDeleteEstate = async () => {
    if (!selectedEstate) {
      toast({ title: "Nenhum imóvel selecionado." });
      return;
    }

    const user = localStorage.getItem("user");
    if (!user) {
      toast({ title: "Usuário não autenticado." });
      return;
    }

    const success = await registerAction(
      user,
      `Deletar imóvel ${selectedEstate.nickname}`,
      "excluir",
      { id: selectedEstate.id }
    );

    if (success) {
      toast({ title: "Solicitação de exclusão registrada com sucesso." });
      closeDeletePopUp();
    } else {
      console.error("Erro ao registrar solicitação de exclusão.");
    }
  };
  if (loading) return <Loading />;

  if (!estates) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col p-4 md:p-10 md:min-w-[100vw] absolute">
        <div className="bg-white w-[90vw] md:w-[90vw] rounded-lg p-6">
          <BuscarImovel />

          <div className="mb-8 md:max-h-[60vh] rounded-md border overflow-y-scroll scroll-smooth">
            <ImoveisList openDeletePopUp={openDeletePopUp} datas={estates} />
          </div>
        </div>
      </div>
      <PopupDelete
        estate={selectedEstate}
        closeDeletePopUp={closeDeletePopUp}
        Open={deletePopUpOpened}
        deleteEstate={requestDeleteEstate}
      />
    </div>
  );
}
