"use client";

// Passing next/link into SideNav must happen in a client file:
// components can't be sent as props from a Server Component.
import Link from "next/link";
import { useEffect, useState } from "react";
import { SideNav, ThemeToggle } from "@rangakamesh-packages/core-ui/client";

const sections = ["tokens", "buttons", "cards", "badges", "typography", "forms", "layout"];

export function Nav() {
  const [active, setActive] = useState("tokens");

  // Highlight the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <SideNav
      linkComponent={Link}
      brand={<span>core-ui</span>}
      brandHref="#tokens"
      items={sections.map((id) => ({ href: `#${id}`, label: id, active: active === id }))}
      footer={<ThemeToggle />}
    />
  );
}
