import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ChangeEvent, ReactNode } from 'react';
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

const EditableText = styled('input')({
  width: '100%',
  border: 'none',
  background: 'transparent',
  padding: '1px 4px',
  margin: '-1px -4px',
  borderRadius: 4,
  color: tokens.ink,
  font: 'inherit',
  fontWeight: 600,
  fontSize: '0.925rem',
  outline: 'none',
  transition: 'background-color 140ms ease, box-shadow 140ms ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&:focus': {
    backgroundColor: '#ffffff',
    boxShadow: `0 0 0 1.5px ${tokens.accent}`,
  },
  '&::placeholder': { color: tokens.inkMuted },
});

const EditableTextArea = styled('textarea')({
  width: '100%',
  border: 'none',
  background: 'transparent',
  padding: '1px 4px',
  margin: '-1px -4px',
  borderRadius: 4,
  resize: 'none',
  color: tokens.ink,
  font: 'inherit',
  fontSize: '0.8rem',
  lineHeight: 1.3,
  outline: 'none',
  transition: 'background-color 140ms ease, box-shadow 140ms ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&:focus': {
    backgroundColor: '#ffffff',
    boxShadow: `0 0 0 1.5px ${tokens.accent}`,
  },
  '&::placeholder': { color: tokens.inkMuted },
});

interface NodeCardProps {
  label: string;
  description?: string;
  iconKey?: string;
  category: NodeCategory;
  selected?: boolean;
  animateIn?: boolean;
  onLabelChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
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
  onLabelChange,
  onDescriptionChange,
  children,
}: NodeCardProps) {
  const Icon = iconKey ? nodeIcons[iconKey] : undefined;

  const handleInputClick = (event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.stopPropagation();
  };

  const handleInputMouseDown = (event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.stopPropagation();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.stopPropagation();
    if (event.key === 'Escape' || (event.key === 'Enter' && !event.shiftKey)) {
      event.currentTarget.blur();
    }
  };

  const handleInputChange =
    (onChange?: (value: string) => void) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(event.target.value);
    };

  return (
    <Shell className="wf-node" data-selected={selected ? 'true' : 'false'} animateIn={animateIn}>
      <IconTile category={category}>{Icon ? <Icon /> : null}</IconTile>
      <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {onLabelChange ? (
          <EditableText
            className="nodrag nopan"
            value={label}
            aria-label="Node name"
            onChange={handleInputChange(onLabelChange)}
            onMouseDown={handleInputMouseDown}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            onPointerDown={handleInputMouseDown as never}
          />
        ) : (
          <Typography variant="subtitle1" noWrap>
            {label}
          </Typography>
        )}

        {onDescriptionChange ? (
          <EditableTextArea
            className="nodrag nopan"
            value={description ?? ''}
            rows={2}
            placeholder="Add a description"
            aria-label="Node description"
            onChange={handleInputChange(onDescriptionChange)}
            onMouseDown={handleInputMouseDown}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            onPointerDown={handleInputMouseDown as never}
          />
        ) : description ? (
          <Typography variant="body2" color="text.secondary" noWrap>
            {description}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Shell>
  );
}
