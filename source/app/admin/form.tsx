"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./formSchema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormComponent,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FieldByType } from "@/components/imoveis/fieldByType";

interface UserFormProps {
  user?: {
    name: string;
    email: string;
    isobserver?: boolean;
  };
  onSubmit: ({
    email,
    name,
    password,
    isObserver
  }: z.infer<typeof formSchema>) => Promise<void>;
}

export function Form({ onSubmit, user }: UserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user ? user.name : "",
      email: user ? user.email : "",
      password: user ? "password" : "",
      confirmPassword: user ? "password" : "",
      isObserver: user && user.isobserver ? user.isobserver : false
    },
  });

  const inputs = [
    {
      name: "name",
      label: "Nome",
      type: "text",

      placeholder: "Nome do novo usuário",
      description: "This is your public display name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",

      placeholder: "email@gmail.com",
      description: "This is your public display email",
    },
    {
      name: "password",
      label: "Senha",
      type: "password",
      placeholder: "*****",
      description: "Essa vai ser sua senha",
      hidden: user,
    },
    {
      name: "confirmPassword",
      label: "Confirme nova senha",
      placeholder: "*****",
      type: "password",
      description: "This is your public display passoed",
      hidden: user,
    },
    {
      name: "isObserver",
      label: "Usuário é de consulta",
      type: "checkbox",
    },
  ];
  return (
    <FormComponent {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        {inputs.map(({ name, label, placeholder, type, hidden }) => {
          if (hidden) {
            return <></>
          }
          return (
            
            <FormField
              control={form.control}
              name={name as "name" | "email" | "password" | "confirmPassword"}
              render={({ field }) => (
                <FormItem className={hidden ? "hidden " : "w-72"}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                        <FieldByType
                          type={type as "number" | "text" | "email" | "password" | "checkbox" | "date" | "tel" | "price" | "photo"}
                          name={name}
                          field={field}
                          placeholder={placeholder}
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button type="submit">Enviar</Button>
      </form>
    </FormComponent>
  );
}
