import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/cx.ts";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Visual size. Also the tag unless `as` is set. */
  level?: HeadingLevel;
  /** Override the rendered tag (e.g. visual h1 rendered as h2 for document outline). */
  as?: ElementType;
  /** Section-title rule underneath (portfolio h2 style). */
  underline?: boolean;
  /** Colour the whole heading with the primary colour. */
  accent?: boolean;
}

export function Heading({ level = 2, as, underline, accent, className, ...rest }: HeadingProps) {
  const Tag = as ?? (`h${level}` as ElementType);
  return (
    <Tag
      className={cx(
        "rk-heading",
        `rk-heading--${level}`,
        underline && "rk-heading--underline",
        accent && "rk-heading--accent",
        className,
      )}
      {...rest}
    />
  );
}

/** Wrap part of a heading to colour it, e.g. <Heading>Ranga <Accent>Kamesh</Accent></Heading> */
export function Accent({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("rk-accent", className)} {...rest} />;
}

/** Condensed uppercase label line: roles, locations, section intros. */
export function Subheading({
  as: Tag = "div",
  muted,
  className,
  ...rest
}: HTMLAttributes<HTMLElement> & { as?: ElementType; muted?: boolean }) {
  return <Tag className={cx("rk-subheading", muted && "rk-muted", className)} {...rest} />;
}

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: "xs" | "sm" | "base" | "lead";
  tone?: "default" | "muted" | "primary" | "danger" | "success";
  bold?: boolean;
  /** Remove bottom margin. */
  flush?: boolean;
}

export function Text({ as: Tag = "p", size = "base", tone = "default", bold, flush, className, ...rest }: TextProps) {
  return (
    <Tag
      className={cx(
        "rk-text",
        size !== "base" && `rk-text--${size}`,
        tone !== "default" && `rk-text--${tone}`,
        bold && "rk-text--bold",
        flush && "rk-text--flush",
        className,
      )}
      {...rest}
    />
  );
}

export function Divider({ flush, className, ...rest }: HTMLAttributes<HTMLHRElement> & { flush?: boolean }) {
  return <hr className={cx("rk-divider", flush && "rk-divider--flush", className)} {...rest} />;
}

export function Code({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <code className={cx("rk-code", className)} {...rest} />;
}

/** Icon + text with an accent rule (contact details, key facts). */
export function DetailItem({
  icon,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { icon?: ReactNode }) {
  return (
    <div className={cx("rk-detail", className)} {...rest}>
      {icon && (
        <span className="rk-detail__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <p className="rk-detail__text">{children}</p>
    </div>
  );
}
