"use client";

import { useEffect, useRef } from "react";

export function DecorativeVideoBackground({ videoUrl }: { videoUrl?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (motionPreference.matches) {
        video.pause();
        return;
      }

      void video.play().catch((error: unknown) => {
        console.warn("Background video autoplay is unavailable; showing the animated fallback.", error);
      });
    };

    syncPlayback();
    motionPreference.addEventListener("change", syncPlayback);
    return () => motionPreference.removeEventListener("change", syncPlayback);
  }, [videoUrl]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          className="decorative-background-video absolute inset-0 h-full w-full object-cover opacity-60"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/65 via-navy/25 to-navy/70" />
    </div>
  );
}
