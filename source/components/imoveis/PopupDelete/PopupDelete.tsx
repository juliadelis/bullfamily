"use client";
import { Estate } from "@/@types/estate";
import { EstateLike } from "@/app/imovel/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export interface Props {
  Open?: boolean;
  closeDeletePopUp: () => void;
  estate: null | EstateLike | Estate;
  deleteEstate: () => void;
}

const PopupDelete = ({
  Open,
  closeDeletePopUp,
  estate,
  deleteEstate,
}: Props) => {
  return (
    <div
      className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-50 z-10 align-middle ${
        Open ? "flex " : "hidden"
      }`}>
      <div
        className={
          "relative md:left-[25%] top-[25%] flex flex-col bg-white h-[270px] w-[510px] rounded-xl p-[25px] justify-between "
        }>
        <div>
          <button onClick={closeDeletePopUp}>X Fechar</button>
        </div>
        <div className={" flex flex-col h-[60%] gap-[60px] items-center"}>
          <h3>Tem certeza de que quer excluir {estate?.nickname}</h3>
          <div className={" flex gap-[20px]"}>
            <Button onClick={deleteEstate}>Excluir</Button>
            <button onClick={closeDeletePopUp}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupDelete;
