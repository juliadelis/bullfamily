import { format } from "date-fns";
import byteSize from "byte-size";
import { DateUtils } from "./date.utils";
import StringMask from "string-mask";

export class FormatterUtils {
  static formatDate(value: Date | number | string) {
    byteSize;
    return formatDateCustom(value, "dd/MM/yyyy");
  }

  static formatTime(value: Date | number | string) {
    return formatDateCustom(value, "HH:mm");
  }

  static formatDateTime(value: Date | number | string) {
    return formatDateCustom(value, "dd/MM/yyyy HH:mm:ss");
  }

  static formatLastActionDateTime(value: Date | number | string) {
    return formatDateCustom(value, "dd/MM/yyyy 'às' HH:mm:ss");
  }

  static formatInputDateTime(value: Date | number | string) {
    return formatDateCustom(value, "yyyy-MM-dd HH:mm:ss");
  }

  static formatInputDate(value: Date | number | string) {
    return formatDateCustom(value, "yyyy-MM-dd");
  }

  static formatDateDayMonth(value: Date | number | string) {
    return formatDateCustom(value, "dd MMMM");
  }

  static formatMB(bytes: number): string {
    const result = byteSize(bytes);
    return `${result.value}${result.unit}`;
  }

  static formatCpfCnpj(value: string) {
    value = String(value).replace(/[^0-9]/g, "");
    if (value.length <= 11) {
      value = FormatterUtils.formatCpf(value);
    } else {
      value = FormatterUtils.formatCnpj(value);
    }
    return value;
  }

  static formatCpf(value: string): string {
    value = value.replace(/[^0-9]/g, "");

    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  static formatCnpj(value: string): string {
    value = value.replace(/[^0-9]/g, "");

    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  static formatPhone(value: string): string {
    value = String(value).replace(/[^0-9]/g, "");
    let mask = new StringMask("(00) 00000-0000");
    let aux = mask.process(value);
    if (aux.valid) {
      return aux.result;
    }

    mask = new StringMask("(00) 0000-0000");
    aux = mask.process(value);
    return aux.result;
  }

  static formatZipCode(value: string): string {
    value = value.replace(/[^0-9]/g, "");

    return value.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  static formatNumberWithDots(value: number | string): string {
    if (typeof value === "string") {
      value = parseFloat(value.replace(/[^0-9.]/g, ""));
    }
    if (isNaN(value)) {
      return "0";
    }
    return value.toLocaleString("pt-BR");
  }
}

function formatDateCustom(
  value: Date | number | string,
  formatExpr: string
): string | null {
  if (!value) {
    return null;
  }

  const parsedValue = DateUtils.parseDate(value);

  if (!parsedValue) {
    return null;
  }

  return format(parsedValue, formatExpr);
}
