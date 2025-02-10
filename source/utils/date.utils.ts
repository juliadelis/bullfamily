import { isValid } from "date-fns";

const TIMEZONE_OFFSET = new Date().getTimezoneOffset();

export class DateUtils {
  static isValidDate(value: Date): value is Date {
    return isValid(value);
  }

  static parseDateOnly(value: Date | number | string): Date {
    value = DateUtils.parseDate(value);
    if (!value) {
      return new Date(0);
    }

    value.setUTCHours(0);
    value.setUTCMinutes(TIMEZONE_OFFSET);
    value.setUTCSeconds(0);
    value.setUTCMilliseconds(0);

    return value;
  }

  static parseDate(value: Date | number | string): Date {
    if (!value) {
      return new Date(0);
    }

    if (value instanceof Date) {
      value = new Date(value);
    }

    if (typeof value === "string") {
      value = new Date(value);
    }

    const valueNumber = Number(value);
    if (!Number.isNaN(valueNumber)) {
      value = new Date(valueNumber);
    }

    if (DateUtils.isValidDate(value as Date)) {
      return value as Date;
    }

    return new Date(0);
  }
}
