import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { ImovelDataProps } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { isObserver } from "@/utils/isObserver";

const ImovelHistoryTable = ({ data }: { data: ImovelDataProps }) => {
  const deleteHistory = async (id: number) => {
    const client = createClient();

    try {
      const { error } = await client.from("historys").delete().eq("id", id);

      if (error) {
        toast({
          title: `Erro ao excluir histórico!`,
          variant: `destructive`,
        });
        return;
      }

      toast({
        title: `Histórico excluído com sucesso!`,
      });
      location.reload();
    } catch (error) {
      toast({
        title: `Erro ao excluir histórico!`,
        variant: `destructive`,
      });
    }
  };
  const [isObserverBoolean, setIsObserverBoolean] = useState<boolean>(false);
  useEffect(() => {
    isObserver().then((data) => {
      setIsObserverBoolean(Boolean(data));
    });
  }, []);
  return (
    <div className="bg-white  rounded-md">
      {" "}
      <div className="rounded-md border border-b-0 rounded-b-none flex items-center  [#F1F5F9] px-4 py-[0.75rem]">
        <p className="text-[#334155] text-md font-semibold">Histórico</p>
      </div>
      <Table>
        <TableBody>
          <ScrollArea className="h-[18vh] border rounded-b-md ">
            {data?.map((item) => (
              <TableRow>
                {item.data && item.created_at && (
                  <>
                    <TableCell className="font-medium w-[100px]">
                      {format(item.created_at, "PPP", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {String(item.data)}
                    </TableCell>
                    {isObserverBoolean ? (
                      <></>
                    ) : (
                      <TableCell className="font-medium">
                        <Button
                          variant="destructive"
                          onClick={() => {
                            deleteHistory(item.id);
                          }}>
                          Deletar
                        </Button>
                      </TableCell>
                    )}
                  </>
                )}
              </TableRow>
            ))}
          </ScrollArea>
        </TableBody>
      </Table>
    </div>
  );
};

export default ImovelHistoryTable;
