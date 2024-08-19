import { isAdmin } from "@/utils/isAdmin";
import { useEffect, useState } from "react";
import { SidebarItem } from "./sidebarItem";

export const Sidebar = () => {
  const [isAdminBoolean, setIsAdminBoolean] = useState<boolean>(false);
  useEffect(() => {
    isAdmin().then((data) => {
      setIsAdminBoolean(Boolean(data));
    });
  }, []);

  return (
    <aside className="bg-black flex flex-col items-center justify-between pt-10 pb-10 text-white w-2/12">
      <div className="text-3xl w-full pl-[10%] flex flex-col gap-2">
        <p>Bull Family</p>
        <p>Real State</p>
      </div>
      <div className="w-full pl-[10%] flex flex-col gap-10 text-md">
        <SidebarItem href="/">HOME</SidebarItem>
        <SidebarItem href="/imovel">IMÓVEL</SidebarItem>
        <SidebarItem href="/relatorios">RELATÓRIOS</SidebarItem>
        <SidebarItem href="/inadimplentes">IMÓVEIS INADIMPLENTES</SidebarItem>
        {isAdminBoolean && (
          <SidebarItem href="/admin">PAINEL DO ADMINISTRADOR</SidebarItem>
        )}
      </div>
      <div className="w-full pl-[10%] flex text-md">
        <SidebarItem href="/usuario">USUÁRIO</SidebarItem>
      </div>
    </aside>
  );
};
