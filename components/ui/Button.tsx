import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps
  extends Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "disabled" | "className"
  > {
  children: ReactNode;
}

export function Button({
  children,
  onClick,
  disabled,
  className,
}: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
