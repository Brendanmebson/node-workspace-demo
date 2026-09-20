import Box from '@mui/material/Box';
import { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDrag } from '../../context/DragContext';
import { EASE_OUT, NODE_WIDTH, tokens, zIndex } from '../../theme/tokens';
import { NodeCard } from '../nodes/NodeCard';

/**
 * The card that follows the pointer while dragging. It is the real node card,
 * scaled to the canvas zoom, so what you see is where the node will land.
 */
export function DragGhost() {
  const { dragging, ghostRef, positionGhost } = useDrag();

  useLayoutEffect(() => {
    if (dragging) positionGhost();
  }, [dragging, positionGhost]);

  if (!dragging) return null;

  return createPortal(
    <Box
      ref={ghostRef}
      aria-hidden
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: NODE_WIDTH,
        pointerEvents: 'none',
        zIndex: zIndex.ghost,
        willChange: 'transform',
        opacity: 0.5,
        transition: `opacity 140ms ${EASE_OUT}`,
        '&[data-over-canvas="true"]': { opacity: 1 },
        '& .wf-node': { boxShadow: tokens.shadow.ghost },
      }}
    >
      <NodeCard
        label={dragging.label}
        description={dragging.description}
        iconKey={dragging.icon}
        category={dragging.category}
      />
    </Box>,
    document.body,
  );
}
