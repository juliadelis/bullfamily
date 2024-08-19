"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import userIcon from "../../assets/icons/user.svg";
import Link from "next/link";
import { fetchAllUsers, User } from "@/utils/fetchAllUsers";
import DeleteButton from "./deleteButton";
import { isAdmin } from "@/utils/isAdmin";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import { createClient } from "@/utils/supabase/client";

type Props = {};

export default function Admin(props: Props) {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    const parsedUser = JSON.parse(user).data.user;

    const client = createClient();

    client
      .from("profiles")
      .select("*")
      .eq("id", parsedUser.id)
      .then(({ data }) => {
        if (!data) return;
        const user = data[0];
        if (!user.isadmin) {
          window.location.replace("/");
        }
        setloading(false);
      });
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<{ id: string }>();
  const [isAdminBoolean, setIsAdminBoolean] = useState<boolean>(false);
  useEffect(() => {
    isAdmin().then((data) => {
      setIsAdminBoolean(Boolean(data));
    });
  }, []);

  useEffect(() => {
    fetchAllUsers().then((data) => {
      if (!data) return;
      setUsers(data);
    });
    getUser().then((data) => {
      if (!data) return;
      setUser(data);
    });
  }, []);
  if (loading) return <Loading />;

  if (!isAdminBoolean) return <Loading />;

  if (!users) return <Loading />;

  if (users.length === 0) return <Loading />;

  if (!user) return <Loading />;

  const isUser = (id: string) => user?.id === id;

  return (
    <div className="w-full flex flex-col gap-16 p-4 md:p-16">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex gap-4 mb-6">
          <Image alt="User icon" src={userIcon} width={24} height={24} />
          Lista de Usuários
        </div>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(({ email, name, id }) => {
              if (isUser(id)) return;
              return (
                <TableRow key={id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                     <Link href={`/admin/editar-usuario/${id}`}>
                    <Button variant="outline">Editar</Button>
                  </Link> 
                    <DeleteButton id={id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Link href="/admin/add-usuario">
          <Button className="max-w-52 h-11 uppercase bg-black mt-6">
            Adicionar usuário
          </Button>
        </Link>
      </div>
    </div>
  );
}
