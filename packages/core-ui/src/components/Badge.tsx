import { forwardRef, type HTMLAttributes, type ReactNode, type ElementType } from "react";
import { cx } from "../utils/cx.ts";

export type Tone = "primary" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "solid" | "subtle" | "outline";
  tone?: Tone;
  size?: "sm" | "md";
}

/** Compact label: dates, statuses, counts. */
export function Badge({ variant = "solid", tone = "primary", size = "md", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cx(
        "rk-badge",
        `rk-badge--${variant}`,
        tone !== "primary" && `rk-badge--${tone}`,
        size === "sm" && "rk-badge--sm",
        className,
      )}
      {...rest}
    />
  );
}

export interface ChipProps extends HTMLAttributes<HTMLElement> {
  icon?: ReactNode;
  active?: boolean;
  /** Render as "button" for filter chips or "a" for links. Default "span". */
  as?: ElementType;
  href?: string;
}

/** Pill with an optional icon: skills, tags, filters. */
export const Chip = forwardRef<HTMLElement, ChipProps>(function Chip(
  { icon, active, as: Tag = "span", className, children, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cx("rk-chip", active && "rk-chip--active", className)}
      {...(Tag === "button" ? { type: "button", "aria-pressed": active ?? undefined } : null)}
      {...rest}
    >
      {icon && (
        <span className="rk-chip__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Tag>
  );
});

export function ChipGroup({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("rk-chip-group", className)} {...rest} />;
}
