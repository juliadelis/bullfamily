"use client";

import AddImovel from "@/components/imoveis/addImovel";
import BuscarImovel from "@/components/imoveis/buscarImovel";
import ImoveisList from "@/components/imoveis/imoveisList";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import PopupDelete from "@/components/imoveis/PopupDelete/PopupDelete";

import Loading from "@/components/loading";
import { redirect } from "next/navigation";

export interface Estate {
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
  const [estates, setEstates] = useState<Estate[] | null>(null);
  const [deletePopUpOpened, setDeletePopUpOpened] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = localStorage.getItem("user");
      if (!user) {
        redirect("/login");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchEstates = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("estates").select("*");

      if (error) {
        console.error("Erro ao buscar imóveis:", error);
        return;
      }

      if (data) {
        setEstates(data.sort((a: Estate, b: Estate) => a.id - b.id));
      }
    };

    fetchEstates();
  }, []);

  const openDeletePopUp = (estate: Estate) => {
    setSelectedEstate(estate);
    setDeletePopUpOpened(true);
  };

  const closeDeletePopUp = () => {
    setDeletePopUpOpened(false);
    setSelectedEstate(null);
  };

  const deleteEstate = async () => {
    const supabase = createClient();
    try {
      if (!selectedEstate) {
        console.log("Nenhum imóvel selecionado.");
        return;
      }

      const { error } = await supabase
        .from("estates")
        .delete()
        .eq("id", selectedEstate.id);

      if (error) {
        console.error("Erro ao deletar imóvel:", error);
        return;
      }

      setEstates((prev) =>
        prev ? prev.filter((estate) => estate.id !== selectedEstate.id) : null
      );
      closeDeletePopUp();
    } catch (error) {
      console.error("Erro ao deletar imóvel:", error);
    }
  };

  if (loading) return <Loading />;

  if (!estates) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col p-4  absolute">
        <div className="bg-white rounded-lg p-6">
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
        deleteEstate={deleteEstate}
      />
    </div>
  );
}
