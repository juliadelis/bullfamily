"use client";

import { z } from "zod";

export const formSchemaAcronym = z.object({
  acronym: z.string(),
  description: z
    .string()
    .min(2, { message: "Descrição precisa de no mínimo 2 caracteres" }),
});
