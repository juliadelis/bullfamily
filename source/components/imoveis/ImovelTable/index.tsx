import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Estate } from "@/@types/estate";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { getCldOgImageUrl } from "next-cloudinary";
import { getURL } from "next/dist/shared/lib/utils";
const ImovelTable = (data: Estate) => {
  const getUrl = (id: string) => {
    if (!id) {
      return null;
    }
    return getCldOgImageUrl({
      src: id,
    });
  };

  return (
    <Table className="bg-white rounded-md">
      <TableBody>
        <ScrollArea className="h-[70vh] md:w-[35vw] w-full rounded-md border">
          <TableRow>
            <TableHead className="font-[600]">Apelido</TableHead>
            <TableCell className="font-medium text-lg">
              {data.nickname}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Matrícula</TableHead>
            <TableCell className="font-medium">{data.registration}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Escritura</TableHead>
            <TableCell className="font-medium">{data.scripture}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Certidão de Registro</TableHead>
            <TableCell className="font-medium">
              {data.registrationCertification}
            </TableCell>
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
              {data.paymentDay !== 0 ? "Todo dia " + data.paymentDay : ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Local de Pagamento</TableHead>
            <TableCell className="font-medium">
              {data.paymentLocation}
            </TableCell>
          </TableRow>
          {(data.status.toLowerCase() === "desocupado" ||
            data.status === "À venda" ||
            data.status.toLowerCase() === "em construção" ||
            data.status === "Imóvel novo" ||
            data.status === "Em construção" ||
            data.status === "Em reforma") &&
          data.unoccupied ? (
            <TableRow>
              <TableHead className="font-[600]">Desocupado desde</TableHead>
              <TableCell className="font-medium">
                {String(format(data.unoccupied, "PPP", { locale: ptBR })) !==
                "31 de dezembro de 1969"
                  ? String(format(data.unoccupied, "PPP", { locale: ptBR }))
                  : ""}
              </TableCell>
            </TableRow>
          ) : (
            ""
          )}
          <TableRow>
            <TableHead className="font-[600]">Nº de quartos</TableHead>
            <TableCell className="font-medium">
              {data.numOfRooms !== 0 ? data.numOfRooms : ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Elevador</TableHead>
            <TableCell className="font-medium">{data.elevator}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Limpeza inclusa</TableHead>
            <TableCell className="font-medium">
              {data.cleaningIncluded}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Garagem</TableHead>
            <TableCell className="font-medium">{data.garage}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Contrato</TableHead>
            <TableCell className="font-medium">{data.contractWith}</TableCell>
          </TableRow>
          {data.status !== "Desocupado" &&
          data.status !== "Em construção" &&
          data.status !== "À venda" &&
          data.status !== "Imóvel novo" ? (
            <>
              <TableRow>
                <TableHead className="font-[600]">Data de início</TableHead>
                <TableCell className="font-medium">
                  {String(format(data.startDate, "PPP", { locale: ptBR })) !==
                  "31 de dezembro de 1969"
                    ? String(format(data.startDate, "PPP", { locale: ptBR }))
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-[600]">Data de térmimo</TableHead>
                <TableCell className="font-medium">
                  {String(format(data.endDate, "PPP", { locale: ptBR })) !==
                  "31 de dezembro de 1969"
                    ? String(format(data.endDate, "PPP", { locale: ptBR }))
                    : ""}
                </TableCell>
              </TableRow>
            </>
          ) : (
            <></>
          )}
          <TableRow>
            <TableHead className="font-[600]">Índice de reajuste</TableHead>
            <TableCell className="font-medium">
              {data.readjustmentIndex}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Administrador</TableHead>
            <TableCell className="font-medium">{data.administrator}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Cel/email</TableHead>
            <TableCell className="font-medium">
              {data.admistratorPhoneNumber}{" "}
              {data.admistratorEmail ? `  ${data.admistratorEmail}` : ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Taxa administrativa</TableHead>
            <TableCell className="font-medium">
              {data.administrateTax}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Locatário</TableHead>
            <TableCell className="font-medium">{data.lessee}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Telefone</TableHead>
            <TableCell className="font-medium">{data.lesseePhone}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Contato 02</TableHead>
            <TableCell className="font-medium">
              {data.optionalContactName}
            </TableCell>
          </TableRow>
          <TableRow>
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
            <TableCell className="font-medium">{data.guarnatorData}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Telefone</TableHead>
            <TableCell className="font-medium">
              {data.guarnatorNumber}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Condomínio</TableHead>
            <TableCell className="font-medium">
              {data.condominium !== "0" ? data.condominium : ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">IPTU</TableHead>
            <TableCell className="font-medium">{data.IPTU}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Valor IPTU</TableHead>
            <TableCell className="font-medium">{data.taxIPTU}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Valor do Aluguel</TableHead>
            <TableCell className="font-medium">{data.rentValue}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Valor do Gás</TableHead>
            <TableCell className="font-medium">{data.gas}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Valor da conta de Luz</TableHead>
            <TableCell className="font-medium">{data.light}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">
              Informações conta de Luz
            </TableHead>
            <TableCell className="font-medium">
              {data.lightInformation}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Valor da conta de Água</TableHead>
            <TableCell className="font-medium">{data.water}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">
              Informações da conta de Água
            </TableHead>
            <TableCell className="font-medium">
              {data.waterInformation}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Registro de contato</TableHead>
            <TableCell className="font-medium">
              {data.contractRegistration}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Seguro</TableHead>
            <TableCell className="font-medium">{data.insurance}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">
              Reconhecimento firmas do contrato
            </TableHead>
            <TableCell className="font-medium">
              {data.signatureRecognition}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">
              Fotografias antes da entrada
            </TableHead>
            <TableCell className="font-medium">
              {!data.beforePhoto ? (
                ""
              ) : (
                <a href={`${getUrl(data.beforePhoto)}`}>Link</a>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">
              Fotografias antes da saída
            </TableHead>
            <TableCell className="font-medium">
              {!data.afterPhoto ? (
                ""
              ) : (
                <a href={`${getUrl(data.afterPhoto)}`}>Link</a>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-[600]">Advogado</TableHead>
            <TableCell className="font-medium">
              {data.lawyer} {data.lawyerData ? ` |  ${data.lawyerData}` : ``}
            </TableCell>
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

export default ImovelTable;
