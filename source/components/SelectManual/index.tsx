import React, { forwardRef } from "react";
import { SelectMesProps, SelectProps, SelectYearProps } from "./types";

export const SelectManual = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    options,
    value,
    classNameSelect,
    onChange,
    classNameContainer,
    ...props
  }) => {
    return (
      <label>
        <select
          ref={ref}
          className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-[12px] shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-[280px]"
          {...props}
          onChange={onChange}
          defaultValue={""}>
          {value === "" && (
            <option value="" disabled style={{ display: "none" }}>
              Selecione um imóvel
            </option>
          )}
          {options?.map((option, index) => (
            <option key={index} value={option.id}>
              {index + 1} - {option.nickname}
            </option>
          ))}
        </select>
      </label>
    );
  }
);

export const SelectMesManual = forwardRef<HTMLSelectElement, SelectMesProps>(
  ({
    label,
    options,
    value,
    classNameSelect,
    onChange,
    classNameContainer,
    ...props
  }) => {
    return (
      <label>
        <select
          ref={ref}
          className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-[12px] shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-[280px]"
          {...props}
          onChange={onChange}
          defaultValue={new Date().getMonth() + 1}>
          <option value="" disabled style={{ display: "none" }}>
            Selecione um Mês
          </option>

          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {index + 1} - {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
);

SelectManual.displayName = "Select";

export const SelectYearManual = ({
  label,
  options,
  value,
  classNameSelect,
  onChange,
  classNameContainer,
  ...props
}: SelectYearProps) => {
  return (
    <label>
      <select
        className="flex h-fit items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-[12px] shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-[280px]"
        {...props}
        onChange={onChange}
        defaultValue={new Date().getFullYear()}>
        <option value="" disabled style={{ display: "none" }}>
          Selecione um Ano
        </option>

        {options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
