"use client";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Estate } from "@/@types/estate";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

const NewNavbar = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [value, setValue] = useState<Estate | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("estates")
      .select("*")
      .then(({ data }) => {
        if (!data) return;

        setEstates(data.sort((a: Estate, b: Estate) => a.id - b.id));
      });
  }, []);

  const handleSelection = (newValue: Estate | null) => {
    setValue(newValue);
    if (newValue) {
      redirect(`/imovel/${newValue.id}`);
    }
  };

  return (
    <nav className="fixed mx-auto border-b bg-[#E7E8E2] top-0 left-0 right-0 z-50">
      <div className="flex flex-row px-6 h-[54px] items-center justify-between  ">
        <a href="/" className="text-sm w-full font-bold flex flex-col gap-2">
          <p>Bull Family Real State</p>
        </a>

        <div>
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              handleSelection(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="controllable-states-demo"
            options={estates}
            getOptionLabel={(option) => option.nickname}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Busque um imóvel" />
            )}
            size="small"
          />
        </div>
      </div>
    </nav>
  );
};

export default NewNavbar;
