import { ControllerRenderProps } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface PhoneInputProps {
  field: ControllerRenderProps<any, any>;
}

export const PhoneInput = ({ field }: PhoneInputProps) => {
  return (
    <InputOTP maxLength={12} {...field}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
        <InputOTPSlot index={6} />
      </InputOTPGroup>
      <InputOTPGroup>
        <InputOTPSlot index={7} />
        <InputOTPSlot index={8} />
        <InputOTPSlot index={9} />
        <InputOTPSlot index={10} />
      </InputOTPGroup>
    </InputOTP>
  );
};
