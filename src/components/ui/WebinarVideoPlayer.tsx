"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface WebinarVideoPlayerProps {
  videoUrl: string;
  webinarSlug: string;
}

const DIRECT_VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg"];

/** Knowledge Center §9.7/§22 On-Demand video — fires Video Started on first play and Video Completed on end for a native file; embedded (YouTube/Vimeo-style) URLs fire Video Started once on render, since a third-party player's own JS API would be needed for a reliable Completed event here and none is integrated. */
export function WebinarVideoPlayer({ videoUrl, webinarSlug }: WebinarVideoPlayerProps) {
  const isDirectFile = DIRECT_VIDEO_EXTENSIONS.some((ext) => videoUrl.toLowerCase().includes(ext));
  const startedRef = useRef(false);

  useEffect(() => {
    if (isDirectFile) return;
    trackEvent("webinar_video_start", { webinar_slug: webinarSlug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePlay() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("webinar_video_start", { webinar_slug: webinarSlug });
  }
  function handleEnded() {
    trackEvent("webinar_video_complete", { webinar_slug: webinarSlug });
  }

  if (isDirectFile) {
    return (
      <video controls onPlay={handlePlay} onEnded={handleEnded} className="aspect-video w-full rounded-xl bg-black">
        <source src={videoUrl} />
      </video>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        src={videoUrl}
        title="Webinar recording"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
