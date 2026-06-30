import Image from "next/image";

interface LogoProps {
  size?: number;
  /** arrondi (le logo docteur est carré) */
  rounded?: boolean;
}

/**
 * Logo de marque « Jean » - le docteur en PNG (public/logo.png).
 */
export default function Logo({ size = 30, rounded = true }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Jean"
      width={size}
      height={size}
      priority
      className={rounded ? "rounded-full object-cover" : "object-contain"}
      style={{ width: size, height: size }}
    />
  );
}
