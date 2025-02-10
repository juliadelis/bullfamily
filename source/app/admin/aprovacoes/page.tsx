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
import { ProcessAction } from "@/components/ProcessAction";
import { FormatterUtils } from "@/utils/formatter.utils";

type Props = {};

type PendingAction = {
  id: string;
  user: string;
  action: string;
  data: any;
  created_at: string;
  status: string;
};

const menuItems = [
  { label: "Painel do admin", href: "/admin" },
  { label: "Novo usuário", href: "/admin/add-usuario" },
  { label: "Aprovações", href: "/admin/aprovacoes" },
];

export default function Aprovacoes(props: Props) {
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
  const client = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<{ id: string }>();
  const [isAdminBoolean, setIsAdminBoolean] = useState<boolean>(false);
  const [actions, setActions] = useState<PendingAction[]>([]);
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

  useEffect(() => {
    const fetchActions = async () => {
      const { data, error } = await client
        .from("actions_pending")
        .select("*")
        .eq("status", "pendente");

      if (error) {
        console.error("Erro ao buscar ações pendentes:", error);
        return;
      }

      if (data) {
        setActions(data as PendingAction[]);
      }
    };

    fetchActions();
  }, []);

  const handleAction = async (actionId: string, approve: boolean) => {
    const success = await ProcessAction(actionId, approve);
    if (success) {
      setActions((prevActions) =>
        prevActions.filter((action) => action.id !== actionId)
      );
    }
  };

  if (loading) return <Loading />;

  if (!isAdminBoolean) return <Loading />;

  if (!users) return <Loading />;

  if (users.length === 0) return <Loading />;

  if (!user) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-4 p-4 ">
      <div className="bg-white rounded-lg">
        <div className="flex">
          <SubMenu menuItems={menuItems} />
        </div>
        <Table className="w-full overflow-auto table-bordered">
          <TableHeader>
            <TableRow>
              <TableHead>Mudança</TableHead>
              <TableHead className="w-[300px]">Usuário</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => {
              return (
                <TableRow key={action.id}>
                  <TableCell>{action.action}</TableCell>
                  <TableCell className="w-[300px]">{action.user}</TableCell>
                  <TableCell>
                    {FormatterUtils.formatDateTime(action.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="text"
                        className="normal-case underline text-black font-[12px]"
                        onClick={() => handleAction(action.id, true)}>
                        Aprovar
                      </Button>

                      <Button
                        variant="text"
                        className="normal-case underline text-black font-[12px]"
                        onClick={() => handleAction(action.id, false)}>
                        Recusar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
