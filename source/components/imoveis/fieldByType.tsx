"use client";

import { ControllerRenderProps } from "react-hook-form";
import { PhoneInput } from "./phoneInput";
import { Input, InputProps } from "../ui/input";
import { PriceInput } from "./priceInput";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CldUploadButton } from "next-cloudinary";
import { DatePicker } from "./datePicker";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { Estate } from "@/@types/estate";
import { createClient } from "@/utils/supabase/client";
import { pendencyAcronym } from "@/@types/PendencyAcronym";
import PasswordInput from "@/app/login/password";

interface Props extends InputProps {
  type:
    | "tel"
    | "text"
    | "number"
    | "email"
    | "checkbox"
    | "date"
    | "price"
    | "photo"
    | "password";
  field: ControllerRenderProps<any, any>;
  placeholder?: string;
  name: string;
  max?: number;
  min?: number;
}

export const FieldByType = ({
  type,
  name,
  placeholder,
  field,
  max,
  min,
  ...rest
}: Props) => {
  const [estates, setEstates] = useState<Estate[] | null>();
  const [pendency, setPendency] = useState<pendencyAcronym[] | null>();
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.log(error);

        if (!data) return;

        setEstates(data.sort((a: Estate, b: Estate) => a.id - b.id));
      });
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("pendencyAcronym")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.log(error);

        if (!data) return;

        setPendency(data);
      });
  }, []);

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
    dateDes: <DatePicker field={field} />,
    textarea: <Textarea {...field} placeholder={placeholder} />,
    selectStatus: (
      <>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pago em dia">Pago em dia</SelectItem>
            <SelectItem value="Pago em atraso">Pago em atraso</SelectItem>
            <SelectItem value="Não foi pago">Não foi pago</SelectItem>
            <SelectItem value="Isento">Isento</SelectItem>
            <SelectItem value="Pago adiantado">Pago Adiantado</SelectItem>
          </SelectContent>
        </Select>
      </>
    ),
    selectFinancePerson: (
      <>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pago por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sr. José">Sr. José</SelectItem>
            <SelectItem value="Inquilino">Inquilino</SelectItem>
          </SelectContent>
        </Select>
      </>
    ),
    selectEstate: (
      <>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um imóvel" />
          </SelectTrigger>

          <SelectContent>
            {estates?.map((data, i) => (
              <SelectItem value={`${data.id}-${data.nickname}`}>
                {i + 1} - {data.nickname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </>
    ),
    photo: (
      <div>
        <CldUploadButton
          onSuccess={({ info }) => {
            //@ts-ignore
            if (!info?.public_id) return;

            //@ts-ignore
            field.onChange(info?.public_id);
          }}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}>
          <span>Upload</span>
        </CldUploadButton>
      </div>
    ),
    selectPendency: (
      <>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma pendência" />
          </SelectTrigger>

          <SelectContent>
            {pendency?.map((data) => (
              <SelectItem value={`${data.id}-${data.acronym}`}>
                {data.acronym}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </>
    ),
    password: <PasswordInput onValueChange={field.onChange} />,
    select: (
      <>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alugado">Alugado</SelectItem>
            <SelectItem value="À venda">À venda</SelectItem>
            <SelectItem value="Imóvel novo">Imóvel novo</SelectItem>
            <SelectItem value="Metra - sede">metra - sede</SelectItem>
            <SelectItem value="Metra - instituto">metra - instituto</SelectItem>
            <SelectItem value="Em construção">Em construção</SelectItem>
            <SelectItem value="Em reforma">Em reforma</SelectItem>
            <SelectItem value="Desocupado">Desocupado</SelectItem>
            <SelectItem value="Moradia do senhor josé">
              Moradia do senhor José
            </SelectItem>
          </SelectContent>
        </Select>
      </>
    ),
  };

  return fields[type];
};
