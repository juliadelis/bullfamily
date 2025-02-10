"use client";
import BackButton from "@/components/back-button";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";
import { formSchema } from "../formSchema";
import { Form } from "../form";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Divider, Typography } from "@mui/material";
import SubMenu from "@/components/submenu";

const menuItems = [
  { label: "Painel do admin", href: "/admin" },
  { label: "Novo usuário", href: "/admin/add-usuario" },
  { label: "Aprovações", href: "/admin/aprovacoes" },
];

export default function AddUsuario() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit({
    email,
    name,
    password,
    isobserver,
    isadmin,
    addestate,
    confirmPassword,
    delethistory,
    deleteestate,
    editestate,
    edithistory,
    editpayments,
    personalized,
  }: z.infer<typeof formSchema>) {
    const client = createClient();

    try {
      const {
        data: { session },
      } = await client.auth.getSession();

      if (!session) return;
      await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            email,
            name,
            isobserver,
            isadmin,
            addestate,
            confirmPassword,
            delethistory,
            deleteestate,
            editestate,
            edithistory,
            editpayments,
            personalized,
          },
        },
      });

      client.auth.setSession(session);

      toast({
        title: "Usuário adicionado com sucesso!",
      });
      router.replace("/admin");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao adicionar usuário",
        variant: "destructive",
      });
    }
  }
  if (loading) return <Loading />;
  return (
    <div className="w-full flex flex-col p-4 ">
      <div className="bg-white rounded-lg gap-4 md:w-fit">
        <SubMenu menuItems={menuItems} />
        <Divider />
        <div className="mt-4">
          <Form onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
