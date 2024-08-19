"use client";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { LuFileText } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormComponent,
} from "@/components/ui/form";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Estate } from "@/app/imovel/page";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loading from "@/components/loading";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FieldByType } from "@/components/imoveis/fieldByType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";

interface IPendency {
  id: number;
  due_date: Date;
  pendency: string;
  residence_number: number;
  estate: Estate;
  estate_id: number;
  fulfillment_date: Date;
}

const formSchema = z.object({
  pendency: z
    .string()
    .min(2, { message: "Pendencia precisa de no minimo 2 caracteres" }),
  due_date: z.date().optional(),
  residence_number: z.string().optional(),
  estate: z.string().optional(),
  fulfillment_date: z.date().optional(),
});

const inputs = [
  {
    name: "pendency",
    label: "Pendencia",
    type: "textarea",
    placeholder: "Pendencia",
    description: "Pendencia",
  },
  {
    name: "due_date",
    label: "Vencimento",
    type: "date",
    placeholder: "Data",
    description: "Data de vencimento",
  },
  {
    name: "fulfillment_date",
    label: "Data de Cumprimento",
    type: "date",
    placeholder: "Data",
    description: "Data de cumprimento",
  },
  {
    name: "residence_number",
    label: "N° Reicidência",
    type: "number",
    placeholder: "",
  },
];
export default function Pendencias() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      redirect("/login");
    }
    setloading(false);
  }, []);

  const [pendencies, setPendencies] = useState<IPendency[] | null>(null);
  const [estates, setEstates] = useState<Estate[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("pendency")
      .select("*")

      .then(({ data }) => {
        setPendencies(data);
      });
    supabase
      .from("estates")
      .select("*")

      .then(({ data, error }) => {
        console.log(error);

        if (!data) return;

        setEstates(data.sort((a: Estate, b: Estate) => a.id - b.id));
      });
  }, []);
  const { toast } = useToast();

  const deletePendencia = async (id: number) => {
    const client = createClient();

    try {
      const { error } = await client.from("pendency").delete().eq("id", id);

      if (error) {
        toast({
          title: `Erro ao deletar pendencia!`,
          variant: `destructive`,
        });
        return;
      }

      toast({
        title: `Pendencia deletada com sucesso!`,
      });
      location.reload();
    } catch (error) {
      toast({
        title: `Erro ao deletar pendencia!`,
        variant: `destructive`,
      });
    }
  };

  const onSubmit = async ({
    pendency,
    estate,
    due_date,
    residence_number,
    fulfillment_date,
  }: z.infer<typeof formSchema>) => {
    const supabase = createClient();
    try {
      const { error } = await supabase.from("pendency").insert({
        pendency,
        estate_id: Number(estate),
        due_date,
        residence_number: Number(residence_number),
        fulfillment_date,
      });

      if (error) {
        toast({
          title: `Erro ao criar pendencia!`,
          variant: `destructive`,
        });
        return;
      }
      toast({
        title: `Criado pendencia com sucesso!`,
      });

      location.reload();
    } catch (err) {
      toast({
        title: `Erro ao criar pendencia!`,
        variant: `destructive`,
      });
      console.error({ err });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estate: "",
      due_date: new Date(),
      pendency: "",
      residence_number: "",
      fulfillment_date: new Date(),
    },
  });

  if (loading) return <Loading />;

  if (!pendencies) return <Loading />;

  return (
    <div className="bg-[url(https://res.cloudinary.com/df7wdqak7/image/upload/v1715622122/background_szvaad.png)]">
      <div className="flex flex-col p-10">
        <div className="bg-white p-6 rounded-lg">
          <div className="flex mb-[60px] ">
            <Link href="/relatorios" className="flex items-center">
              <IoArrowBackCircleOutline className="mr-2 h-6 w-6" />
              <h3 className="text-lg">Voltar ao painel de relatórios</h3>
            </Link>
          </div>
          <div className="flex flex-col gap-8 items-start">
            <div className="flex mb-4">
              <LuFileText className="mr-2 h-6 w-6" />
              <h3 className="font-black  text-lg">Pendências</h3>
            </div>
            <div className="flex flex-col justify-between items-end  w-[90VW] min-h-[200px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[400px] font-black">
                      Pendências
                    </TableHead>
                    <TableHead className=" font-black">Imóvel</TableHead>
                    <TableHead className="font-black ">Vencimento</TableHead>
                    <TableHead className="font-black ">
                      Data de Cumprimento
                    </TableHead>
                    <TableHead className="font-black ">
                      Nº de reicidência
                    </TableHead>

                    <TableHead className="font-black ">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendencies?.map((item) => {
                    const estate = estates?.find(
                      (estate) => estate.id === item.estate_id
                    );

                    if (!estate) return null;

                    return (
                      <TableRow>
                        <TableCell className="font-medium">
                          {item.pendency ? item.pendency : ""}
                        </TableCell>
                        <TableCell className="font-bold">
                          {estate.nickname}
                        </TableCell>
                        <TableCell className="font-bold">
                          {item.due_date
                            ? format(String(item.due_date), "PPP", {
                                locale: ptBR,
                              })
                            : ""}
                        </TableCell>
                        <TableCell className="font-bold">
                          {item.fulfillment_date
                            ? format(String(item.fulfillment_date), "PPP", {
                                locale: ptBR,
                              })
                            : ""}
                        </TableCell>
                        <TableCell className="font-bold">
                          {item.residence_number ? item.residence_number : ""}
                        </TableCell>

                        <TableCell className="font-bold flex gap-3">
                          <Button asChild>
                            <Link href={`/imovel/${item.estate_id}`}>
                              Ver imóvel
                            </Link>
                          </Button>
                          {item.id && (
                            <Button
                              onClick={() => {
                                deletePendencia(item.id);
                              }}
                              variant="underline">
                              Deletar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <Dialog>
              <DialogTrigger>
                <Button className="mt-8 ml-0">Adicionar pendência</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar pêndencia</DialogTitle>
                  <DialogDescription className="">
                    <FormComponent {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8">
                        {inputs.map(({ name, label, placeholder, type }) => {
                          return (
                            <FormField
                              control={form.control}
                              //@ts-ignore
                              name={name}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{label}</FormLabel>
                                  <FormControl>
                                    <FieldByType
                                      field={field}
                                      placeholder={placeholder}
                                      name={name}
                                      //@ts-ignore

                                      type={type}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          );
                        })}
                        <FormField
                          control={form.control}
                          name="estate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Imóvel</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Imóvel" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {estates?.map((estate, i) => {
                                      return (
                                        <SelectItem
                                          key={estate.id}
                                          value={`${estate.id}`}>
                                          {i + 1} - {estate.nickname}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit">Enviar</Button>
                      </form>
                    </FormComponent>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
