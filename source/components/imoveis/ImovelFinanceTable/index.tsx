import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { ImovelDataProps } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";

const ImovelFinanceTable = ({ data }: ImovelDataProps) => {
  return (
    <Table>
      <TableBody>
        <ScrollArea className="h-[40vh]  rounded-md border">
          <TableRow>
            <TableHead className="font-[600]">Apelido</TableHead>
            <TableCell className="font-medium">{data.nickname}</TableCell>
          </TableRow>

          <TableRow>
            <TableHead className="font-[600]">Status</TableHead>
            <TableCell className="font-medium">{data.status}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Endereço</TableHead>
            <TableCell className="font-[300]">{data.address}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Tipo</TableHead>
            <TableCell className="font-medium">{data.type}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Data de pagamento</TableHead>
            <TableCell className="font-medium">
              Todo dia {data.paymentDay}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Local de Pagamento</TableHead>
            <TableCell className="font-medium">
              {data.paymentLocation}
            </TableCell>
          </TableRow>
          {/* <TableRow>
            <TableHead className="font-[600]">Valor de locação</TableHead>
            <TableCell className="font-medium">{data.rentalValue}</TableCell>
          </TableRow> */}
          <TableRow>
            <TableHead className="font-[600]">Nº de quartos</TableHead>
            <TableCell className="font-medium">{data.numOfRooms}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Elevador</TableHead>
            <TableCell className="font-medium">{data.elevator}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Limpeza inclusa</TableHead>
            <TableCell className="font-medium">{data.cleaning}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Garagem</TableHead>
            <TableCell className="font-medium">{data.garage}</TableCell>
          </TableRow>

          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Contrato</TableHead>
            <TableCell className="font-medium">{data.contractWith}</TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Data de início</TableHead>
            <TableCell className="font-medium">{data.startDate}</TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Data de térmimo</TableHead>
            <TableCell className="font-medium">{data.endDate}</TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Índice de reajuste</TableHead>
            <TableCell className="font-medium">
              {data.reajustmentIndex}
            </TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Administrador</TableHead>
            <TableCell className="font-medium">{data.administrator}</TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Cel/email</TableHead>
            <TableCell className="font-medium">
              {data.administratorPhoneNumber}{" "}
              {data.admistratorEmail ? ` / ${data.admistratorEmail}` : ""}
            </TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Taxa administrativa</TableHead>
            <TableCell className="font-medium">
              {data.administrateTax}
            </TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Locatário</TableHead>
            <TableCell className="font-medium">{data.lessee}</TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Telefone</TableHead>
            <TableCell className="font-medium">{data.lesseePhone}</TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Contato 02</TableHead>
            <TableCell className="font-medium">
              {data.optionalContactName}
            </TableCell>
          </TableRow>
          <TableRow className="bg-[#CBD5E1]">
            <TableHead className="font-[600]">Telefone</TableHead>
            <TableCell className="font-medium">
              {data.optionalContactNumber}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Fiador</TableHead>
            <TableCell className="font-medium">{data.guarantor}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Dados</TableHead>
            <TableCell className="font-medium">{data.guarantorData}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Telefone</TableHead>
            <TableCell className="font-medium">
              {data.guarantorNumber}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Condomínio</TableHead>
            <TableCell className="font-medium">{data.condominium}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">IPTU</TableHead>
            <TableCell className="font-medium">{data.IPTU}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600] ">Obs</TableHead>
            <TableCell className="font-medium">{data.observation}</TableCell>
          </TableRow>
        </ScrollArea>
      </TableBody>
    </Table>
  );
};

export default ImovelFinanceTable;
