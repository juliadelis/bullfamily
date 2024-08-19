"use client";

import { z } from "zod";

export const formSchema = z.object({
  nameEstate: z.string(),
  pendency_acronym: z.string(),
  date: z.date(),
});
