"use client";
import React from "react";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

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
        className="rounded-md w-full px-4 py-4 bg-inherit border mb-8 text-sm"
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Senha"
        required></input>
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-6 flex items-center"
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

export default PasswordInput;
