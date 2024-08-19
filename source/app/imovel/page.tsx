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
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const [estates, setEstates] = useState<Estate[] | null>();
  const [deletePopUpOpened, setDeletePopUpOpened] = useState(false);
  const [selectedEstate, setselectedEstate] = useState<Estate | null>(null);
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data, error }) => {
        console.log(error);

        if (!data) return;

        setEstates(data.sort((a: Estate, b: Estate) => a.id - b.id));
      });
  }, []);

  const openDeletePopUp = (estate: Estate) => {
    setselectedEstate(estate);
    setDeletePopUpOpened(true);
  };

  const closeDeletePopUp = () => {
    setDeletePopUpOpened(false);
    setselectedEstate(null);
  };

  const deleteEstate = async () => {
    const supabase = createClient();
    try {
      if (!selectedEstate) {
        console.log("Não tem imovel selecionado");
        return;
      }

      const { error } = await supabase
        .from("estates")
        .delete()
        .eq("id", String(selectedEstate.id));

      if (error) {
        console.log({ error });
        return;
      }
      location.reload();

      closeDeletePopUp();
    } catch (error) {
      console.log(error);
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
        deleteEstate={deleteEstate}
      />
    </div>
  );
}
