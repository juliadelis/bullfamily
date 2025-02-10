"use client";

import { z } from "zod";

export const formSchemaPendency = z.object({
  nameEstate: z.string(),
  pendency_acronym: z.string(),
  date: z.date(),
  idState: z.number(),
});
