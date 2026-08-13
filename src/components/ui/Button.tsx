"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { trackCtaClick } from "@/lib/analytics";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "gold-gradient gold-gradient-hover text-white shadow-button hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:bg-none disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none disabled:translate-y-0",
  secondary:
    "bg-white dark:bg-neutral-100 text-neutral-900 border border-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:text-neutral-400 disabled:border-neutral-200 dark:hover:bg-neutral-200 dark:active:bg-neutral-300",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-400",
  destructive:
    "bg-error text-white hover:bg-red-700 active:bg-red-800 disabled:bg-neutral-300 disabled:text-neutral-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  // md stays at the 44px WCAG/Apple minimum tap-target size — a floor,
  // not a stylistic choice, so it's excluded from the density pass.
  md: "min-h-[44px] px-5 text-sm",
  lg: "min-h-[48px] px-6 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-300 ease-out-default disabled:cursor-not-allowed";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: React.ReactNode;
  /** SRS 16 "Event Tracking: CTA clicks" — set to fire a tracked cta_click event, e.g. "book-a-demo". */
  analyticsId?: string;
  /** Where the CTA appears, e.g. "nav", "hero", "cta-band". Required alongside analyticsId. */
  analyticsLocation?: string;
}

type ButtonAsButton = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  analyticsId,
  analyticsLocation,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    if (analyticsId) trackCtaClick(analyticsId, analyticsLocation ?? "unknown");
    onClick?.(event as never);
  }

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={handleClick}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={handleClick} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
