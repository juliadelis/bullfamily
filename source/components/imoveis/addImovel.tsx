import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const AddImovel = () => {
  return (
    <div>
      <Button variant="blue" className="md:mb-6" asChild>
        <Link href="/imovel/adicionar-imovel">Adicionar Imóvel</Link>
      </Button>
    </div>
  );
};

export default AddImovel;
