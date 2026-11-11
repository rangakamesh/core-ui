import { forwardRef, type HTMLAttributes, type ElementType } from "react";
import { cx } from "../utils/cx.ts";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Inner padding. Use "none" with CardMedia + CardBody. Default "lg". */
  padding?: "none" | "sm" | "md" | "lg";
  /**
   * Hover behaviour:
   *  - "lift" (default): subtle lift for content cards
   *  - "interactive": stronger lift for clickable grid tiles
   *  - "none": static
   */
  hover?: "lift" | "interactive" | "none";
  as?: ElementType;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { padding = "lg", hover = "lift", as: Tag = "div", className, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cx(
        "rk-card",
        `rk-card--pad-${padding}`,
        hover === "lift" && "rk-card--hover",
        hover === "interactive" && "rk-card--interactive",
        className,
      )}
      {...rest}
    />
  );
});

/** Title on the left, meta (e.g. a date Badge) on the right; stacks on mobile. */
export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("rk-card__header", className)} {...rest} />;
}

export function CardTitle({
  as: Tag = "h3",
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { as?: ElementType }) {
  return <Tag className={cx("rk-card__title", className)} {...rest} />;
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("rk-card__body", className)} {...rest} />;
}

/** Two-column button row at the bottom of a card. */
export function CardActions({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("rk-card__actions", className)} {...rest} />;
}

/** Class for a full-bleed image at the top of a card (works with next/image). */
export const cardMediaClassName = "rk-card__media";

/** Responsive auto-fill grid (min column width = --rk-card-min-width). */
export function CardGrid({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("rk-card-grid", className)} {...rest} />;
}
