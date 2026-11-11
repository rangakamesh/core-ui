import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cx } from "../utils/cx.ts";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the container width. */
  block?: boolean;
  /** Go full-width below 768px (portfolio behaviour). */
  responsive?: boolean;
}

/**
 * Class names for a button. Use it to style links that should look like buttons:
 *   <Link href="/cv" className={buttonClassName({ variant: "outline" })}>CV</Link>
 */
export function buttonClassName(
  { variant = "primary", size = "md", block, responsive }: ButtonStyleProps = {},
  className?: string,
) {
  return cx(
    "rk-btn",
    `rk-btn--${variant}`,
    size !== "md" && `rk-btn--${size}`,
    block && "rk-btn--block",
    responsive && "rk-btn--responsive",
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {
  /** Shows a spinner and disables the button. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, block, responsive, loading, disabled, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClassName({ variant, size, block, responsive }, className)}
      {...rest}
    >
      {loading && <span className="rk-btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
});
