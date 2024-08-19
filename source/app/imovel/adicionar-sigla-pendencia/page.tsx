"use client";
import React, { useEffect, useState } from "react";
import { PendencyAcronymComponent } from "./form";
import { formSchemaAcronym } from "./formSchema";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import { isAuthenticated } from "@/utils/isAuthenticated";
import Loading from "@/components/loading";

export default function AdicionarImovel() {
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
    acronym,
    description,
  }: z.infer<typeof formSchemaAcronym>) {
    const client = createClient();
    try {
      const { data: estatesData, error } = await client
        .from("pendencyAcronym")
        .insert([
          {
            acronym,
            description,
          },
        ])
        .select();

      if (error) {
        console.log({ error });
        return;
      }
      toast({
        title: "Sigla adicionada com sucesso!",
      });
      router.replace("/imovel/sigla-pendencia/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao adicionar sigla",
      });
    }
  }

  if (loading) return <Loading />;
  return (
    <div className="flex flex-col pl-16  h-screen">
      <PendencyAcronymComponent onSubmit={onSubmit} />
    </div>
  );
}
