import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { pendencyAcronymProps } from "./types";

const AcronymPendencyTable = ({ data }: { data: pendencyAcronymProps }) => {
  const deletePencency = async (id: number) => {
    const client = createClient();

    try {
      const { error } = await client
        .from("pendencyAcronym")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: `Erro ao excluir sigla!`,
          variant: `destructive`,
        });
        return;
      }

      toast({
        title: `Sigla excluído com sucesso!`,
      });
      location.reload();
    } catch (error) {
      toast({
        title: `Erro ao excluir sigla!`,
        variant: `destructive`,
      });
    }
  };
  return (
    <div>
      {" "}
      <div className=" rounded-b-none flex items-center [#F1F5F9]  py-[0.75rem] ">
        <p className="text-[rgb(51,65,85)] text-xl font-semibold mb-4">
          Siglas de Pendências
        </p>
      </div>
      <Table>
        <ScrollArea className="border rounded-md  h-[30vh]">
          <TableHeader className="border-b ">
            <TableHead>Sigla</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow>
                <>
                  <TableCell className="font-medium w-[100px]">
                    {String(item.acronym)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {String(item.description)}
                  </TableCell>
                  <TableCell className="font-medium text-right">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deletePencency(item.id);
                      }}>
                      Deletar
                    </Button>
                  </TableCell>
                </>
              </TableRow>
            ))}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  );
};

export default AcronymPendencyTable;
