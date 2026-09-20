import type { NodeTypes } from '@xyflow/react';
import { catalog } from '../../data/components';
import { WorkflowNode } from './WorkflowNode';

/** Every catalog type renders through the same card. Add a type in data/components.ts and it works. */
export const nodeTypes: NodeTypes = Object.fromEntries(
  catalog.map((item) => [item.type, WorkflowNode]),
);
