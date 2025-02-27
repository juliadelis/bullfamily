"use client";
import { use, useEffect, useState } from "react";
import { EstateForm } from "../../adicionar-imovel/form";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Estate } from "@/@types/estate";
import { formSchema } from "../../adicionar-imovel/formSchema";
import { z } from "zod";
import Loading from "@/components/loading";
import { registerAction } from "@/components/actionRegister";

export default function EditEstatePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const [estate, setEstate] = useState<Estate | null>(null);
  const { toast } = useToast();
  const { replace, refresh } = useRouter();
  const [userName, setUserName] = useState<any>(null);

  useEffect(() => {
    const res = localStorage.getItem("user");
    if (!res) {
      redirect("/login");
      return;
    }

    const parsedUser = JSON.parse(res).data.user;

    const client = createClient();

    client
      .from("profiles")
      .select("*")
      .eq("id", parsedUser.id)
      .then(({ data }) => {
        if (!data) return;
        setUserName(data[0]);
        setloading(false);
      });
  }, []);

  useEffect(() => {
    const client = createClient();
    client
      .from("estates")
      .select("*")
      .eq("id", Number(slug))
      .then(({ data }) => {
        if (data) {
          setEstate(data[0]);
        }
      });
  }, []);

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    if (!estate?.id) return;

    const sanitizedFormData = {
      ...formData,
      id: Number(estate.id),
      guarnatorNumber: formData.guarnatorNumber
        ? Number(formData.guarnatorNumber)
        : null,
      taxIPTU: formData.taxIPTU ? Number(formData.taxIPTU) : null,
      rentValue: formData.rentValue ? Number(formData.rentValue) : null,
      gas: formData.gas ? Number(formData.gas) : null,
      light: formData.light ? Number(formData.light) : null,
      water: formData.water ? Number(formData.water) : null,
    };

    try {
      const actionRegistered = await registerAction(
        userName.name,
        `Edição do imóvel ${estate.nickname}`,
        "editar",
        {
          ...sanitizedFormData,
        }
      );

      if (!actionRegistered) {
        toast({
          title: "Erro ao solicitar edição",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Solicitação enviada para aprovação!",
        description:
          "O administrador revisará sua solicitação antes da alteração ser aplicada.",
      });

      replace("/");
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) return <Loading />;
  if (!estate) return;

  return (
    <div className="w-[full]">
      <div className="bg-white p-4 rounded-lg">
        <EstateForm estate={estate} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
