"use client";

import { z } from "zod";

export const formSchemaHistory = z.object({
  data: z
    .string()
    .min(2, { message: "Histórico precisa de no mínimo 2 caracteres" }),
});
