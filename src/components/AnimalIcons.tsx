// Minimal silhouette icons for each species — drawn in inline SVG paths.
// Each icon renders at the size of its viewBox; consumers control display size via wrapper.

interface IconProps {
  color?: string;
  size?: number;
}

export const ChickenIcon = ({ color = 'currentColor', size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    {/* Body */}
    <path d="M 14 8 C 17 8 19 10 19 13 C 19 17 16 19 12 19 C 8 19 6 17 6 14 C 6 11 8 9 11 9 L 12 6 L 13 6 L 14 8 Z" />
    {/* Comb */}
    <path d="M 12 5.5 L 13 4 L 14 5 L 14.5 4 L 15 5 L 15 6 L 12 6 Z" />
    {/* Beak */}
    <path d="M 19 12 L 21 13 L 19 13.5 Z" />
    {/* Leg */}
    <path d="M 10 19 L 10 22 L 11 22 L 11 19 Z M 13 19 L 13 22 L 14 22 L 14 19 Z" />
    {/* Eye */}
    <circle cx="16" cy="11.5" r="0.7" fill="#0a0a0a" />
  </svg>
);

export const DuckIcon = ({ color = 'currentColor', size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    {/* Body (rounder, lower) */}
    <ellipse cx="11" cy="15" rx="7" ry="4.5" />
    {/* Neck rising up */}
    <path d="M 14 14 C 14 10 16 9 17 7 L 19 7 L 19 9 C 18 11 17 13 17 14 Z" />
    {/* Beak — flat horizontal */}
    <path d="M 19 7 L 22 7 L 22 8.5 L 19 8.5 Z" />
    {/* Eye */}
    <circle cx="17.5" cy="8" r="0.6" fill="#0a0a0a" />
    {/* Tail */}
    <path d="M 4 14 L 2 13 L 3 15 Z" />
    {/* Foot */}
    <path d="M 9 19.5 L 8 22 L 11 22 L 10 19.5 Z M 13 19.5 L 12 22 L 15 22 L 14 19.5 Z" />
  </svg>
);

export const PigIcon = ({ color = 'currentColor', size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    {/* Body */}
    <ellipse cx="12" cy="14" rx="8" ry="5.5" />
    {/* Snout */}
    <ellipse cx="19" cy="13" rx="2.5" ry="2" />
    {/* Snout nostrils */}
    <circle cx="20" cy="12.5" r="0.4" fill="#0a0a0a" />
    <circle cx="20" cy="13.5" r="0.4" fill="#0a0a0a" />
    {/* Ears */}
    <path d="M 8 9 L 6 6 L 10 8 Z" />
    <path d="M 13 9 L 11 6 L 15 8 Z" />
    {/* Eye */}
    <circle cx="15" cy="11.5" r="0.7" fill="#0a0a0a" />
    {/* Legs */}
    <rect x="7" y="18" width="1.5" height="3.5" />
    <rect x="10" y="18" width="1.5" height="3.5" />
    <rect x="13" y="18" width="1.5" height="3.5" />
    <rect x="16" y="18" width="1.5" height="3.5" />
    {/* Curly tail */}
    <path d="M 4 13 C 3 12 2 13 3 14 C 4 14 4 13 4 13 Z" />
  </svg>
);

export const CowIcon = ({ color = 'currentColor', size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    {/* Body */}
    <ellipse cx="11" cy="13" rx="8" ry="5" />
    {/* Head */}
    <ellipse cx="19" cy="11" rx="3" ry="2.5" />
    {/* Horns */}
    <path d="M 17 8.5 L 16 7 L 17 8 Z" />
    <path d="M 21 8.5 L 22 7 L 21 8 Z" />
    {/* Snout */}
    <ellipse cx="21.5" cy="12" rx="1.2" ry="1" />
    {/* Nostril */}
    <circle cx="21.5" cy="12" r="0.4" fill="#0a0a0a" />
    {/* Eye */}
    <circle cx="18" cy="10.5" r="0.6" fill="#0a0a0a" />
    {/* Ear */}
    <path d="M 16.5 9 L 15.5 8 L 16.5 9.5 Z" />
    {/* Legs */}
    <rect x="6" y="17" width="1.5" height="4" />
    <rect x="9" y="17" width="1.5" height="4" />
    <rect x="12" y="17" width="1.5" height="4" />
    <rect x="15" y="17" width="1.5" height="4" />
    {/* Tail */}
    <path d="M 3 12 L 1.5 11 L 2.5 13 Z" />
    {/* Udder */}
    <ellipse cx="11" cy="17" rx="1.5" ry="1" />
  </svg>
);

export const ICONS_BY_SPECIES_ID: Record<string, (props: IconProps) => JSX.Element> = {
  chicken: ChickenIcon,
  ducks:   DuckIcon,
  pigs:    PigIcon,
  cattle:  CowIcon,
};
