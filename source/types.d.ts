declare module "string-mask" {
  class StringMask {
    constructor(pattern: string);
    apply(value: string | number): string;
    process(value: string | number): { result: string; valid: boolean };
  }

  export default StringMask;
}
