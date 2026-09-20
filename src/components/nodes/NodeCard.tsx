import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { nodeIcons } from '../../data/components';
import { categoryTint, EASE_OUT, NODE_HEIGHT, NODE_WIDTH, tokens } from '../../theme/tokens';
import type { NodeCategory } from '../../types/workflow';

export const IconTile = styled('div', {
  shouldForwardProp: (prop) => prop !== 'category' && prop !== 'size',
})<{ category: NodeCategory; size?: number }>(({ category, size = 40 }) => ({
  flex: 'none',
  width: size,
  height: size,
  display: 'grid',
  placeItems: 'center',
  borderRadius: 9,
  color: categoryTint[category].fg,
  backgroundColor: categoryTint[category].bg,
  '& svg': { fontSize: size * 0.55 },
}));

const Shell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'animateIn',
})<{ animateIn?: boolean }>(({ animateIn }) => ({
  position: 'relative',
  boxSizing: 'border-box',
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  padding: '0 40px 0 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderRadius: 12,
  backgroundColor: tokens.surface,
  boxShadow: tokens.shadow.node,
  transition: `box-shadow 160ms ${EASE_OUT}`,
  userSelect: 'none',
  '&:hover': { boxShadow: tokens.shadow.nodeHover },
  '&[data-selected="true"]': { boxShadow: tokens.shadow.nodeSelected },
  ...(animateIn && {
    animation: `wf-node-in 200ms ${EASE_OUT} both`,
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  }),
}));

interface NodeCardProps {
  label: string;
  description?: string;
  iconKey?: string;
  category: NodeCategory;
  selected?: boolean;
  animateIn?: boolean;
  /** Handles and the options button. */
  children?: ReactNode;
}

/** Visual body shared by canvas nodes and the drag ghost, so they always match. */
export function NodeCard({
  label,
  description,
  iconKey,
  category,
  selected,
  animateIn,
  children,
}: NodeCardProps) {
  const Icon = iconKey ? nodeIcons[iconKey] : undefined;
  return (
    <Shell className="wf-node" data-selected={selected ? 'true' : 'false'} animateIn={animateIn}>
      <IconTile category={category}>{Icon ? <Icon /> : null}</IconTile>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {label}
        </Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary" noWrap>
            {description}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Shell>
  );
}
