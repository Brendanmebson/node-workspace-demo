import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Handle, Position, useNodeConnections, type NodeProps } from '@xyflow/react';
import { memo, useState, type MouseEvent } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { EASE_OUT, tokens } from '../../theme/tokens';
import type { WorkflowNode as WorkflowNodeType } from '../../types/workflow';

/** Prominent connection dot port. */
const DotPort = styled(Handle)<{ dotcolor?: string }>(({ dotcolor = tokens.accent }) => ({
  width: 16,
  height: 16,
  borderRadius: '50%',
  border: `3px solid ${tokens.surface}`,
  backgroundColor: dotcolor,
  boxShadow: `0 0 0 1px ${tokens.hairline}, 0 2px 4px rgba(0,0,0,0.15)`,
  zIndex: 10,
  transition: `transform 160ms ${EASE_OUT}, background-color 160ms ease, box-shadow 160ms ease`,
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: -10,
    borderRadius: '50%',
  },
  '&[data-connected="true"]': {
    backgroundColor: tokens.ink,
    borderColor: tokens.surface,
  },
  '&:hover, &.connectingto.valid, &.connectingfrom': {
    transform: 'scale(1.4)',
    backgroundColor: '#FF6B6B',
    boxShadow: `0 0 0 2px #FF6B6B, 0 4px 8px rgba(255,107,107,0.4)`,
  },
}));

function CircleNodeView({ id, data, selected }: NodeProps<WorkflowNodeType>) {
  const { duplicateNode, deleteNode } = useWorkflow();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const leftConnected = useNodeConnections({ handleType: 'target', handleId: 'left' }).length > 0;
  const rightConnected = useNodeConnections({ handleType: 'source', handleId: 'right' }).length > 0;

  const color = data.color || tokens.accent;
  const bgGradient = data.bgGradient || `linear-gradient(135deg, ${tokens.surface} 0%, #F5F7FA 100%)`;

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchor(event.currentTarget);
  };
  const closeMenu = () => setAnchor(null);

  return (
    <Box
      className="wf-node"
      data-selected={selected}
      sx={{
        position: 'relative',
        width: 110,
        height: 110,
        borderRadius: '50%',
        background: bgGradient,
        boxShadow: selected ? tokens.shadow.nodeSelected : tokens.shadow.node,
        border: `2px solid ${selected ? color : tokens.hairline}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        transition: `all 180ms ${EASE_OUT}`,
        '&:hover': {
          boxShadow: tokens.shadow.nodeHover,
          transform: 'translateY(-2px)',
          borderColor: color,
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      {/* Left Dot Handle */}
      <DotPort
        id="left"
        type="target"
        position={Position.Left}
        dotcolor={color}
        data-connected={leftConnected}
        style={{ left: -8 }}
      />

      {/* Circle Content */}
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
        {data.label ? data.label.charAt(0).toUpperCase() : 'C'}
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
          maxWidth: 90,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {data.label || 'Circle'}
      </Typography>

      {/* Right Dot Handle */}
      <DotPort
        id="right"
        type="source"
        position={Position.Right}
        dotcolor={color}
        data-connected={rightConnected}
        style={{ right: -8 }}
      />

      {/* Context Menu Button on selection or hover */}
      <IconButton
        className="nodrag nopan"
        size="small"
        aria-label="Node options"
        onClick={openMenu}
        sx={{
          position: 'absolute',
          top: -6,
          right: -6,
          width: 26,
          height: 26,
          backgroundColor: tokens.surface,
          boxShadow: tokens.shadow.control,
          border: `1px solid ${tokens.hairline}`,
          opacity: selected ? 1 : 0,
          transition: 'opacity 140ms ease',
          '.wf-node:hover &': { opacity: 1 },
          '&:hover': { backgroundColor: tokens.surfaceHover },
        }}
      >
        <MoreVertOutlined sx={{ fontSize: 16 }} />
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={closeMenu}
        onClick={(event) => event.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
    </Box>
  );
}

export const CircleNode = memo(CircleNodeView);
