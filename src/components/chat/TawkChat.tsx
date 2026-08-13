import Script from "next/script";

/**
 * Tawk.to live chat widget — loaded globally from the root layout,
 * alongside the site's other global fixed-position UI. This is the
 * official Tawk.to embed snippet, used unmodified (widget/property IDs
 * are baked into the src URL by Tawk.to itself, not configured here).
 * Widget behavior — position, greeting, offline form, canned replies —
 * is configured entirely from the Tawk.to dashboard, not from this code.
 */
export function TawkChat() {
  return (
    <Script id="tawk-to-loader" strategy="afterInteractive">
      {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6a783653c010c21d4b632593/1jvip8dg7';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`}
    </Script>
  );
}
