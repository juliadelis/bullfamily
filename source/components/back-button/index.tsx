"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import arrow from "../../assets/icons/arrow-left-circle.svg";

const BackButton = () => {
  const { back } = useRouter();
  return (
    <button onClick={back} className="flex gap-2">
      <Image src={arrow} alt="icone voltar" />
      <p>Voltar</p>
    </button>
  );
};

export default BackButton;
