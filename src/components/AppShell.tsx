"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import {
  ArrowUpIcon,
  Badge,
  BoltIcon,
  buttonVariants,
  Card,
  CloseIcon,
  GitHubIcon,
  HomeIcon,
  IconButton,
  LockIcon,
  LogoMark,
  MenuIcon,
  NorthEastIcon,
  PaletteIcon,
  Shape,
  ShapedIcon,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Tooltip,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { META_LINKS, SITE, TOOLS, type ToolIcon } from "@/lib/site";

const TOOL_ICONS: Record<ToolIcon, typeof BoltIcon> = { bolt: BoltIcon };

/* Compact "island" header once the page is scrolled (with hysteresis so it doesn't flicker) */
const COMPACT_AT = 80;
const EXPAND_AT = 24;
let compactNow = false;
const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};
const getCompact = () => {
  const y = window.scrollY;
  if (compactNow && y < EXPAND_AT) compactNow = false;
  else if (!compactNow && y > COMPACT_AT) compactNow = true;
  return compactNow;
};
const getCompactServer = () => false;

const navItem = cn(
  "state-layer flex min-h-14 items-center gap-3 rounded-full py-2 pr-4 pl-3 type-label-lg text-on-surface-variant",
  "aria-[current=page]:bg-secondary-container aria-[current=page]:font-bold aria-[current=page]:text-on-secondary-container",
);

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const compact = useSyncExternalStore(subscribeScroll, getCompact, getCompactServer);
  const onToolPage = TOOLS.some((t) => t.href === pathname);

  const topLinks = [{ href: "/", label: "Home" }, ...TOOLS.map((t) => ({ href: t.href, label: t.short }))];

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-40 flex justify-center px-2 pt-2 sm:px-4 sm:pt-3">
        <div
          data-compact={compact || undefined}
          className={cn(
            "pointer-events-auto flex max-w-page items-center gap-1.5 rounded-full border p-1.5 backdrop-blur-xl",
            "transition-[width,background-color,border-color,box-shadow,color] duration-medium4 ease-emphasized",
            compact
              ? "w-fit border-white/10 bg-inverse-surface/95 text-inverse-on-surface shadow-elevation-3"
              : "w-full border-white/80 bg-surface-container-lowest/70 text-on-surface shadow-soft",
          )}
        >
          <Sheet open={open} onOpenChange={setOpen}>
            <Tooltip content="Tools" side="bottom">
              <SheetTrigger
                render={
                  <IconButton
                    label="Open tools menu"
                    size={compact ? "sm" : "md"}
                    className={cn("transition-[width,height]", compact ? "text-inverse-on-surface" : "text-on-surface")}
                  >
                    <MenuIcon />
                  </IconButton>
                }
              />
            </Tooltip>
            <SheetContent side="left" aria-labelledby="drawer-title">
              <DrawerBody pathname={pathname} onNavigate={close} />
            </SheetContent>
          </Sheet>

          {/* Brand: collapses away in the compact island */}
          <Link
            href="/"
            inert={compact}
            aria-hidden={compact || undefined}
            className={cn(
              "flex items-center gap-2 overflow-hidden rounded-full whitespace-nowrap",
              "transition-[max-width,opacity,padding] duration-medium4 ease-emphasized",
              compact ? "max-w-0 px-0 opacity-0" : "max-w-64 pr-3 pl-1 opacity-100",
            )}
          >
            <LogoMark size={30} />
            <span className="font-brand text-sm leading-none tracking-tight sm:text-base">{SITE.wordmark}</span>
          </Link>

          <nav
            aria-label="Primary"
            className={cn(
              "items-center gap-1 rounded-full bg-inverse-surface",
              compact ? "flex p-0" : "mx-auto hidden p-1 md:flex",
            )}
          >
            {topLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "state-layer flex h-8 items-center gap-1.5 rounded-full px-4 type-label-md whitespace-nowrap transition-colors duration-short4",
                    active ? "bg-primary-container text-on-primary-container" : "text-inverse-on-surface",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn("size-1.5 rounded-[1px]", active ? "bg-on-primary-container" : "bg-inverse-on-surface/60")}
                  />
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {compact ? (
            onToolPage ? (
              <Tooltip content="Back to top" side="bottom">
                <IconButton
                  label="Back to top"
                  size="sm"
                  variant="accent"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <ArrowUpIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Link
                href={TOOLS[0].href}
                className={cn(buttonVariants({ variant: "accent", size: "sm" }), "h-8 gap-1 rounded-[16px] px-3")}
              >
                Start
                <NorthEastIcon size={14} />
              </Link>
            )
          ) : (
            <Link
              href={TOOLS[0].href}
              className={cn(
                buttonVariants({ variant: "outlined", size: "sm" }),
                "ml-auto hidden border-on-surface/30 sm:inline-flex md:ml-0",
              )}
            >
              Start creating
              <NorthEastIcon size={16} />
            </Link>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="mx-auto w-full max-w-page px-4 pt-6 pb-8 type-body-sm text-on-surface-variant">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/60 pt-5">
          <span className="font-brand">{SITE.wordmark}</span>
          <span className="flex items-center gap-1.5">
            <LockIcon size={14} /> Everything runs locally in your browser. Nothing is uploaded.
          </span>
          <a href={SITE.repo} className="flex items-center gap-1.5 font-semibold text-on-surface hover:text-primary">
            <GitHubIcon size={14} /> Open source on GitHub (MIT)
          </a>
        </div>
      </footer>
    </>
  );
}

function DrawerBody({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between py-1 pr-1 pl-3">
        <span className="flex items-center gap-2">
          <LogoMark size={28} />
          <span className="font-brand text-sm">{SITE.wordmark}</span>
        </span>
        <SheetClose
          render={
            <IconButton label="Close tools menu">
              <CloseIcon />
            </IconButton>
          }
        />
      </div>

      <nav aria-labelledby="drawer-title" className="mt-3 flex flex-col gap-1">
        <Link href="/" className={navItem} aria-current={pathname === "/" ? "page" : undefined} onClick={onNavigate}>
          <span className="grid size-10 place-items-center">
            <HomeIcon />
          </span>
          Home
        </Link>

        <SheetTitle
          id="drawer-title"
          className="mt-4 mb-1 px-4 type-label-md tracking-[0.12em] text-on-surface-variant uppercase"
        >
          Tools
        </SheetTitle>

        {TOOLS.map((tool) => {
          const Icon = TOOL_ICONS[tool.icon];
          return (
            <Link
              key={tool.slug}
              href={tool.href}
              className={navItem}
              aria-current={pathname === tool.href ? "page" : undefined}
              onClick={onNavigate}
            >
              <ShapedIcon tone="primary" shape="cookie9">
                <Icon />
              </ShapedIcon>
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{tool.name}</span>
                <span className="truncate type-body-sm opacity-80">{tool.description}</span>
              </span>
              {tool.badge && (
                <Badge tone="tertiary" className="ml-auto">
                  {tool.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-6">
        {META_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(navItem, "min-h-12")}
            aria-current={pathname === l.href ? "page" : undefined}
            onClick={onNavigate}
          >
            <span className="grid size-10 place-items-center">
              <PaletteIcon />
            </span>
            {l.label}
          </Link>
        ))}
        <Card variant="filled" padding="md" className="overflow-hidden bg-surface-container-high">
          <Shape name="clover4" className="animate-spin-slow absolute -top-6 -right-6 size-24 text-secondary-container" />
          <p className="relative font-brand text-xs">MORE SOON</p>
          <p className="relative mt-1 type-body-md text-on-surface-variant">
            New tools will show up here as they&apos;re added.
          </p>
        </Card>
      </div>
    </>
  );
}
