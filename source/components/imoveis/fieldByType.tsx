"use client";

import { ControllerRenderProps } from "react-hook-form";
import {
  TextField,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { Key, useEffect, useRef, useState } from "react";
import { Estate } from "@/@types/estate";
import { createClient } from "@/utils/supabase/client";
import { pendencyAcronym } from "@/@types/PendencyAcronym";
import {
  PasswordInput,
  UserPasswordInput,
  ConfirmUserPasswordInput,
} from "@/app/login/password";
import { FiUploadCloud } from "react-icons/fi";
import { BsUpload } from "react-icons/bs";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import { CldUploadWidget, getCldOgImageUrl } from "next-cloudinary";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { FormatterUtils } from "@/utils/formatter.utils";

interface Props {
  type:
    | "tel"
    | "text"
    | "number"
    | "email"
    | "checkbox"
    | "date"
    | "price"
    | "photo"
    | "password"
    | "userPassword"
    | "confirmUserPassword"
    | "selectEstate"
    | "selectPendency"
    | "select"
    | "dateDes"
    | "textarea"
    | "selectFinancePerson"
    | "name"
    | "selectStatus";
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef(null);
  const [images, setImages] = useState<string[]>(
    Array.isArray(field.value) ? field.value : []
  );
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

  const fields: Record<Props["type"], JSX.Element> = {
    tel: (
      <TextField
        size="small"
        type="tel"
        label={placeholder}
        {...field}
        value={field.value ?? ""}
        fullWidth
      />
    ),
    text: (
      <TextField
        size="small"
        label={placeholder}
        {...field}
        value={field.value ?? ""}
        fullWidth
      />
    ),
    name: (
      <TextField
        size="small"
        label={placeholder}
        {...field}
        value={field.value ?? ""}
      />
    ),
    email: (
      <TextField size="small" type="email" label={placeholder} {...field} />
    ),
    number: (
      <TextField
        inputProps={{ "aria-label": "controlled" }}
        size="small"
        type="number"
        label={placeholder}
        {...field}
        value={field.value ?? ""}
        fullWidth
      />
    ),
    checkbox: (
      <div className="w-full">
        <Switch
          inputProps={{ "aria-label": "controlled" }}
          size="small"
          checked={field.value}
          onChange={(_, checked) => field.onChange(checked)}
        />
      </div>
    ),
    textarea: (
      <TextField
        inputProps={{ "aria-label": "controlled" }}
        size="small"
        multiline
        rows={4}
        fullWidth
        placeholder={placeholder}
        {...field}
        value={field.value ?? ""}
      />
    ),
    selectFinancePerson: (
      <FormControl fullWidth>
        <InputLabel>Pago por...</InputLabel>
        <Select
          inputProps={{ "aria-label": "controlled" }}
          size="small"
          value={field.value ?? ""}
          onChange={field.onChange}
          label="Pago por...">
          <MenuItem value="Sr. José">Sr. José</MenuItem>
          <MenuItem value="Inquilino">Inquilino</MenuItem>
        </Select>
      </FormControl>
    ),
    selectStatus: (
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          inputProps={{ "aria-label": "controlled" }}
          size="small"
          value={field.value ?? ""}
          onChange={field.onChange}
          label="Status">
          <MenuItem value="Pago em dia">Pago em dia</MenuItem>
          <MenuItem value="Pago em atraso">Pago em atraso</MenuItem>
          <MenuItem value="Não foi pago">Não foi pago</MenuItem>
          <MenuItem value="Isento">Isento</MenuItem>
          <MenuItem value="Pago adiantado">Pago Adiantado</MenuItem>
        </Select>
      </FormControl>
    ),

    date: (
      <TextField
        size="small"
        type="date"
        {...field}
        value={field.value ?? ""}
        fullWidth
      />
    ),
    dateDes: (
      <TextField
        size="small"
        type="date"
        {...field}
        value={field.value ?? ""}
        fullWidth
      />
    ),
    password: <PasswordInput onValueChange={field.onChange} />,
    userPassword: <UserPasswordInput onValueChange={field.onChange} />,
    confirmUserPassword: (
      <ConfirmUserPasswordInput onValueChange={field.onChange} />
    ),
    selectEstate: (
      <FormControl fullWidth>
        <InputLabel>Selecione um imóvel</InputLabel>
        <Select
          size="small"
          value={field.value ?? ""}
          onChange={field.onChange}>
          {estates?.map((data, i) => (
            <MenuItem key={data.id} value={`${data.id}-${data.nickname}`}>
              {i + 1} - {data.nickname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    selectPendency: (
      <FormControl fullWidth>
        <InputLabel>Selecione uma pendência</InputLabel>
        <Select
          size="small"
          value={field.value ?? ""}
          onChange={field.onChange}>
          {pendency?.map((data) => (
            <MenuItem key={data.id} value={`${data.id}-${data.acronym}`}>
              {data.acronym}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    photo: (
      <div className="w-full flex flex-col gap-2">
        {/* <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
          options={{ multiple: true }}
          onSuccess={(result) => {
            if (
              result.event === "success" &&
              typeof result.info === "object" &&
              "secure_url" in result.info
            ) {
              const secureUrl = result.info.secure_url as string;
              setImages((prev) => [...prev, secureUrl]);
            }
          }}>
          {({ open }) => (
            <Button variant="contained" color="primary" onClick={() => open()}>
              Upload Imagens
            </Button>
          )}
        </CldUploadWidget> */}

        <CldUploadWidget
          onSuccess={({ info }) => {
            //@ts-ignore
            if (!info?.public_id) return;

            //@ts-ignore
            field.onChange(info?.public_id);

            if (typeof info === "object" && "secure_url" in info) {
              const secureUrl = info.secure_url as string;
              setImages((prev) => [...prev, secureUrl]);
            }
          }}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}>
          {({ open }) => (
            <Button
              variant="contained"
              className="bg-black normal-case w-fit"
              onClick={() => open()}
              startIcon={<BsUpload size={14} />}>
              Upload
            </Button>
          )}
        </CldUploadWidget>

        <div className="flex flex-wrap gap-4 mt-2">
          {Array.isArray(images) &&
            images.map((src, index) => (
              <div key={index} className="relative w-32 h-32">
                <Image
                  src={src}
                  alt="Uploaded preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                <button
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                  <AiOutlineDelete size={16} />
                </button>
              </div>
            ))}
        </div>
      </div>
    ),
    select: (
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          size="small"
          value={field.value ?? ""}
          onChange={field.onChange}
          label="Status">
          <MenuItem value="Alugado">Alugado</MenuItem>
          <MenuItem value="À venda">À venda</MenuItem>
          <MenuItem value="A alugar">A alugar</MenuItem>
          <MenuItem value="Ocioso">Ocioso</MenuItem>
          <MenuItem value="A Adquirir">A Adquirir</MenuItem>
          <MenuItem value="Demandas">Demandas</MenuItem>
        </Select>
      </FormControl>
    ),
    price: (
      <TextField
        size="small"
        type="number"
        label="Preço"
        {...field}
        value={field.value ?? ""}
        onChange={(e) => field.onChange(Number(e.target.value))}
        fullWidth
      />
    ),
  };

  return fields[type] || null;
};
