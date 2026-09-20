import CloseOutlined from '@mui/icons-material/CloseOutlined';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useRef } from 'react';
import { useDrag } from '../../context/DragContext';
import { useWorkflow } from '../../context/WorkflowContext';
import { catalog } from '../../data/components';
import { EASE_OUT, tokens, zIndex } from '../../theme/tokens';
import { DraggableNode } from './DraggableNode';

const SAFE_TOP = 'env(safe-area-inset-top, 0px)';
const SAFE_LEFT = 'env(safe-area-inset-left, 0px)';

/**
 * Collapsible component drawer. On desktop it floats over the canvas.
 * On a phone it is a full-height drawer that steps aside while you drag,
 * so the whole canvas is visible under your finger.
 */
export function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const coarse = useMediaQuery('(pointer: coarse)');
  const { sidebarOpen, setSidebarOpen } = useWorkflow();
  const { dragging } = useDrag();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const state: 'open' | 'closed' | 'dragging' = !sidebarOpen
    ? 'closed'
    : isMobile && dragging
      ? 'dragging'
      : 'open';

  // Move focus into the drawer on open and back to the toggle on close.
  useEffect(() => {
    if (sidebarOpen && !wasOpen.current) closeRef.current?.focus({ preventScroll: true });
    if (!sidebarOpen && wasOpen.current) toggleRef.current?.focus({ preventScroll: true });
    wasOpen.current = sidebarOpen;
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !dragging) setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sidebarOpen, dragging, setSidebarOpen]);

  const panelWidth = isMobile ? 'min(86vw, 340px)' : isTablet ? 272 : 304;

  return (
    <>
      <Tooltip title="Components" placement="right">
        <IconButton
          ref={toggleRef}
          aria-label="Open components"
          aria-expanded={sidebarOpen}
          aria-controls="component-drawer"
          onClick={() => setSidebarOpen(true)}
          inert={sidebarOpen}
          sx={{
            position: 'absolute',
            top: `calc(12px + ${SAFE_TOP})`,
            left: `calc(12px + ${SAFE_LEFT})`,
            zIndex: zIndex.toggle,
            width: 44,
            height: 44,
            borderRadius: '12px',
            backgroundColor: tokens.surface,
            boxShadow: tokens.shadow.control,
            opacity: sidebarOpen ? 0 : 1,
            transition: `opacity 140ms ease, background-color 140ms ease, transform 140ms ${EASE_OUT}`,
          }}
        >
          <MenuOutlined />
        </IconButton>
      </Tooltip>

      {/* Phone only: dims the canvas behind the drawer. Tap it to close. */}
      {isMobile && (
        <Box
          aria-hidden
          onClick={() => setSidebarOpen(false)}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: zIndex.scrim,
            backgroundColor: 'rgba(20, 32, 43, 0.28)',
            opacity: state === 'open' ? 1 : 0,
            pointerEvents: state === 'open' ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        />
      )}

      <Paper
        component="aside"
        id="component-drawer"
        aria-label="Components"
        elevation={0}
        inert={state === 'closed'}
        data-no-drop
        sx={{
          position: isMobile ? 'fixed' : 'absolute',
          zIndex: zIndex.panel,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          width: panelWidth,
          boxShadow: tokens.shadow.panel,
          ...(isMobile
            ? {
                top: 0,
                bottom: 0,
                left: 0,
                borderRadius: '0 16px 16px 0',
                paddingTop: SAFE_TOP,
                paddingLeft: SAFE_LEFT,
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }
            : {
                top: 12,
                left: 12,
                maxHeight: 'calc(100% - 24px)',
                borderRadius: '16px',
              }),
          // Opening eases out and takes a beat longer. Closing is quicker.
          ...(state === 'open' && {
            transform: 'none',
            opacity: 1,
            visibility: 'visible',
            transition: `transform 260ms ${EASE_OUT}, opacity 200ms ease`,
          }),
          ...(state === 'closed' && {
            transform: 'translateX(calc(-100% - 24px))',
            opacity: 0,
            visibility: 'hidden',
            transition: `transform 200ms ${EASE_OUT}, opacity 160ms ease, visibility 0s linear 200ms`,
          }),
          ...(state === 'dragging' && {
            transform: 'translateX(-24px)',
            opacity: 0,
            visibility: 'visible',
            pointerEvents: 'none',
            transition: `transform 180ms ${EASE_OUT}, opacity 140ms ease`,
          }),
          '@media (prefers-reduced-motion: reduce)': {
            transform: 'none',
            transition: 'opacity 120ms linear',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: '14px 10px 6px 18px' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h2">
              Components
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {coarse ? 'Hold, then drag onto the canvas' : 'Drag onto the canvas'}
            </Typography>
          </Box>
          <IconButton
            ref={closeRef}
            aria-label="Close components"
            onClick={() => setSidebarOpen(false)}
            sx={{ width: 40, height: 40, borderRadius: '10px' }}
          >
            <CloseOutlined fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            p: '4px 8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {catalog.map((item) => (
            <DraggableNode key={item.type} item={item} dragging={dragging?.type === item.type} />
          ))}
        </Box>
      </Paper>
    </>
  );
}
