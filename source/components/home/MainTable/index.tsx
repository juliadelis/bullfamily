"use client";
import { Estate } from "@/@types/estate";
import Loading from "@/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const MainTable = () => {
  const [data, setData] = useState<Estate[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("estates").select("*");

      if (error) {
        console.error("Erro ao buscar dados:", error);
      } else {
        setData(data || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (!data || data.length === 0) return <p>Nenhum dado encontrado.</p>;

  return (
    <div className="bg-white rounded-md p-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>N.º</TableHead>
            <TableHead>Apelido</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>Escritura</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor do Aluguel</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.nickname}</TableCell>
              <TableCell>{item.registration}</TableCell>
              <TableCell>{item.scripture}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.rentValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MainTable;
