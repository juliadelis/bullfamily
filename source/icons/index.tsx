import { FaChevronDown } from "react-icons/fa";
import { IconProps } from "./types";

export function IconChevronDown({
  size,
  strokeWidth,
  color,
  className,
}: IconProps) {
  return (
    <FaChevronDown
      size={size}
      strokeWidth={strokeWidth ?? 2}
      className={className}
      color={color}
    />
  );
}
