import { isValid } from "date-fns";

const TIMEZONE_OFFSET = new Date().getTimezoneOffset();

export class DateUtils {
  static isValidDate(value: Date): value is Date {
    return isValid(value);
  }

  static parseDateOnly(value: Date | number | string): Date | null {
    const parsedDate = DateUtils.parseDate(value);
    if (!parsedDate) {
      return null;
    }

    parsedDate.setUTCHours(0);
    parsedDate.setUTCMinutes(TIMEZONE_OFFSET);
    parsedDate.setUTCSeconds(0);
    parsedDate.setUTCMilliseconds(0);

    return parsedDate;
  }

  static parseDate(value: Date | number | string): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return new Date(value);
    }

    if (typeof value === "string") {
      const parsedDate = new Date(value);
      if (DateUtils.isValidDate(parsedDate)) {
        return parsedDate;
      }
    }

    const valueNumber = Number(value);
    if (!Number.isNaN(valueNumber)) {
      const parsedDate = new Date(valueNumber);
      if (DateUtils.isValidDate(parsedDate)) {
        return parsedDate;
      }
    }

    return null;
  }
}
