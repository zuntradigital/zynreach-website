import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware replacements for next/link, next/navigation's useRouter/usePathname,
 * and redirect — every internal link in the app should import Link from here
 * instead of "next/link" so it automatically carries the current locale prefix.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
