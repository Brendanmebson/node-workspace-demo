import Box from '@mui/material/Box';
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeTypes,
} from '@xyflow/react';
import { useEffect } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { tokens } from '../../theme/tokens';
import { DeletableEdge } from '../edges/DeletableEdge';
import { nodeTypes } from '../nodes/nodeTypes';
import { EmptyState } from './EmptyState';

const edgeTypes: EdgeTypes = { deletable: DeletableEdge };
const defaultEdgeOptions = { type: 'deletable' };
const deleteKeys = ['Backspace', 'Delete'];

// A node cannot connect to itself.
const isValidConnection = (connection: Edge | Connection) => connection.source !== connection.target;

/** The workspace. Everything else floats above it. */
export function WorkflowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, selectedNode, duplicateNode } =
    useWorkflow();

  // Ctrl/Cmd + D duplicates the selected node.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'd') return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"]')) return;
      if (!selectedNode) return;
      event.preventDefault();
      duplicateNode(selectedNode.id);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedNode, duplicateNode]);

  return (
    <Box data-canvas-drop sx={{ position: 'absolute', inset: 0 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        isValidConnection={isValidConnection}
        deleteKeyCode={deleteKeys}
        connectionRadius={32}
        minZoom={0.25}
        maxZoom={2}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        style={{ backgroundColor: tokens.canvas }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.6} color={tokens.canvasDot} />
      </ReactFlow>
      <EmptyState visible={nodes.length === 0} />
    </Box>
  );
}
