import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { LuFileText } from "react-icons/lu";

interface Props {
  botao?: boolean;
}

const RelatoriosConteudo = ({ botao }: Props) => {
  const Relatorio = [
    {
      link: "/relatorios/itens-gerais-de-pagamento-feitos-no-mes-em-curso",
      name: "Itens gerais de pagamento feitos no mês em curso",
    },
    {
      link: "/relatorios/itens-gerais-de-pagamento-em-atraso-no-mes-em-curso",
      name: "Itens gerais de pagamento em atraso no mes em curso",
    },
    {
      link: "/relatorios/contratos-a-vencer-no-proximo-mes",
      name: "Contratos a vencer",
    },
    {
      link: "/relatorios/pagamentos-aluguel-imoveis/",
      name: "Pagamentos de aluguel de imóveis",
    },
    {
      link: "/relatorios/imoveis-vagos-neste-mes",
      name: "Imóveis vagos neste mês",
    },
    {
      link: "/relatorios/pendencias-imoveis",
      name: "Relatório de pendências",
    },
    {
      link: "/relatorios/ganhos-e-perdas-totais-do-mes",
      name: "Relatório de ganhos e perdas totais do mês",
    },
  ];
  return (
    <div className="flex flex-col justify-between items-end ">
      <div className="flex flex-col gap-5">
        <div className="flex pb-4">
          <LuFileText className="mr-2 h-6 w-6" />
          <h3 className="font-black  text-lg">Relatórios</h3>
        </div>

        {Relatorio.map((relatorio, i) => (
          <ul key={i}>
            <li className="relative pl-[32px]">
              <div className="max-w-3 w-3 h-1 max-h-1 min-w-3 min-h-1 rounded-3xl bg-black absolute left-0 top-[50%] translate-y-[-50%]"></div>
              <Link href={`${relatorio.link}`}>{relatorio.name}</Link>
            </li>
          </ul>
        ))}
      </div>
      {botao ? (
        <></>
      ) : (
        <Button variant={"underline"} asChild>
          <Link href="/relatorios">Ver mais...</Link>
        </Button>
      )}
    </div>
  );
};

export default RelatoriosConteudo;
