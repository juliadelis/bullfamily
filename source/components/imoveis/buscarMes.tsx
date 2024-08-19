import React, { useMemo } from "react";

import { SelectMesManual } from "../SelectManual";
interface BuscarMesProps {
  onSelected: (month: number) => void;
  value: number;
}
export default function BuscarMes({ onSelected, value }: BuscarMesProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelected(Number(e.target.value));
  };

  const months = useMemo(() => {
    return [
      { value: 1, label: "Jan" },
      { value: 2, label: "Fev" },
      { value: 3, label: "Mar" },
      { value: 4, label: "Abr" },
      { value: 5, label: "Mai" },
      { value: 6, label: "Jun" },
      { value: 7, label: "Jul" },
      { value: 8, label: "Ago" },
      { value: 9, label: "Set" },
      { value: 10, label: "Out" },
      { value: 11, label: "Nov" },
      { value: 12, label: "Dez" },
    ];
  }, []);

  return (
    <div className="flex flex-col gap-6 mb-6">
      <div className="flex gap-10">
        <SelectMesManual
          label="Selecionar Mês"
          options={months}
          value={value}
          onChange={handleChange}
        ></SelectMesManual>
      </div>
    </div>
  );
}
