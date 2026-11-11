import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/cx.ts";

type Space = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export function Container({ as: Tag = "div", className, ...rest }: HTMLAttributes<HTMLElement> & { as?: ElementType }) {
  return <Tag className={cx("rk-container", className)} {...rest} />;
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** At least full viewport height on tablets and up (portfolio sections). */
  fullHeight?: boolean;
}

export function Section({ fullHeight, className, ...rest }: SectionProps) {
  return <section className={cx("rk-section", fullHeight && "rk-section--full", className)} {...rest} />;
}

interface FlowProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap on the space scale (1 = 0.25rem … 9 = 5rem). */
  gap?: Space;
  as?: ElementType;
}

const gapStyle = (gap: Space | undefined, style?: CSSProperties) =>
  gap ? ({ ...style, "--rk-stack-gap": `var(--rk-space-${gap})` } as CSSProperties) : style;

/** Vertical stack with consistent gaps. */
export function Stack({ gap, as: Tag = "div", className, style, ...rest }: FlowProps) {
  return <Tag className={cx("rk-stack", className)} style={gapStyle(gap, style)} {...rest} />;
}

/** Horizontal, wrapping row with consistent gaps. */
export function Cluster({ gap, as: Tag = "div", className, style, ...rest }: FlowProps) {
  return <Tag className={cx("rk-cluster", className)} style={gapStyle(gap, style)} {...rest} />;
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Plain image source. Or pass a child such as next/image instead. */
  src?: string;
  alt?: string;
  /** Pixel size (square). */
  size?: number;
  shape?: "rounded" | "circle";
  hover?: boolean;
  children?: ReactNode;
}

/** Framed profile image (24px radius, thick border, lifts on hover). */
export function Avatar({ src, alt = "", size = 160, shape = "rounded", hover = true, className, style, children, ...rest }: AvatarProps) {
  return (
    <span
      className={cx("rk-avatar", shape === "circle" && "rk-avatar--circle", hover && "rk-avatar--hover", className)}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      {children ?? (src ? <img src={src} alt={alt} width={size} height={size} /> : null)}
    </span>
  );
}

/** Bordered surface for charts and widgets. */
export function Panel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("rk-panel", className)} {...rest} />;
}

/** Class for iframes / maps / videos so they match card borders. */
export const embedClassName = "rk-embed";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: "primary" | "success" | "warning" | "danger";
  title?: ReactNode;
  icon?: ReactNode;
}

export function Alert({ tone = "primary", title, icon, className, children, ...rest }: AlertProps) {
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cx("rk-alert", tone !== "primary" && `rk-alert--${tone}`, className)}
      {...rest}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <div>
        {title && <strong className="rk-alert__title">{title}</strong>}
        {children}
      </div>
    </div>
  );
}

/** Main content wrapper that clears the fixed SideNav on desktop. */
export function ShellMain({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <main className={cx("rk-shell__main", className)} {...rest} />;
}
