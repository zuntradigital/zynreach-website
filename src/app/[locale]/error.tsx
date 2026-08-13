"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { captureError } from "@/lib/monitoring";

/**
 * SRS 30.6 "Monitoring & Logging" + directive "Error boundaries": catches
 * render/runtime errors within a route segment so a single broken page
 * doesn't take down navigation to the rest of the site.
 */
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("common.error");
  useEffect(() => {
    captureError(error, { route: typeof window !== "undefined" ? window.location.pathname : undefined, digest: error.digest });
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-50 py-24">
      <div className="container-content max-w-lg text-center">
        <AlertTriangle aria-hidden="true" className="mx-auto h-10 w-10 text-error" />
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">{t("heading")}</h1>
        <p className="mt-2 text-neutral-600">{t("body")}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset} variant="primary">
            {t("tryAgain")}
          </Button>
          <Button href="/" variant="secondary">
            {t("goHome")}
          </Button>
        </div>
      </div>
    </main>
  );
}
