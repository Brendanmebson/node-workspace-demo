import { createTheme } from '@mui/material/styles';
import { EASE_OUT, tokens } from './tokens';

const focusRing = `2px solid ${tokens.accent}`;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: tokens.accent },
    error: { main: tokens.danger },
    text: { primary: tokens.ink, secondary: tokens.inkMuted },
    background: { default: tokens.canvas, paper: tokens.surface },
    divider: tokens.hairline,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      '"Schibsted Grotesk Variable", "Schibsted Grotesk", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    h6: { fontSize: 15, fontWeight: 620, letterSpacing: '-0.01em', lineHeight: 1.3 },
    subtitle1: { fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em', lineHeight: 1.3 },
    body2: { fontSize: 12.5, lineHeight: 1.4 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': { height: '100%' },
        body: {
          overflow: 'hidden',
          overscrollBehavior: 'none',
          WebkitTapHighlightColor: 'transparent',
        },
      },
    },
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: tokens.ink,
          transition: `background-color 140ms ease, transform 140ms ${EASE_OUT}`,
          '&:hover': { backgroundColor: tokens.surfaceHover },
          '&:active': { backgroundColor: tokens.surfacePressed, transform: 'scale(0.96)' },
          '&.Mui-focusVisible': { outline: focusRing, outlineOffset: 2 },
          '&.Mui-disabled': { color: 'rgba(20,32,43,0.32)' },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { enterDelay: 400, enterNextDelay: 100, disableTouchListener: true },
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.ink,
          fontSize: 12,
          fontWeight: 500,
          padding: '5px 9px',
          borderRadius: 7,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: tokens.shadow.panel,
          marginTop: 4,
        },
        list: { padding: 6 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 38,
          fontSize: 14,
          gap: 4,
          '&.Mui-focusVisible': { backgroundColor: tokens.surfaceHover },
        },
      },
    },
    MuiListItemText: { styleOverrides: { primary: { fontSize: 14, fontWeight: 500 } } },
    MuiListItemIcon: { styleOverrides: { root: { minWidth: 30, color: 'inherit' } } },
  },
});
