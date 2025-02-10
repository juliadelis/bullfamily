"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ImovelIntDatasProps } from "./ImovelTable/types";
import { EstateLike } from "@/app/imovel/page";
import { createClient } from "@/utils/supabase/client";

const ImoveisListInterna = () => {
  const [estates, setEstates] = useState<EstateLike[] | null>();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data, error }) => {
        console.log(error);

        if (!data) return;

        setEstates(data.sort((a: EstateLike, b: EstateLike) => a.id - b.id));
      });
  }, []);

  const datas = estates;

  if (!estates) {
    return null;
  }
  return (
    <div className="fixed hidden md:block bottom-0 flex-col w-full z-10 bg-white py-3 px-10 rounded-lg border-t">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-[2px] ">
          {datas?.map((data, i) => (
            <div className="flex gap-2">
              <p className="font-regular text-[11px]">{i + 1}</p>
              <Link
                className="font-medium text-[11px] "
                href={`/imovel/${data.id}`}>
                {data.nickname}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImoveisListInterna;
