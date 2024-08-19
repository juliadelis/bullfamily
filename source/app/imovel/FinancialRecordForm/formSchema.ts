"use client";
import { z } from "zod";

export const formSchema = z.object({
  propertyTaxIPTU: z.date().optional(),
  rent: z.date().optional(),
  condominium: z.date().optional(),
  sabesp: z.date().optional(),
  enel: z.date().optional(),
  gas: z.date().optional(),
  extra: z.date().optional(),
  propertyTaxIPTUValue: z.number().optional(),
  rentValue: z.number().optional(),
  condominiumValue: z.number().optional(),
  sabespValue: z.number().optional(),
  enelValue: z.number().optional(),
  gasValue: z.number().optional(),
  statusPropertyTaxIPTU: z.string().optional(),
  statusRent: z.string().optional(),
  statusCondominium: z.string().optional(),
  statusExtraConstructions: z.string().optional(),
  statusSabesp: z.string().optional(),
  statusEnel: z.string().optional(),
  statusGas: z.string().optional(),
  observations: z.string().optional(),
  extraStatus: z.string().optional(),
  extraValue: z.number().optional(),
  rentPerson: z.string().optional(),
  condominiumPerson: z.string().optional(),
  sabespPerson: z.string().optional(),
  enelPerson: z.string().optional(),
  gasPerson: z.string().optional(),
  extraPerson: z.string().optional(),
  propertyTaxIPTUPerson: z.string().optional(),
});
