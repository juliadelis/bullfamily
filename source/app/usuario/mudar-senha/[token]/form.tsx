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

interface UserFormProps {
  onSubmit: ({ password }: z.infer<typeof formSchema>) => Promise<void>;
}

export function Form({ onSubmit }: UserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const inputs = [
    {
      name: "password",
      label: "Senha",
      type: "password",
      placeholder: "*****",
      description: "Essa vai ser sua senha",
    },
    {
      name: "confirmPassword",
      label: "Confirme nova senha",
      placeholder: "*****",
      type: "password",
      description: "This is your public display password",
    },
  ];
  return (
    <FormComponent {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {inputs.map(({ name, label, placeholder, type }) => {
          return (
            <FormField
              key={name}
              control={form.control}
              name={name as "password" | "confirmPassword"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input type={type} placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button type="submit">Alterar senha</Button>
      </form>
    </FormComponent>
  );
}
