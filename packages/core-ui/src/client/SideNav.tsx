import { useEffect, useId, useState, type ComponentType, type ReactNode } from "react";
import { cx } from "../utils/cx.ts";

export interface SideNavItem {
  label: ReactNode;
  href: string;
  /** Highlight as the current page/section. */
  active?: boolean;
}

type LinkLike = ComponentType<{
  href: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  "aria-current"?: "page" | undefined;
}>;

export interface SideNavProps {
  items: SideNavItem[];
  /** Logo, avatar or name shown at the top (sidebar) / left (top bar). */
  brand?: ReactNode;
  brandHref?: string;
  /** Pinned to the bottom of the sidebar, e.g. <ThemeToggle /> or social icons. */
  footer?: ReactNode;
  /** Link component used for items, e.g. Next's `Link`. Defaults to <a>. */
  linkComponent?: LinkLike;
  className?: string;
  "aria-label"?: string;
}

/**
 * Portfolio navigation: a fixed left sidebar on desktop and a collapsible top
 * bar on mobile. Wrap page content in <ShellMain> so it clears the sidebar.
 *
 *   <SideNav linkComponent={Link} brand={<Avatar … />} items={[…]} footer={<ThemeToggle />} />
 *   <ShellMain>{children}</ShellMain>
 */
export function SideNav({
  items,
  brand,
  brandHref = "/",
  footer,
  linkComponent,
  className,
  "aria-label": ariaLabel = "Main",
}: SideNavProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const Link = (linkComponent ?? "a") as LinkLike;

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className={cx("rk-sidenav", className)} data-open={open} aria-label={ariaLabel}>
      {brand && (
        <Link href={brandHref} className="rk-sidenav__brand">
          {brand}
        </Link>
      )}

      <button
        type="button"
        className="rk-sidenav__toggle"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="rk-sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <ul id={menuId} className="rk-sidenav__menu">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="rk-sidenav__link"
              aria-current={item.active ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {footer && <div className="rk-sidenav__footer">{footer}</div>}
    </nav>
  );
}
