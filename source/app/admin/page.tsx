"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAllUsers, User } from "@/utils/fetchAllUsers";
import DeleteButton from "./deleteButton";
import { isAdmin } from "@/utils/isAdmin";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import { createClient } from "@/utils/supabase/client";
import SubMenu from "@/components/submenu";
import "./index.css";
import { Button } from "@mui/material";
import { LuPencil } from "react-icons/lu";
import { isObserver } from "@/utils/isObserver";
import { isPersonalized } from "@/utils/isPersonalized";

type Props = {};

const menuItems = [
  { label: "Painel do admin", href: "/admin" },
  { label: "Novo usuário", href: "/admin/add-usuario" },
  { label: "Aprovações", href: "/admin/aprovacoes" },
];

export default function Admin(props: Props) {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
      return;
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
  useState<boolean>(false);
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
    <div className="w-full flex flex-col gap-4 p-4 ">
      <div className="bg-white rounded-lg">
        <div className="flex">
          <SubMenu menuItems={menuItems} />
        </div>
        <Table className="w-full overflow-auto table-bordered">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(
              ({ email, name, id, isadmin, isobserver, personalized }) => {
                if (isUser(id)) return;
                return (
                  <TableRow key={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      {isadmin
                        ? "Administrador"
                        : isobserver
                        ? "Consulta"
                        : "Personalizado"}
                    </TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/editar-usuario/${id}`}>
                          <Button
                            variant="text"
                            className="normal-case text-black font-12px"
                            startIcon={<LuPencil size={12} />}>
                            Editar
                          </Button>
                        </Link>
                        <DeleteButton id={id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
        <Link href="/admin/add-usuario">
          <Button className="normal-case bg-black text-white mt-6">
            Adicionar usuário
          </Button>
        </Link>
      </div>
    </div>
  );
}
