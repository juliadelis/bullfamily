import { ControllerRenderProps } from "react-hook-form";
import { PhoneInput } from "./phoneInput";
import { Input, InputProps } from "../ui/input";
import { PriceInput } from "./priceInput";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "./datePicker";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props extends InputProps {
  type: "tel" | "text" | "number" | "email" | "checkbox" | "date" | "price";
  field: ControllerRenderProps<any, any>;
  placeholder?: string;
  name: string;
  max?: number;
  min: number;
}

export const SelectStatus = ({
  type,
  name,
  placeholder,
  field,
  max,
  min,
  ...rest
}: Props) => {
  const fields = {
    tel: <PhoneInput {...rest} field={field} />,
    text: <Input placeholder={placeholder} {...field} />,
    email: <Input placeholder={placeholder} type="email" {...field} />,
    number: (
      <Input
        min={min ? min : 0}
        max={max ? max : undefined}
        type="number"
        placeholder={placeholder}
        {...field}
      />
    ),
    price: (
      <PriceInput name={name} field={field} placeholder={placeholder || " "} />
    ),
    checkbox: (
      <Switch
        className="ml-8"
        checked={field.value}
        onCheckedChange={field.onChange}
      />
    ),
    date: <DatePicker field={field} />,
    textarea: <Textarea {...field} placeholder={placeholder} />,
    select: (
      <>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pago em dia">Pago em dia</SelectItem>
            <SelectItem value="Pago em atraso">Pago em atraso</SelectItem>
            <SelectItem value="Não foi pago">Não foi pago</SelectItem>
          </SelectContent>
        </Select>
      </>
    ),
  };

  return fields[type];
};
