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
    isObserver
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
            isAdmin: false,
            isObserver
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
    <div className="w-full flex flex-col p-4 md:p-16">
      <div className="bg-white p-6 rounded-lg gap-6 md:gap-16 w-[90vw] md:w-fit">
        <BackButton />
        <div className="w-1/2">
          <Form onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
