"use client";

import { AnimatePresence, LazyMotion, MotionConfig, m, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./SiteHeader.module.css";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

type NavItem = { href: string; label: string };

export type SiteHeaderBarProps = {
  brand: { name: string; local: string; lang: string };
  items: NavItem[];
  cta: NavItem | null;
  /** Everything for the small-screen menu, in reading order. */
  menu: NavItem[];
  labels: { open: string; close: string; nav: string };
  /** theme.motion.enabled and theme.motion.speed */
  motion: { enabled: boolean; speed: number };
};

export function SiteHeaderBar({ brand, items, cta, menu, labels, motion }: SiteHeaderBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  // Prefetch on intent (hover, focus, touch) rather than on load: navigation stays instant
  // without spending the visitor's bandwidth and main thread on pages they may never open.
  const intent = (href: string) => {
    const prefetch = () => router.prefetch(href);
    return { prefetch: false, onPointerEnter: prefetch, onFocus: prefetch, onTouchStart: prefetch };
  };
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 48));

  // Close the menu whenever a link takes us to another page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus(); // don't strand focus on a link that is about to disappear
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={motion.enabled ? "user" : "always"}>
      <header className={`on-dark ${styles.header}`} data-solid={solid || open}>
        <div className={`wrap ${styles.bar}`}>
          <Link href="/" className={styles.brand} prefetch={false}>
            <span lang={brand.lang} className={styles.brandLocal} aria-hidden="true">
              {brand.local}
            </span>
            <span>{brand.name}</span>
          </Link>

          <nav aria-label={labels.nav} className={styles.desktopNav}>
            <ul>
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={current(item.href)} {...intent(item.href)}>
                    {item.label}
                  </Link>
                </li>
              ))}
              {cta && (
                <li>
                  <Link href={cta.href} className={styles.cta} aria-current={current(cta.href)} {...intent(cta.href)}>
                    {cta.label}
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <button
            ref={menuButton}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? labels.close : labels.open}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <m.nav
              id={menuId}
              aria-label={labels.nav}
              className={styles.mobileNav}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 * motion.speed, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="wrap">
                {menu.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current(item.href)}
                      onClick={() => setOpen(false)}
                      {...intent(item.href)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </m.nav>
          )}
        </AnimatePresence>
      </header>
      </MotionConfig>
    </LazyMotion>
  );
}
