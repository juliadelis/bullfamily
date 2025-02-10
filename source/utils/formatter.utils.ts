import { format } from "date-fns";
import byteSize from "byte-size";
import StringMask from "string-mask";
import { DateUtils } from "./date.utils";

export class FormatterUtils {
  static formatDate(value: Date | number | string) {
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

function formatDateCustom(value: Date | number | string, formatExpr: string) {
  if (!value) {
    return null;
  }

  value = DateUtils.parseDate(value);

  if (!DateUtils.isValidDate(value)) {
    return null;
  }

  const aux = format(value, formatExpr);
  return aux;
}
