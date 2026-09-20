import DragIndicatorOutlined from '@mui/icons-material/DragIndicatorOutlined';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { KeyboardEvent } from 'react';
import { useDrag } from '../../context/DragContext';
import { nodeIcons } from '../../data/components';
import { EASE_OUT, tokens } from '../../theme/tokens';
import type { CatalogItem } from '../../types/workflow';
import { IconTile } from '../nodes/NodeCard';

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
  // Vertical swipes still scroll the list. A touch drag starts after a short hold.
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

  // Keyboard alternative to dragging, so the list stays usable without a pointer.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      placeAtCenter(item);
    }
  };

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
      <IconTile category={item.category} size={38} aria-hidden>
        <IconFor iconKey={item.icon} />
      </IconTile>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {item.label}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
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


function IconFor({ iconKey }: { iconKey: string }) {
  const Icon = nodeIcons[iconKey];
  return Icon ? <Icon /> : null;
}
