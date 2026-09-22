import type { NodeTypes } from '@xyflow/react';
import { catalog } from '../../data/components';
import { CircleNode } from './CircleNode';

/** Every node in our canvas renders as a CircleNode with dots. */
export const nodeTypes: NodeTypes = {
  circleNode: CircleNode,
  ...Object.fromEntries(catalog.map((item) => [item.type, CircleNode])),
};

