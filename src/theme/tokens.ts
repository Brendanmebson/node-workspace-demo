import type { NodeCategory } from '../types/workflow';

/** Node footprint in flow coordinates. Fixed so a drop lands exactly under the cursor. */
export const NODE_WIDTH = 256;
export const NODE_HEIGHT = 72;

/** Strong ease-out. Things that respond to the user should start fast. */
export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

export const tokens = {
  ink: '#14202B',
  inkMuted: '#55626F',
  canvas: '#ECEEF0',
  canvasDot: '#A9B3BD',
  surface: '#FFFFFF',
  surfaceHover: '#F2F4F5',
  surfacePressed: '#E9ECEE',
  accent: '#0B7A67',
  accentSoft: '#DCF1EB',
  danger: '#B42318',
  dangerSoft: '#FCEBE8',
  edge: '#66727F',
  hairline: 'rgba(20, 32, 43, 0.10)',
  // Depth comes from stacked translucent shadows, not solid borders.
  shadow: {
    node: '0 0 0 1px rgba(20,32,43,0.09), 0 1px 2px rgba(20,32,43,0.06), 0 6px 14px -8px rgba(20,32,43,0.18)',
    nodeHover:
      '0 0 0 1px rgba(20,32,43,0.16), 0 1px 2px rgba(20,32,43,0.08), 0 10px 20px -10px rgba(20,32,43,0.24)',
    nodeSelected:
      '0 0 0 2px #0B7A67, 0 1px 2px rgba(20,32,43,0.08), 0 12px 22px -10px rgba(11,122,103,0.38)',
    ghost:
      '0 0 0 1px rgba(20,32,43,0.14), 0 2px 4px rgba(20,32,43,0.08), 0 22px 34px -12px rgba(20,32,43,0.36)',
    panel:
      '0 0 0 1px rgba(20,32,43,0.08), 0 2px 4px rgba(20,32,43,0.04), 0 20px 44px -14px rgba(20,32,43,0.26)',
    control:
      '0 0 0 1px rgba(20,32,43,0.08), 0 1px 2px rgba(20,32,43,0.05), 0 8px 18px -10px rgba(20,32,43,0.2)',
  },
} as const;

/** Muted tints. Icon tiles are the only place node types pick up colour. */
export const categoryTint: Record<NodeCategory, { fg: string; bg: string }> = {
  start: { fg: '#0B7A67', bg: '#DCF1EB' },
  action: { fg: '#2F5D9E', bg: '#E0E9F6' },
  data: { fg: '#6A4C93', bg: '#EBE5F4' },
  logic: { fg: '#8F5A08', bg: '#F6EAD2' },
};

export const zIndex = {
  controls: 10,
  toggle: 20,
  scrim: 30,
  panel: 40,
  ghost: 1500,
} as const;
