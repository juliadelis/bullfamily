"use client";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Form } from "./form";
import { formSchema } from "./formSchema";
import { RiLockPasswordLine } from "react-icons/ri";
import Loading from "@/components/loading";

const Page = ({ params: { token } }: { params: { token: string } }) => {
  const { toast } = useToast();
  const { replace } = useRouter();
  const changePassword = async ({ password }: z.infer<typeof formSchema>) => {
    try {
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(token);
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) {
        console.warn(error);
        toast({
          title: "Erro ao alterar senha!",
        });
        return;
      }
      toast({
        title: "Senha alterada com sucesso!",
      });
      replace("/");
    } catch (error) {
      console.warn(error);
      toast({
        title: "Erro ao alterar senha!",
      });
    }
  };

  return (
    <div className="w-[40vw] p-10 flex flex-col">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex mb-8 ">
          <RiLockPasswordLine className="mr-2 h-6 w-6" />
          <h3 className="text-lg font-black">Altere sua senha</h3>
        </div>
        <Form onSubmit={changePassword} />
      </div>
    </div>
  );
};

export default Page;
