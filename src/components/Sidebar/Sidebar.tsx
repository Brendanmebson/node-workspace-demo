import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDrag } from '../../context/DragContext';
import { catalog } from '../../data/components';
import { EASE_OUT, tokens, zIndex } from '../../theme/tokens';
import { DraggableNode } from './DraggableNode';

const SAFE_TOP = 'env(safe-area-inset-top, 0px)';
const SAFE_LEFT = 'env(safe-area-inset-left, 0px)';

/**
 * Permanently open component sidebar. Floating on desktop canvas,
 * responsive on mobile devices.
 */
export function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const coarse = useMediaQuery('(pointer: coarse)');
  const { dragging } = useDrag();

  const state: 'open' | 'dragging' = isMobile && dragging ? 'dragging' : 'open';
  const panelWidth = isMobile ? 'min(86vw, 340px)' : isTablet ? 272 : 304;

  return (
    <Paper
      component="aside"
      id="component-drawer"
      aria-label="Components"
      elevation={0}
      data-no-drop
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        height: '100%',
        zIndex: zIndex.panel,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: panelWidth,
        borderRadius: 0,
        borderRight: `1px solid ${tokens.hairline}`,
        boxShadow: tokens.shadow.panel,
        paddingTop: isMobile ? SAFE_TOP : '12px',
        paddingLeft: isMobile ? SAFE_LEFT : 0,
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 0px)' : '12px',
        ...(state === 'open' && {
          transform: 'none',
          opacity: 1,
          visibility: 'visible',
          transition: `transform 260ms ${EASE_OUT}, opacity 200ms ease`,
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
      <Box sx={{ p: '16px 18px 10px 18px' }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          Components
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {coarse ? 'Hold, then drag onto the canvas' : 'Drag onto the canvas'}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          p: '4px 8px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {catalog.map((item) => (
          <DraggableNode key={item.type} item={item} dragging={dragging?.type === item.type} />
        ))}
      </Box>
    </Paper>
  );
}
