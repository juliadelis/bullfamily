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
    <Button onClick={destroyUser} variant="ghost">
      <Image alt="Icone de lixo" src={trashIcon} width={24} height={24} />
    </Button>
  );
};

export default DeleteButton;
