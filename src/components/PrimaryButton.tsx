import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./PrimaryButton.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function PrimaryButton({ children, type = "button", ...props }: Props) {
  return (
    <button className={styles.button} type={type} {...props}>
      {children}
    </button>
  );
}
