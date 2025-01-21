"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import trashIcon from "../../assets/icons/trash-2.svg";
import { deleteUser } from "@/utils/deleteUser";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  id: string;
}

const DeleteButton = ({ id }: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = () => {
    destroyUser(id);
  };

  const destroyUser = async (userId: string) => {
    try {
      const data = await deleteUser(userId);
      if (data) {
        toast({
          title: "Usuário deletado com sucesso",
          description: "O usuário foi removido com sucesso do sistema.",
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      toast({
        title: "Erro ao deletar usuário",
        description:
          "Ocorreu um erro ao tentar deletar o usuário. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleDelete} variant="ghost" aria-label="Deletar usuário">
      <Image alt="Ícone de lixo" src={trashIcon} width={24} height={24} />
    </Button>
  );
};

export default DeleteButton;
