"use client";
import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

interface Props {
  onValueChange?: (...event: any[]) => void;
}

const PasswordInput = ({ onValueChange }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="relative">
      <input
        onChange={(e) => {
          if (onValueChange) {
            onValueChange(e);
          }
        }}
        className="rounded-md px-2 py-2 bg-inherit w-full border mb-8 text-[12px]"
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Senha"
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-6 flex items-center text-[12px]"
        onClick={togglePasswordVisibility}>
        {showPassword ? (
          <FaRegEye className="mb-7 h-6 w-6" />
        ) : (
          <FaRegEyeSlash className="mb-7 h-6 w-6" />
        )}
      </button>
    </div>
  );
};

const UserPasswordInput = ({ onValueChange }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="relative">
      <input
        onChange={(e) => {
          if (onValueChange) {
            onValueChange(e);
          }
        }}
        className="rounded-md px-2 py-2 bg-inherit border  mb-4 text-sm"
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Senha"
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 mt-2 flex items-center text-[12px]"
        onClick={togglePasswordVisibility}>
        {showPassword ? (
          <FaRegEye className="mb-7 h-6 w-6" />
        ) : (
          <FaRegEyeSlash className="mb-7 h-6 w-6" />
        )}
      </button>
    </div>
  );
};

const ConfirmUserPasswordInput = ({ onValueChange }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="relative">
      <input
        onChange={(e) => {
          if (onValueChange) {
            onValueChange(e);
          }
        }}
        className="rounded-md px-2 py-2 bg-inherit border mb-4 text-sm"
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Confirme a senha"
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 mt-2  flex items-center text-[12px]"
        onClick={togglePasswordVisibility}>
        {showPassword ? (
          <FaRegEye className="mb-7 h-6 w-6" />
        ) : (
          <FaRegEyeSlash className="mb-7 h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export { PasswordInput, UserPasswordInput, ConfirmUserPasswordInput };
