import DragIndicatorOutlined from '@mui/icons-material/DragIndicatorOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import type { KeyboardEvent } from 'react';
import { useDrag } from '../../context/DragContext';
import { EASE_OUT, tokens } from '../../theme/tokens';
import type { CatalogItem } from '../../types/workflow';

const Item = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '8px 10px 8px 8px',
  borderRadius: 10,
  cursor: 'grab',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
  touchAction: 'pan-y',
  transition: `background-color 140ms ease, transform 160ms ${EASE_OUT}, opacity 140ms ease`,
  '&:hover': { backgroundColor: tokens.surfaceHover },
  '&:active': { backgroundColor: tokens.surfacePressed, transform: 'scale(0.985)' },
  '&:focus-visible': { outline: `2px solid ${tokens.accent}`, outlineOffset: -2 },
  '&[data-dragging="true"]': { opacity: 0.5, backgroundColor: tokens.surfaceHover },
  '&:hover .drag-grip': { opacity: 0.9 },
});

export function DraggableNode({ item, dragging }: { item: CatalogItem; dragging: boolean }) {
  const { beginDrag, placeAtCenter } = useDrag();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      placeAtCenter(item);
    }
  };

  const color = item.color || tokens.accent;

  return (
    <Item
      role="button"
      tabIndex={0}
      aria-label={`${item.label}. ${item.description}. Drag onto the canvas, or press Enter to place it.`}
      data-dragging={dragging}
      onPointerDown={(event) => beginDrag(event, item)}
      onKeyDown={onKeyDown}
      onContextMenu={(event) => event.preventDefault()}
    >
      {/* Circle Preview with Connection Dots */}
      <Box
        sx={{
          position: 'relative',
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: tokens.surface,
          border: `2px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 2px 6px ${color}25`,
        }}
      >
        {/* Left Dot Handle */}
        <Box
          sx={{
            position: 'absolute',
            left: -5,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
            border: `2px solid ${tokens.surface}`,
          }}
        />

        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: color,
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          {item.label.charAt(0).toUpperCase()}
        </Box>

        {/* Right Dot Handle */}
        <Box
          sx={{
            position: 'absolute',
            right: -5,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
            border: `2px solid ${tokens.surface}`,
          }}
        />
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }} noWrap>
          {item.label}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }} noWrap>
          {item.description}
        </Typography>
      </Box>

      <DragIndicatorOutlined
        className="drag-grip"
        aria-hidden
        sx={{ fontSize: 20, color: tokens.inkMuted, opacity: 0.45, transition: 'opacity 140ms ease' }}
      />
    </Item>
  );
}
