import CloseOutlined from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { useEffect, useRef, useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { EASE_OUT, tokens } from '../../theme/tokens';

const DeleteButton = styled(IconButton)({
  width: 26,
  height: 26,
  backgroundColor: tokens.surface,
  boxShadow: tokens.shadow.control,
  transition: `opacity 120ms ease, scale 160ms ${EASE_OUT}, background-color 140ms ease, color 140ms ease`,
  '&:hover': { backgroundColor: tokens.dangerSoft, color: tokens.danger },
  '@media (pointer: coarse)': { width: 34, height: 34 },
});

/** A bezier edge with a small remove button at its midpoint while hovered or selected. */
export function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) {
  const { deleteEdge } = useWorkflow();
  const [hovered, setHovered] = useState(false);
  const leaveTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  const enter = () => {
    window.clearTimeout(leaveTimer.current);
    setHovered(true);
  };
  // A short delay lets the pointer travel from the line to the button.
  const leave = () => {
    leaveTimer.current = window.setTimeout(() => setHovered(false), 140);
  };

  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const showButton = selected || hovered;

  return (
    <>
      <g onPointerEnter={enter} onPointerLeave={leave}>
        <BaseEdge
          id={id}
          path={path}
          interactionWidth={28}
          style={{
            stroke: selected ? tokens.accent : hovered ? tokens.ink : tokens.edge,
            strokeWidth: selected ? 2.25 : 1.75,
            strokeDasharray: '14 4',
            strokeLinecap: 'round',
            transition: 'stroke 140ms ease, stroke-width 140ms ease',
          }}
        />
      </g>
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: showButton ? 'all' : 'none',
          }}
          onPointerEnter={enter}
          onPointerLeave={leave}
        >
          <DeleteButton
            size="small"
            aria-label="Delete connection"
            tabIndex={showButton ? 0 : -1}
            onClick={() => deleteEdge(id)}
            sx={{ opacity: showButton ? 1 : 0, scale: showButton ? '1' : '0.9' }}
          >
            <CloseOutlined sx={{ fontSize: 15 }} />
          </DeleteButton>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
