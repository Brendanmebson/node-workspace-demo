import type { Edge, Node } from '@xyflow/react';

/** Groups node types by what they do. Drives the icon tile tint. */
export type NodeCategory = 'start' | 'action' | 'data' | 'logic';

export type WorkflowNodeData = {
  label: string;
  description?: string;
  /** Key into `nodeIcons` (see data/components.ts). */
  icon?: string;
  color?: string;
  bgGradient?: string;
};

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

/** One entry in the sidebar. Dragging it onto the canvas creates a node of `type`. */
export interface CatalogItem {
  type: string;
  label: string;
  description: string;
  category: NodeCategory;
  icon: string;
  color?: string;
  bgGradient?: string;
}

