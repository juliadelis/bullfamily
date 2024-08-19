"use client";

import { z } from "zod";

export const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Senha precisa no minimo ter mais de 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Senha precisa no minimo ter mais de 6 caracteres" }),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "Senha e confirmação de senha são diferentes",
      });
      ctx.addIssue({
        path: ["password"],
        code: "custom",
        message: "Senha e confirmação de senha são diferentes",
      });
    }
  });
