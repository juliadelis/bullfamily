declare module "string-mask" {
  export default class StringMask {
    constructor(mask: string);
    process(value: string): {
      valid: boolean;
      result: string;
    };
  }
}
