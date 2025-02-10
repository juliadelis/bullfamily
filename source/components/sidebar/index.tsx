import { isAdmin } from "@/utils/isAdmin";
import { useEffect, useState } from "react";
import { SidebarItem, SubSidebarItem } from "./sidebarItem";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FiPlus, FiMenu, FiX } from "react-icons/fi"; // Ícones para mobile
import { Estate } from "@/@types/estate";
import { isObserver } from "@/utils/isObserver";
import { isAddestate } from "@/utils/isAddestate";
import { Autocomplete, IconButton, TextField } from "@mui/material";

export const Sidebar = () => {
  const [isAdminBoolean, setIsAdminBoolean] = useState<boolean>(false);
  const [isObserverBoolean, setIsObserverBoolean] = useState<boolean>(false);
  const [isaddestateBoolean, setIsaddestateBoolean] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<Estate | null>(null);
  const [inputValue, setInputValue] = useState("");
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
        setUser(data[0]);
      });
  }, []);

  useEffect(() => {
    isAdmin().then((data) => {
      setIsAdminBoolean(Boolean(data));
    });
  }, []);

  useEffect(() => {
    isObserver().then((data) => {
      setIsObserverBoolean(Boolean(data));
    });
  }, []);

  useEffect(() => {
    isAddestate().then((data) => {
      setIsaddestateBoolean(Boolean(data));
    });
  }, []);

  const handleSelection = (newValue: Estate | null) => {
    setValue(newValue);
    if (newValue) {
      redirect(`/imovel/${newValue.id}`);
    }
  };

  return (
    <>
      <div className=" md:hidden fixed mx-auto border-b bg-[#E7E8E2] top-0 left-0 right-0 z-10">
        <div className="flex flex-row px-6 h-[54px] items-center justify-between">
          <IconButton
            className=" text-gray-800 "
            onClick={() => setIsOpen(true)}>
            <FiMenu size={24} />
          </IconButton>
          <div className="z-11">
            <Autocomplete
              value={value}
              onChange={(event, newValue) => {
                handleSelection(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={estates}
              getOptionLabel={(option) => option.nickname}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label="Busque um imóvel" />
              )}
              size="small"
            />
          </div>
        </div>
      </div>

      <aside
        className={`bg-[#E7E8E2] flex flex-col items-center pb-10 text-black min-w-[234px] min-h-screen fixed top-0 left-0 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <IconButton
          className="lg:hidden absolute top-4 right-4 text-gray-800 p-2 rounded-md"
          onClick={() => setIsOpen(false)}>
          <FiX size={24} />
        </IconButton>

        <div
          className="w-full flex flex-col gap-[10px] text-[12px] py-5 max-w-[234px] overflow-y-auto max-h-screen pb-[60px]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#c1c1c1 #f5f5f5",
          }}>
          {isObserverBoolean || !isaddestateBoolean ? null : (
            <SidebarItem
              href="/imovel/adicionar-imovel"
              text="Adicionar imóvel"
              icon={<FiPlus />}
            />
          )}
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
              <SubSidebarItem href="/admin/aprovacoes">
                Aprovações
              </SubSidebarItem>
            )}
          </SidebarItem>
          <SidebarItem text="Relatórios">
            <SubSidebarItem href="/">Todos os imóveis</SubSidebarItem>
            <SubSidebarItem href="/relatorios/imoveis-vagos">
              Imóveis Vagos
            </SubSidebarItem>
            <SubSidebarItem href="/relatorios/itens-gerais-de-pagamento-feitos-no-mes-em-curso">
              Itens gerais de pagamento feitos no mês em curso
            </SubSidebarItem>
            <SubSidebarItem href="/relatorios/ganhos-e-perdas-totais-do-mes">
              Receita Prevista
            </SubSidebarItem>
            <SubSidebarItem href="/relatorios/itens-gerais-de-pagamento-em-atraso-no-mes-em-curso">
              Itens gerais de pagamento em atraso no mês em curso
            </SubSidebarItem>
            <SubSidebarItem href="/relatorios/proprietarios">
              Proprietários
            </SubSidebarItem>
            <SubSidebarItem href="/relatorios/pagamentos-feitos-por-unidade-desde-o-contrato-ate-o-momento">
              Pagamentos feitos por unidade desde o contrato até o momento
            </SubSidebarItem>
            <SubSidebarItem href="/relatorios/contratos-a-vencer">
              Contratos a vencer
            </SubSidebarItem>
            {/* <SubSidebarItem href="/relatorios/providencias-a-serem-tomadas">
              Providências agendadas nos próximos 30 dias
            </SubSidebarItem> */}
            {/* <SubSidebarItem href="/relatorios/valor-do-aluguel-ate-o-presente-mes">
              Valor do aluguel pelo índice de contrato
            </SubSidebarItem> */}
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

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
};
