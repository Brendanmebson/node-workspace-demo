import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDrag } from '../../context/DragContext';
import { EASE_OUT, tokens, zIndex } from '../../theme/tokens';


/**
 * The circle ghost that follows the pointer while dragging.
 */
export function DragGhost() {
  const { dragging, ghostRef, positionGhost } = useDrag();

  useLayoutEffect(() => {
    if (dragging) positionGhost();
  }, [dragging, positionGhost]);

  if (!dragging) return null;

  const color = dragging.color || tokens.accent;
  const bgGradient = dragging.bgGradient || `linear-gradient(135deg, ${tokens.surface} 0%, #F5F7FA 100%)`;

  return createPortal(
    <Box
      ref={ghostRef}
      aria-hidden
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 110,
        height: 110,
        pointerEvents: 'none',
        zIndex: zIndex.ghost,
        willChange: 'transform',
        opacity: 0.7,
        transition: `opacity 140ms ${EASE_OUT}`,
        '&[data-over-canvas="true"]': { opacity: 1 },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: bgGradient,
          boxShadow: tokens.shadow.ghost,
          border: `2px solid ${color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Left Dot Preview */}
        <Box
          sx={{
            position: 'absolute',
            left: -8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: color,
            border: `3px solid ${tokens.surface}`,
            boxShadow: `0 2px 4px rgba(0,0,0,0.15)`,
          }}
        />

        {/* Inner Circle Label */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: color,
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: `0 4px 10px ${color}40`,
            mb: 0.5,
          }}
        >
          {dragging.label ? dragging.label.charAt(0).toUpperCase() : 'C'}
        </Box>

        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem',
            color: tokens.ink,
            textAlign: 'center',
            px: 1,
            lineHeight: 1.1,
          }}
        >
          {dragging.label}
        </Typography>

        {/* Right Dot Preview */}
        <Box
          sx={{
            position: 'absolute',
            right: -8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: color,
            border: `3px solid ${tokens.surface}`,
            boxShadow: `0 2px 4px rgba(0,0,0,0.15)`,
          }}
        />
      </Box>
    </Box>,
    document.body,
  );
}

