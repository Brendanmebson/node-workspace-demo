import {
  Handle,
  Position,
  useNodeConnections,
  type NodeProps,
} from '@xyflow/react';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { memo, useState, type MouseEvent } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { catalogByType } from '../../data/components';
import { EASE_OUT, tokens } from '../../theme/tokens';
import type { WorkflowNode as WorkflowNodeType } from '../../types/workflow';
import { NodeCard } from './NodeCard';

/**
 * A connection port. Hollow when free, filled once something is attached.
 * The ::after pseudo-element widens the touch target without changing the look.
 */
const Port = styled(Handle)({
  width: 14,
  height: 14,
  border: `2px solid ${tokens.ink}`,
  borderRadius: '50%',
  backgroundColor: tokens.surface,
  transition: `scale 140ms ${EASE_OUT}, background-color 140ms ease, border-color 140ms ease`,
  '&::after': { content: '""', position: 'absolute', inset: -12, borderRadius: '50%' },
  '@media (pointer: coarse)': {
    '&::after': { inset: -16 }, // 46px touch target area for fingers on mobile
  },
  '&[data-connected="true"]': { backgroundColor: tokens.ink },
  '&:hover, &.connectingto.valid': {
    scale: '1.3',
    borderColor: tokens.accent,
    backgroundColor: tokens.accent,
  },
  '&.connectingfrom': { borderColor: tokens.accent, backgroundColor: tokens.accent },
});

const MenuButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  right: 8,
  marginTop: -16,
  width: 32,
  height: 32,
  opacity: 0,
  transition: `opacity 140ms ease, background-color 140ms ease`,
  '.wf-node:hover &, .wf-node:focus-within &, .wf-node[data-selected="true"] &, &[aria-expanded="true"]':
    { opacity: 1 },
  // No hover on touch screens, so keep the button visible and enlarge touch target.
  '@media (hover: none)': { opacity: 1 },
  '@media (pointer: coarse)': {
    opacity: 1,
    width: 36,
    height: 36,
    marginTop: -18,
    right: 4,
  },
});

function WorkflowNodeView({ id, type, data, selected }: NodeProps<WorkflowNodeType>) {
  const { duplicateNode, deleteNode, updateNodeData } = useWorkflow();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const hasInput = useNodeConnections({ handleType: 'target' }).length > 0;
  const hasOutput = useNodeConnections({ handleType: 'source' }).length > 0;

  const category = catalogByType[type ?? '']?.category ?? 'action';

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchor(event.currentTarget);
  };
  const closeMenu = () => setAnchor(null);

  return (
    <NodeCard
      label={data.label}
      description={data.description}
      iconKey={data.icon}
      category={category}
      selected={selected}
      animateIn
      onLabelChange={(label) => updateNodeData(id, { label })}
      onDescriptionChange={(description) => updateNodeData(id, { description })}
    >
      <Port type="target" position={Position.Left} data-connected={hasInput} />
      <Port type="source" position={Position.Right} data-connected={hasOutput} />

      <MenuButton
        className="nodrag nopan"
        size="small"
        aria-label={`${data.label} options`}
        aria-haspopup="menu"
        aria-expanded={anchor ? 'true' : undefined}
        onClick={openMenu}
      >
        <MoreVertOutlined fontSize="small" />
      </MenuButton>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={closeMenu}
        // React portals bubble clicks to the node, which would re-select it.
        onClick={(event) => event.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { className: 'nodrag nopan' } }}
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            duplicateNode(id);
          }}
        >
          <ListItemIcon>
            <ContentCopyOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            deleteNode(id);
          }}
          sx={{ color: tokens.danger }}
        >
          <ListItemIcon>
            <DeleteOutlineOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </NodeCard>
  );
}

export const WorkflowNode = memo(WorkflowNodeView);
