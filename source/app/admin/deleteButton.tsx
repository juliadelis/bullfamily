"use client";

import Image from "next/image";
import React from "react";

import { deleteUser } from "@/utils/deleteUser";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";

interface Props {
  id: string;
}
const DeleteButton = ({ id }: Props) => {
  const { toast } = useToast();

  const destroyUser = async () => {
    try {
      const data = await deleteUser(id);
      if (data) {
        toast({
          title: "Usuário deletado com sucesso",
        });
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Erro ao deletar usuário",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      onClick={destroyUser}
      variant="text"
      className="text-12 normal-case text-black"
      startIcon={<AiOutlineDelete size={14} />}
      aria-label="Deletar usuário">
      Excluir
    </Button>
  );
};

export default DeleteButton;
