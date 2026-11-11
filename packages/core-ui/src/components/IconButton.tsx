import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import { cx } from "../utils/cx.ts";

export interface IconButtonStyleProps {
  /** `fill`: turns primary on hover (social links). `pop`: scales on hover (toggles). */
  effect?: "fill" | "pop";
  size?: "sm" | "md" | "lg";
}

export function iconButtonClassName({ effect = "fill", size = "md" }: IconButtonStyleProps = {}, className?: string) {
  return cx("rk-icon-btn", `rk-icon-btn--${effect}`, size !== "md" && `rk-icon-btn--${size}`, className);
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, IconButtonStyleProps {
  /** Required: icon-only buttons need an accessible name. */
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, effect, size, className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={iconButtonClassName({ effect, size }, className)}
      {...rest}
    />
  );
});

export interface IconLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, IconButtonStyleProps {
  label: string;
}

/** Circular icon link, e.g. GitHub / LinkedIn. External links open in a new tab. */
export const IconLink = forwardRef<HTMLAnchorElement, IconLinkProps>(function IconLink(
  { label, effect, size, className, href, target, rel, ...rest },
  ref,
) {
  const external = typeof href === "string" && /^https?:\/\//.test(href);
  return (
    <a
      ref={ref}
      href={href}
      aria-label={label}
      title={label}
      target={target ?? (external ? "_blank" : undefined)}
      rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      className={iconButtonClassName({ effect, size }, className)}
      {...rest}
    />
  );
});

export function IconGroup({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("rk-icon-group", className)} {...rest} />;
}
