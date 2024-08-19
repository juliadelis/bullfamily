"use client";

import { z } from "zod";

export const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nome precisa de no minimo 2 caracteres" })
      .max(50, { message: "Nome tem que ter no maximo 50 caracteres" }),
    email: z.string().email({ message: "Precisa ser um email valido" }),
    password: z
      .string()
      .min(6, { message: "Senha precisa no minimo ter mais de 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Senha precisa no minimo ter mais de 6 caracteres" }),
    isObserver: z.boolean({
      required_error:"É preciso dizer se o usuario é de consulta"
    })
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
