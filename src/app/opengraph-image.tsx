import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const logoBase64 = readFileSync(join(process.cwd(), "public", "logo-mark.png")).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111111",
          backgroundImage:
            "radial-gradient(circle at 82% 15%, rgba(230,198,122,0.28), transparent 55%), radial-gradient(circle at 8% 92%, rgba(200,155,60,0.16), transparent 45%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={220} height={146} alt="" />
        <div
          style={{
            marginTop: 28,
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 30,
            color: "#E6C67A",
            fontWeight: 500,
          }}
        >
          {site.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
