import { isAdmin } from "@/utils/isAdmin";
import { useEffect, useState } from "react";
import { SidebarItem, SubSidebarItem } from "./sidebarItem";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FiPlus } from "react-icons/fi";
import { Estate } from "@/@types/estate";

export const Sidebar = () => {
  const [isAdminBoolean, setIsAdminBoolean] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [estates, setEstates] = useState<Estate[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data }) => {
        if (!data) return;

        setEstates(data.sort((a: Estate, b: Estate) => a.id - b.id));
      });
  }, []);

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
      });
  }, []);

  useEffect(() => {
    isAdmin().then((data) => {
      setIsAdminBoolean(Boolean(data));
    });
  }, []);

  return (
    <aside className="bg-[#E7E8E2] flex flex-col items-center pb-10 text-black min-w-[234px] min-h-screen fixed">
      <div
        className="w-full flex flex-col gap-[10px] text-[12px] py-5 max-w-[234px] overflow-y-auto max-h-screen"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#c1c1c1 #f5f5f5",
        }}>
        <SidebarItem href="/" text="Adcionar imóvel" icon={<FiPlus />} />
        <SidebarItem text={user?.name}>
          {isAdminBoolean && (
            <SubSidebarItem href="/admin">Painel do Admin</SubSidebarItem>
          )}
          {isAdminBoolean && (
            <SubSidebarItem href="/admin/add-usuario">
              Novo usuário
            </SubSidebarItem>
          )}
          {isAdminBoolean && (
            <SubSidebarItem href="/admin/aprovacoes">Aprovações</SubSidebarItem>
          )}
        </SidebarItem>
        <SidebarItem text="Relatórios">
          <SubSidebarItem href="/imovel">Todos os imóveis</SubSidebarItem>
          <SubSidebarItem href="/admin">Imóveis Vagos</SubSidebarItem>
          <SubSidebarItem href="/imovel">
            Itens gerais de pagamento feitos no mês em curso
          </SubSidebarItem>
          <SubSidebarItem href="/receita-prevista">
            Receita Prevista
          </SubSidebarItem>
          <SubSidebarItem href="/admin">
            Itens gerais de pagamento em atraso no mes em curso
          </SubSidebarItem>
          <SubSidebarItem href="/imovel">
            Itens de providência em atraso no mes em curso
          </SubSidebarItem>
          <SubSidebarItem href="/receita-prevista">
            Pagamentos feitos por unidade desde o contrato até o momento
          </SubSidebarItem>
          <SubSidebarItem href="/receita-prevista">
            Contratos a vencer
          </SubSidebarItem>
          <SubSidebarItem href="/receita-prevista">
            Providências agendadas a serem tomadas nos próximos 30 dias de todos
            os imóveis
          </SubSidebarItem>
          <SubSidebarItem href="/receita-prevista">
            Valor do aluguel até o presente mes pelo indice de contrato
          </SubSidebarItem>
        </SidebarItem>
        <SidebarItem text="Lista de Imóveis">
          {estates?.map((estate, i) => (
            <SubSidebarItem key={i} href={`/imovel/${estate.id}`}>
              {estate.nickname}
            </SubSidebarItem>
          ))}
        </SidebarItem>
      </div>
    </aside>
  );
};
