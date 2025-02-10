"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./formSchema";
import { z } from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormComponent,
} from "@/components/ui/form";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { ConfirmUserPasswordInput, UserPasswordInput } from "../login/password";
import React, { useEffect, useState } from "react";

interface UserFormProps {
  user?: {
    name: string;
    email: string;
    isobserver?: boolean;
    isadmin?: boolean;
    personalized?: boolean;
    addestate?: boolean;
    editestate?: boolean;
    deleteestate?: boolean;
    editpayments?: boolean;
    edithistory?: boolean;
    delethistory?: boolean;
  };
  onSubmit: ({
    email,
    name,
    password,
    isobserver,
    isadmin,
    personalized,
    addestate,
    editestate,
    deleteestate,
    editpayments,
    edithistory,
    delethistory,
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
      isobserver: user?.isobserver ?? false,
      isadmin: user?.isadmin ?? false,
      personalized: user?.personalized ?? false,
      addestate: user?.addestate ?? false,
      editestate: user?.editestate ?? false,
      deleteestate: user?.deleteestate ?? false,
      editpayments: user?.editpayments ?? false,
      edithistory: user?.edithistory ?? false,
      delethistory: user?.delethistory ?? false,
    },
  });

  const [permissions, setPermissions] = useState({
    personalized: user?.personalized ?? false,
    addestate: user?.addestate ?? false,
    editestate: user?.editestate ?? false,
    deleteestate: user?.deleteestate ?? false,
    editpayments: user?.editpayments ?? false,
    edithistory: user?.edithistory ?? false,
    delethistory: user?.delethistory ?? false,
  });

  const allChecked = Object.values(permissions).every(Boolean);
  const someChecked = Object.values(permissions).some(Boolean) && !allChecked;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const updatedPermissions = {
      personalized: isChecked,
      addestate: isChecked,
      editestate: isChecked,
      deleteestate: isChecked,
      editpayments: isChecked,
      edithistory: isChecked,
      delethistory: isChecked,
    };
    setPermissions(updatedPermissions);

    Object.entries(updatedPermissions).forEach(([key, value]) => {
      form.setValue(key as keyof typeof permissions, value);
    });

    if (!isChecked) {
      form.setValue("isadmin", false);
    }
  };

  const handlePermissionChange =
    (field: keyof typeof permissions) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setPermissions((prev) => {
        const updatedPermissions = { ...prev, [field]: isChecked };
        form.setValue(field, isChecked);

        if (!isChecked) {
          form.setValue("isadmin", false);
        }

        return updatedPermissions;
      });
    };

  useEffect(() => {
    if (form.watch("isadmin")) {
      form.setValue("isobserver", false);
      Object.keys(permissions).forEach((key) =>
        form.setValue(key as keyof typeof permissions, true)
      );
    } else if (form.watch("isobserver")) {
      form.setValue("isadmin", false);
      Object.keys(permissions).forEach((key) =>
        form.setValue(key as keyof typeof permissions, false)
      );
    } else {
      if (Object.values(permissions).some(Boolean)) {
        form.setValue("isadmin", false);
        form.setValue("isobserver", false);
      }
    }
  }, [form.watch("isadmin"), form.watch("isobserver"), permissions]);

  return (
    <FormComponent {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-2 flex flex-wrap w-full">
        <div className="mb-4 w-full">
          <p className="text-[12px] uppercase">DADOS DO USUÁRIO</p>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-[12.063rem]">
              <FormControl>
                <TextField
                  className="text-[12px]"
                  size="small"
                  label="Nome"
                  {...field}
                  fullWidth
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-[12.063rem]">
              <FormControl>
                <TextField
                  className="text-[12px]"
                  size="small"
                  type="email"
                  label="Email"
                  {...field}
                  fullWidth
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!user && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-[12.063rem] mr-4">
                  <UserPasswordInput onValueChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-[12.063rem]">
                  <ConfirmUserPasswordInput onValueChange={field.onChange} />
                </FormItem>
              )}
            />
          </>
        )}
        <div className=" w-full">
          <Divider />
        </div>
        <FormField
          control={form.control}
          name="isadmin"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControlLabel
                control={
                  <Switch
                    inputProps={{ "aria-label": "controlled" }}
                    checked={Boolean(field.value)}
                    onChange={(_, checked) => {
                      field.onChange(checked);
                      if (checked) {
                        const updatedPermissions = {
                          personalized: true,
                          addestate: true,
                          editestate: true,
                          deleteestate: true,
                          editpayments: true,
                          edithistory: true,
                          delethistory: true,
                        };

                        setPermissions(updatedPermissions);
                        Object.entries(updatedPermissions).forEach(
                          ([key, value]) =>
                            form.setValue(
                              key as keyof typeof permissions,
                              value
                            )
                        );

                        form.setValue("isobserver", false);
                      }
                    }}
                    disabled={form.watch("isobserver")}
                  />
                }
                label="Usuário é admin"
                className="text-[12px]"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isobserver"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControlLabel
                control={
                  <Switch
                    inputProps={{ "aria-label": "controlled" }}
                    checked={Boolean(field.value)}
                    onChange={(_, checked) => field.onChange(checked)}
                    disabled={
                      Object.values(permissions).some(Boolean) ||
                      form.watch("isadmin")
                    }
                  />
                }
                label="Usuário de consulta"
                className="text-[12px]"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="my-4 w-full">
          <p className="text-[12px] uppercase">
            CONFIGURAÇÕES DE PERMISSIONAMENTO
          </p>
        </div>

        <div>
          <FormControlLabel
            label="Selecionar tudo"
            control={
              <Checkbox
                checked={allChecked}
                indeterminate={someChecked}
                onChange={handleSelectAll}
                disabled={form.watch("isobserver")}
              />
            }
          />

          <Box sx={{ display: "flex flex-wrap", flexDirection: "row", mb: 4 }}>
            <FormControlLabel
              label="Usuário pode adicionar imóvel"
              control={
                <Checkbox
                  checked={permissions.addestate}
                  onChange={handlePermissionChange("addestate")}
                  disabled={form.watch("isobserver")}
                />
              }
            />
            <FormControlLabel
              label="Usuário pode editar imóvel"
              control={
                <Checkbox
                  checked={permissions.editestate}
                  onChange={handlePermissionChange("editestate")}
                  disabled={form.watch("isobserver")}
                />
              }
            />
            <FormControlLabel
              label="Usuário pode deletar imóvel"
              control={
                <Checkbox
                  checked={permissions.deleteestate}
                  onChange={handlePermissionChange("deleteestate")}
                  disabled={form.watch("isobserver")}
                />
              }
            />
            <FormControlLabel
              label="Usuário pode editar pagamentos"
              control={
                <Checkbox
                  checked={permissions.editpayments}
                  onChange={handlePermissionChange("editpayments")}
                  disabled={form.watch("isobserver")}
                />
              }
            />
            <FormControlLabel
              label="Usuário pode editar histórico"
              control={
                <Checkbox
                  checked={permissions.edithistory}
                  onChange={handlePermissionChange("edithistory")}
                  disabled={form.watch("isobserver")}
                />
              }
            />
            <FormControlLabel
              label="Usuário pode apagar histórico"
              control={
                <Checkbox
                  checked={permissions.delethistory}
                  onChange={handlePermissionChange("delethistory")}
                  disabled={form.watch("isobserver")}
                />
              }
            />
          </Box>
        </div>

        <div className="w-full flex gap-4 mt-4">
          <Button type="submit" className="normal-case text-white bg-black">
            Salvar
          </Button>
          <Button
            href="/admin"
            className="normal-case underline text-black"
            type="text">
            Cancelar
          </Button>
        </div>
      </form>
    </FormComponent>
  );
}
