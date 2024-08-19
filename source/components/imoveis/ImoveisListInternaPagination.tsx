"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import { Estate } from "@/app/imovel/page";
import { createClient } from "@/utils/supabase/client";

export const ImoveisListInternaPagination = () => {
  const [estates, setEstates] = useState<Estate[] | null>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const estatesPerPage = 4;

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
          return;
        }

        if (!data) return;

        setEstates(data.sort((a: Estate, b: Estate) => a.id - b.id));
      });
  }, []);

  const handleNextPage = () => {
    if ((currentPage + 1) * estatesPerPage < (estates?.length || 0)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * estatesPerPage;
  const selectedEstates = estates?.slice(
    startIndex,
    startIndex + estatesPerPage
  );

  if (!estates) {
    return null;
  }

  return (
    <div className="fixed md:hidden bottom-0 flex-col w-full z-10 bg-white py-3 px-10 rounded-lg border-t h-[100px]">
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className={`p-2 ${
            currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <BsArrowLeftCircle />
        </button>
        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-2 justify-between gap-y-2 ">
            {selectedEstates?.map((data, i) => (
              <div key={data.id} className="flex gap-2">
                <p className="font-regular text-[11px]">{startIndex + i + 1}</p>
                <Link
                  className="font-medium text-[11px]"
                  href={`/imovel/${data.id}`}
                >
                  {data.nickname}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleNextPage}
          disabled={
            (currentPage + 1) * estatesPerPage >= (estates?.length || 0)
          }
          className={`p-2 ${
            (currentPage + 1) * estatesPerPage >= (estates?.length || 0)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <BsArrowRightCircle />
        </button>
      </div>
    </div>
  );
};
