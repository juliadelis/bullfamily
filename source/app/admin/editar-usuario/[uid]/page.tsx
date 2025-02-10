"use client";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";
import { formSchema } from "../../formSchema";
import { Form } from "../../form";
import { use, useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { Button } from "@mui/material";

export default function EditarUsuario({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = use(params);

  const [loading, setloading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const { replace, refresh } = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  useEffect(() => {
    if (!uid) return;
    const client = createClient();
    client
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .then(({ data }) => {
        if (data) {
          setUser(data[0]);
        }
      });
  }, [uid]);

  async function onSubmit({
    email,
    name,
    isobserver,
    isadmin,
    personalized,
    addestate,
    editestate,
    deleteestate,
    editpayments,
    edithistory,
    delethistory,
  }: z.infer<typeof formSchema>) {
    const client = createClient();
    try {
      const { data, error } = await client.rpc("update_user", {
        user_id: uid,
        new_email: email,
        new_name: name,
      });

      const { error: errorObserver } = await client.rpc("update_is_observer", {
        user_id: uid,
        new_isobserver: isobserver,
      });

      const { error: errorAdmin } = await client.rpc("update_is_admin", {
        user_id: uid,
        new_isadmin: isadmin,
      });

      const { error: errorPersonalized } = await client.rpc(
        "update_personalized",
        {
          user_id: uid,
          new_personalized: personalized,
        }
      );

      const { error: errorAddEstate } = await client.rpc("update_add_estate", {
        user_id: uid,
        new_addestate: addestate,
      });

      const { error: errorEditEstate } = await client.rpc(
        "update_edit_estate",
        {
          user_id: uid,
          new_editestate: editestate,
        }
      );

      const { error: errorDeleteEstate } = await client.rpc(
        "update_delete_estate",
        {
          user_id: uid,
          new_deleteestate: deleteestate,
        }
      );

      const { error: errorEditPayments } = await client.rpc(
        "update_edit_payments",
        {
          user_id: uid,
          new_editpayments: editpayments,
        }
      );

      const { error: errorEditHistory } = await client.rpc(
        "update_edit_history",
        {
          user_id: uid,
          new_edithistory: edithistory,
        }
      );

      const { error: errorDeleteHistory } = await client.rpc(
        "update_delete_history",
        {
          user_id: uid,
          new_delethistory: delethistory,
        }
      );

      if (
        error ||
        errorObserver ||
        errorAdmin ||
        errorPersonalized ||
        errorAddEstate ||
        errorEditEstate ||
        errorDeleteEstate ||
        errorEditPayments ||
        errorEditHistory ||
        errorDeleteHistory
      ) {
        console.error({
          error,
          errorObserver,
          errorAdmin,
          errorPersonalized,
          errorAddEstate,
          errorEditEstate,
          errorDeleteEstate,
          errorEditPayments,
          errorEditHistory,
          errorDeleteHistory,
        });

        toast({
          title: "Erro de atualização de usuário",
          variant: "destructive",
        });
        return;
      }

      replace("/admin");
      refresh();
      toast({
        title: `${name} atualizado com sucesso!`,
      });
    } catch (error) {
      console.error(error);
    }
  }
  async function changePasswordEmail() {
    await createClient().auth.resetPasswordForEmail(user?.email, {
      redirectTo: "https://www.bullfamilyrealstate.com/usuario/mudar-senha",
    });
  }
  if (loading) return <Loading />;
  if (!user) return;
  return (
    <div className="w-full flex flex-col gap-4 p-4 ">
      <div className="bg-white  rounded-lg">
        {user && (
          <div>
            <Form onSubmit={onSubmit} user={user} />
            <div className="my-8">
              <Button
                className="bg-black text-white normal-case"
                onClick={changePasswordEmail}>
                Enviar email para usuário alterar a senha
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
