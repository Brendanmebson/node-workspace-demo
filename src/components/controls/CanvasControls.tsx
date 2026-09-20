import AddOutlined from '@mui/icons-material/AddOutlined';
import FitScreenOutlined from '@mui/icons-material/FitScreenOutlined';
import RemoveOutlined from '@mui/icons-material/RemoveOutlined';
import RestartAltOutlined from '@mui/icons-material/RestartAltOutlined';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { useReactFlow } from '@xyflow/react';
import type { ReactElement } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { tokens, zIndex } from '../../theme/tokens';

const ANIMATION = { duration: 220 };

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactElement;
}) {
  return (
    <Tooltip title={label} placement="left">
      {/* The span keeps the tooltip working while the button is disabled. */}
      <span>
        <IconButton
          aria-label={label}
          onClick={onClick}
          disabled={disabled}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            '@media (pointer: coarse)': { width: 44, height: 44 },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

/** Zoom and view controls, kept small and out of the way in the bottom-right corner. */
export function CanvasControls() {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  const { nodes } = useWorkflow();

  return (
    <Paper
      elevation={0}
      data-no-drop
      sx={{
        position: 'absolute',
        right: 'calc(12px + env(safe-area-inset-right, 0px))',
        bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        zIndex: zIndex.controls,
        display: 'flex',
        flexDirection: 'column',
        padding: '4px',
        gap: '2px',
        borderRadius: '14px',
        boxShadow: tokens.shadow.control,
      }}
    >
      <ControlButton label="Zoom in" onClick={() => zoomIn(ANIMATION)}>
        <AddOutlined fontSize="small" />
      </ControlButton>
      <ControlButton label="Zoom out" onClick={() => zoomOut(ANIMATION)}>
        <RemoveOutlined fontSize="small" />
      </ControlButton>
      <Divider sx={{ mx: 0.75 }} />
      <ControlButton
        label="Fit to view"
        disabled={nodes.length === 0}
        onClick={() => fitView({ padding: 0.3, maxZoom: 1.25, ...ANIMATION })}
      >
        <FitScreenOutlined fontSize="small" />
      </ControlButton>
      <ControlButton
        label="Reset view"
        onClick={() => setViewport({ x: 0, y: 0, zoom: 1 }, ANIMATION)}
      >
        <RestartAltOutlined fontSize="small" />
      </ControlButton>
    </Paper>
  );
}
