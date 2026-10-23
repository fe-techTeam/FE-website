import Image from "next/image";
import type { MediaSlot } from "@/content/about";
import { mediaLucideIcons, type MediaLucideName } from "@/lib/mediaIcons";

type Tone = "light" | "dark" | "accent";

function isSvg(src: string) {
  return src.toLowerCase().endsWith(".svg");
}

function initialsFrom(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function resolveLucide(name: string | undefined) {
  if (!name) return null;
  if (name in mediaLucideIcons) {
    return mediaLucideIcons[name as MediaLucideName];
  }
  return null;
}

export function ImageSlot({
  asset,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  asset: MediaSlot;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const grayscale = asset.grayscale ?? false;
  const fit = asset.fit === "contain" ? "object-contain" : "object-cover";

  if (asset.src) {
    return (
      <div className={`relative overflow-hidden bg-mist ${className}`}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={isSvg(asset.src)}
          className={`${fit} ${grayscale ? "grayscale" : ""}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden border border-dashed border-line/80 bg-mist text-center ${className}`}
      role="img"
      aria-label={`${asset.alt || asset.label} (placeholder)`}
    >
      <span className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">Image</span>
      <span className="mt-1.5 max-w-[12rem] px-3 text-xs leading-snug text-muted">{asset.label}</span>
    </div>
  );
}

export function PortraitSlot({
  asset,
  name,
  className = "",
  sizes = "(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw",
}: {
  asset: MediaSlot;
  name: string;
  className?: string;
  sizes?: string;
}) {
  const grayscale = asset.grayscale ?? true;

  if (asset.src) {
    return (
      <div className={`relative overflow-hidden bg-[#161616] ${className}`}>
        <Image
          src={asset.src}
          alt={asset.alt ?? name}
          fill
          sizes={sizes}
          className={`object-cover object-top ${grayscale ? "grayscale" : ""}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden border border-dashed border-white/20 bg-[#161616] text-center ${className}`}
      role="img"
      aria-label={`${name} portrait (placeholder)`}
    >
      <span className="font-display text-4xl tracking-wide text-white/25 sm:text-5xl">{initialsFrom(name)}</span>
      <span className="mt-2 text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase">Photo</span>
    </div>
  );
}

export function IconSlot({
  asset,
  className = "",
  tone = "light",
  size = 40,
}: {
  asset: MediaSlot;
  className?: string;
  tone?: Tone;
  /** Intrinsic / fallback pixel size. Prefer Tailwind size classes in `className` for responsive layout. */
  size?: number;
}) {
  const sizedByClass = Boolean(className && /\b(h-|w-|size-)/.test(className));
  const boxStyle = sizedByClass ? undefined : { width: size, height: size };

  if (asset.src) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center ${className}`}
        style={boxStyle}
      >
        <Image
          src={asset.src}
          alt={asset.alt}
          aria-hidden={!asset.alt}
          width={size}
          height={size}
          unoptimized
          className="h-full w-full max-h-full max-w-full object-contain"
        />
      </span>
    );
  }

  const Lucide = resolveLucide(asset.icon);
  if (Lucide) {
    const toneClass =
      tone === "dark" || tone === "accent" ? "text-red" : "text-ink";
    const lucideSize = sizedByClass ? undefined : Math.round(size * 0.72);
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center ${toneClass} ${className}`}
        style={boxStyle}
        aria-hidden
      >
        <Lucide
          size={lucideSize ?? Math.round(size * 0.72)}
          strokeWidth={2}
          className={sizedByClass ? "h-[72%] w-[72%]" : undefined}
        />
      </span>
    );
  }

  const frame =
    tone === "dark"
      ? "border-red/55 text-red"
      : tone === "accent"
        ? "border-red/50 text-red"
        : "border-line text-muted";

  return (
    <span
      className={`inline-grid place-items-center border border-dashed ${frame} ${className}`}
      style={boxStyle}
      title={`${asset.label} icon`}
      aria-hidden
    >
      <svg width={Math.round(size * 0.42)} height={Math.round(size * 0.42)} viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
