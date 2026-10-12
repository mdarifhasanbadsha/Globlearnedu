"use client";

import { createElement, useEffect, useRef } from "react";
import Script from "next/script";

type CapCaptchaProps = {
  onTokenChange: (token: string) => void;
};

const CAP_WIDGET_SRC = "https://cdn.jsdelivr.net/npm/@cap.js/widget";

export default function CapCaptcha({ onTokenChange }: CapCaptchaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const endpoint = process.env.NEXT_PUBLIC_CAP_API_ENDPOINT?.trim();

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    onTokenChangeRef.current("");
    const container = containerRef.current;
    if (!container || !endpoint) return;

    const widget = createElement("cap-widget", {
      "data-cap-api-endpoint": endpoint,
      "data-cap-i18n-initial-state": "Verify you're human",
      "data-cap-i18n-solved-label": "Verification complete",
    }) as HTMLElement;

    const handleSolve = (event: Event) => {
      const detail = (event as CustomEvent<{ token?: string }>).detail;
      onTokenChangeRef.current(String(detail?.token || ""));
    };
    const handleReset = () => onTokenChangeRef.current("");

    widget.addEventListener("solve", handleSolve);
    widget.addEventListener("reset", handleReset);
    container.replaceChildren(widget);

    return () => {
      widget.removeEventListener("solve", handleSolve);
      widget.removeEventListener("reset", handleReset);
      container.replaceChildren();
    };
  }, [endpoint]);

  return (
    <div className="mt-5">
      <Script src={CAP_WIDGET_SRC} strategy="afterInteractive" />
      {endpoint ? (
        <div ref={containerRef} aria-label="CAPTCHA verification" />
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          CAPTCHA is not configured yet. Set NEXT_PUBLIC_CAP_API_ENDPOINT and the server-side CAP_SECRET_KEY before enabling admin login.
        </p>
      )}
    </div>
  );
}
