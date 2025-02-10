import React, { useMemo } from "react";
import { SelectYearManual } from "../SelectManual";

interface BuscarAnoProps {
  onSelected: (year: number) => void;
  value: number;
}
export default function BuscarAno({ onSelected, value }: BuscarAnoProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelected(Number(e.target.value));
  };

  const years = useMemo(() => {
    const arr = Array.from(
      { length: 51 },
      (_, i) => new Date().getFullYear() - i
    );

    return arr.map((item) => ({ label: item, value: item }));
  }, []);

  return (
    <div className="flex flex-col gap-6 mb-6">
      <div className="flex text-[12px]">
        <SelectYearManual
          label="Selecionar Ano"
          options={years}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
