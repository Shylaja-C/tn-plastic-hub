'use client';

import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'badge';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * TN Plastic Hub - Brand Identity SVG Logo
 * 
 * Concept:
 * 1. Circular Recycling Loop: 3 sweeping clockwise aerodynamic arcs representing circular economy and plastics reprocessing.
 * 2. Connected Hub Nodes: 3 circular connection points representing Suppliers, Recyclers, and Industrial Manufacturers.
 * 3. Subtle Tamil Nadu Motif: The central apex integrates the stepped silhouette of a Tamil Nadu Gopuram / temple tower.
 * 4. Vibrant eco-industrial color harmony: Deep Teal (#0F766E), Industrial Navy (#1E3A5F), Eco-Lime (#84CC16), and Amber Orange (#F59E0B).
 */
export function LogoIcon({ className = 'w-9 h-9', size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-label="TN Plastic Hub Logo Icon"
    >
      <defs>
        {/* Teal gradient for recycling flow */}
        <linearGradient id="tnph-teal-grad" x1="4" y1="8" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>

        {/* Lime eco accent gradient */}
        <linearGradient id="tnph-lime-grad" x1="16" y1="36" x2="44" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Warm amber node gradient */}
        <linearGradient id="tnph-amber-grad" x1="20" y1="4" x2="32" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* ── Circular Recycling Arc 1 (Top-Right to Bottom-Right) ── */}
      <path
        d="M24 6 C32.5 6 39.5 12 41.2 20.5"
        stroke="url(#tnph-teal-grad)"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <polygon points="43.5,21.5 37.5,21.5 40.5,15.5" fill="#0F766E" />

      {/* ── Circular Recycling Arc 2 (Bottom-Right to Bottom-Left) ── */}
      <path
        d="M38 31 C33.8 38 26.2 41.5 18 40.5"
        stroke="url(#tnph-lime-grad)"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <polygon points="17,43.2 16.5,37 22.8,39.5" fill="#84CC16" />

      {/* ── Circular Recycling Arc 3 (Bottom-Left to Top-Left) ── */}
      <path
        d="M10 33 C6.5 25.5 8.2 16.5 14.5 10.5"
        stroke="url(#tnph-teal-grad)"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <polygon points="16,8.2 11,12 17.5,14" fill="#14B8A6" />

      {/* ── Central Tamil Nadu Gopuram / Hub Core Geometry ── */}
      {/* Base tier */}
      <path
        d="M17 31 L31 31 L29.5 26 L18.5 26 Z"
        fill="#1E3A5F"
        opacity="0.95"
      />
      {/* Middle tier */}
      <path
        d="M19 25 L29 25 L27.8 20 L20.2 20 Z"
        fill="#0F766E"
      />
      {/* Top tower tier & Kalasam finial */}
      <path
        d="M21 19 L27 19 L25.5 15 L24 12 L22.5 15 Z"
        fill="url(#tnph-amber-grad)"
      />
      <circle cx="24" cy="10" r="1.5" fill="#F59E0B" />

      {/* ── Connected Hub Nodes (Ecosystem Integration) ── */}
      {/* Node 1: Recyclers (top right) */}
      <circle cx="34" cy="14" r="3.2" fill="#FFFFFF" stroke="#0F766E" strokeWidth="2.2" />
      <circle cx="34" cy="14" r="1.4" fill="#0F766E" />

      {/* Node 2: Industries (bottom right) */}
      <circle cx="36" cy="34" r="3.2" fill="#FFFFFF" stroke="#1E3A5F" strokeWidth="2.2" />
      <circle cx="36" cy="34" r="1.4" fill="#1E3A5F" />

      {/* Node 3: Suppliers & Waste Aggregators (left) */}
      <circle cx="12" cy="24" r="3.2" fill="#FFFFFF" stroke="#84CC16" strokeWidth="2.2" />
      <circle cx="12" cy="24" r="1.4" fill="#84CC16" />

      {/* Network connector lines connecting nodes to core */}
      <line x1="28" y1="18" x2="31" y2="15.5" stroke="#0F766E" strokeWidth="1.4" strokeDasharray="1.5 1.5" />
      <line x1="28" y1="28" x2="33" y2="32" stroke="#1E3A5F" strokeWidth="1.4" strokeDasharray="1.5 1.5" />
      <line x1="19" y1="24" x2="15.5" y2="24" stroke="#84CC16" strokeWidth="1.4" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

export function Logo({
  variant = 'full',
  theme = 'auto',
  className = '',
  size = 'md',
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 44, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 54, text: 'text-3xl', sub: 'text-sm' },
  };

  const { icon: iconSize, text: textSize, sub: subSize } = sizeMap[size];

  if (variant === 'icon') {
    return <LogoIcon size={iconSize} className={className} />;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <LogoIcon size={iconSize} />
      <div className="flex flex-col leading-none">
        <div className={`font-extrabold tracking-tight font-sans ${textSize}`}>
          <span className="text-secondary dark:text-slate-100">TN</span>
          <span className="text-primary dark:text-teal-400"> Plastic</span>
          <span className="text-amber-500 font-black"> Hub</span>
        </div>
        <span className={`font-semibold tracking-wider uppercase text-muted-foreground ${subSize} mt-0.5`}>
          Tamil Nadu Circular Network
        </span>
      </div>
    </div>
  );
}

export default Logo;
