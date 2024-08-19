"use client";
import { useReducer } from "react";
import { Input } from "../ui/input"; 
import { ControllerRenderProps} from "react-hook-form";

type TextInputProps = {
  name: string;
  placeholder?: string;
  field: ControllerRenderProps<any, any>;
};

const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function PriceInput(props: TextInputProps) {

  const initialValue = props.field.value
    ? moneyFormatter.format(props.field.value)
    : "";


  const [value, setValue] = useReducer((_: any, next: string) => {
    const digits = next.replace(/\D/g, "");
    return moneyFormatter.format(Number(digits) / 100);
  }, initialValue);

  function handleChange(realChangeFn: Function, formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = Number(digits) / 100;
    realChangeFn(realValue);
  }
  const {field} = props
        field.value = value;
        const _change = field.onChange;

  return (
              <Input
                placeholder={props.placeholder}
                type="text"
                {...field}
                onChange={(ev) => {
                  setValue(ev.target.value);
                  handleChange(_change, ev.target.value);
                }}
                value={value}
              />
  );
}
