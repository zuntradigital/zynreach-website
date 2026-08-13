/**
 * lucide-react no longer ships trademarked brand glyphs, so social icons
 * are defined locally as minimal single-path SVGs sized to match the
 * 24px / 1.5–2px stroke icon set used elsewhere (SRS Section 10).
 */
type IconProps = React.SVGAttributes<SVGSVGElement>;

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05C19.5 8 21 10.24 21 14.09V23h-4v-8.1c0-1.93-.03-4.42-2.7-4.42-2.7 0-3.11 2.11-3.11 4.28V23h-4V8z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7.1l4.9 6.1L18.9 2zm-1.2 18h1.7L6.4 4h-1.8l13.1 16z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.78-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.5 1.34 5.02L2 22l5.13-1.32A9.97 9.97 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.31a8.29 8.29 0 0 1-4.23-1.16l-.3-.18-3.15.81.84-3.06-.2-.32A8.29 8.29 0 0 1 3.69 12c0-4.58 3.73-8.31 8.31-8.31s8.31 3.73 8.31 8.31-3.73 8.31-8.31 8.31z" />
    </svg>
  );
}
