"use client";
import BackButton from "@/components/back-button";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";
import { formSchema } from "../../formSchema";
import { Form } from "../../form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function EditarUsuario({
  params: { uid },
}: {
  params: { uid: string };
}) {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);
  const [user, setUser] = useState<any>("");
  const { toast } = useToast();
  const { replace, refresh } = useRouter();

  useEffect(() => {
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
  }, []);

  async function onSubmit({
    email,
    name,
    isObserver,
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
        new_isobserver: isObserver,
      });

      if (error || errorObserver) {
        console.log({ errorObserver });
        toast({
          title: `Erro de atualização de usuário`,
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
    <div className="w-full flex flex-col gap-16 p-4 md:p-16">
      <div className="bg-white p-6 rounded-lg">
        <BackButton />
        {user && (
          <div className="w-1/2">
            <Form onSubmit={onSubmit} user={user} />
            <div className="my-8">
              <Button onClick={changePasswordEmail}>
                Enviar email para usuário alterar a senha
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
