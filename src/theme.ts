// Hyperland-inspired theme: dark, tiling, monospace, neon accents, sharp edges.
export const theme = {
  bg: '#0a0a0f',
  panel: '#0f0f18',
  border: '#1f1f2e',
  fg: '#c9d1d9',
  dim: '#6b7280',
  accent: '#00ffd5', // cyan
  magenta: '#ff2bd6',
  gold: '#ffd600',
  danger: '#ff3355',
  font: 'monospace',
} as const;

export type Theme = typeof theme;
