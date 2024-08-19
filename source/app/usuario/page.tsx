"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuUser } from "react-icons/lu";

type Props = {};

export default function Usuario(props: Props) {
  const [loading, setloading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const res = localStorage.getItem("user");
    if (!res) {
      redirect("/login");
    }

    const parsedUser = JSON.parse(res).data.user;

    const client = createClient();

    client
      .from("profiles")
      .select("*")
      .eq("id", parsedUser.id)
      .then(({ data }) => {
        if (!data) return;
        setUser(data[0]);
        setloading(false);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.replace("/login");
  };

  if (loading || !user) return <Loading />;

  return (
    <div className="p-10 flex flex-col">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex mb-8 ">
          <LuUser className="mr-2 h-6 w-6" />
          <h3 className="text-lg font-black">Sua conta</h3>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <h4 className="text-md">Email: {user.email}</h4>
            <h4 className="text-md">Nome: {user.name}</h4>
          </div>
          <Button onClick={() => logout()}>Sair</Button>
        </div>
      </div>
    </div>
  );
}
