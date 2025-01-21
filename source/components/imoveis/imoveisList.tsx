"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImovelDatasProps } from "./ImovelTable/types";
import { ScrollArea } from "../ui/scroll-area";
import { isObserver } from "@/utils/isObserver";

const ImoveisList = ({ datas, openDeletePopUp }: ImovelDatasProps) => {
  const [isObserverBoolean, setIsObserverBoolean] = useState<boolean>(false);
  useEffect(() => {
    isObserver().then((data) => {
      setIsObserverBoolean(Boolean(data));
    });
  }, []);
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between items-end ">
          <Table>
            <TableBody>
              <ScrollArea className="">
                {datas.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell className="font-bold">{data.nickname}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="default" className="w-fit" asChild>
                        <Link href={`/imovel/${data.id}`}>Ver imóvel</Link>
                      </Button>
                    </TableCell>
                    {isObserverBoolean ? (
                      <></>
                    ) : (
                      <TableCell className="text-right w-[80px]">
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            openDeletePopUp(data);
                          }}>
                          Excluir
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </ScrollArea>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ImoveisList;
