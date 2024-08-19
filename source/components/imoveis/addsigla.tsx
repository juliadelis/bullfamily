import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const AddSigla = () => {
  return (
    <div>
      <Button variant="blue" className="mb-6" asChild>
        <Link href="/imovel/adicionar-sigla-pendencia">
          Adicionar sigla de pendências
        </Link>
      </Button>
    </div>
  );
};

export default AddSigla;
