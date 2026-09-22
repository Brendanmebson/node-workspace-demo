import {
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type OnEdgesChange,
  type OnNodesChange,
  type XYPosition,
} from '@xyflow/react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { catalogByType } from '../data/components';
import type { WorkflowEdge, WorkflowNode, WorkflowNodeData } from '../types/workflow';

interface WorkflowContextValue {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: OnNodesChange<WorkflowNode>;
  onEdgesChange: OnEdgesChange<WorkflowEdge>;
  onConnect: (connection: Connection) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedNode: WorkflowNode | null;
  addNode: (type: string, position: XYPosition) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  duplicateNode: (id: string) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

const DUPLICATE_OFFSET = 32;

function createId(type: string) {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${type}-${random}`;
}

const initialNodes: WorkflowNode[] = [
  {
    id: 'circle-1-initial',
    type: 'circle-1',
    position: { x: 250, y: 200 },
    data: {
      label: 'Circle 1',
      description: 'Circular node with connecting dots',
      color: '#0B7A67',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #E6F4F1 100%)',
    },
  },
  {
    id: 'circle-2-initial',
    type: 'circle-2',
    position: { x: 550, y: 200 },
    data: {
      label: 'Circle 2',
      description: 'Circular node with connecting dots',
      color: '#4F46E5',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%)',
    },
  },
];

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedNode = useMemo(() => nodes.find((n) => n.selected) ?? null, [nodes]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((current) => addEdge({ ...connection, type: 'deletable', animated: true }, current)),
    [setEdges],
  );

  const addNode = useCallback(
    (type: string, position: XYPosition) => {
      const item = catalogByType[type];
      if (!item) return;
      const node: WorkflowNode = {
        id: createId(type),
        type,
        position,
        selected: true,
        data: {
          label: item.label,
          description: item.description,
          icon: item.icon,
          color: item.color,
          bgGradient: item.bgGradient,
        },
      };
      setNodes((current) => [...current.map((n) => (n.selected ? { ...n, selected: false } : n)), node]);
    },
    [setNodes],
  );


  const updateNodeData = useCallback(
    (id: string, data: Partial<WorkflowNodeData>) => {
      setNodes((current) =>
        current.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              }
            : node,
        ),
      );
    },
    [setNodes],
  );

  const duplicateNode = useCallback(
    (id: string) => {
      setNodes((current) => {
        const source = current.find((n) => n.id === id);
        if (!source) return current;
        const copy: WorkflowNode = {
          id: createId(source.type ?? 'node'),
          type: source.type,
          position: {
            x: source.position.x + DUPLICATE_OFFSET,
            y: source.position.y + DUPLICATE_OFFSET,
          },
          selected: true,
          data: { ...source.data },
        };
        return [...current.map((n) => (n.selected ? { ...n, selected: false } : n)), copy];
      });
    },
    [setNodes],
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((current) => current.filter((n) => n.id !== id));
      setEdges((current) => current.filter((e) => e.source !== id && e.target !== id));
    },
    [setNodes, setEdges],
  );

  const deleteEdge = useCallback(
    (id: string) => setEdges((current) => current.filter((e) => e.id !== id)),
    [setEdges],
  );

  const value = useMemo<WorkflowContextValue>(
    () => ({
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      sidebarOpen,
      setSidebarOpen,
      selectedNode,
      addNode,
      updateNodeData,
      duplicateNode,
      deleteNode,
      deleteEdge,
    }),
    [
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      sidebarOpen,
      selectedNode,
      addNode,
      updateNodeData,
      duplicateNode,
      deleteNode,
      deleteEdge,
    ],
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used inside <WorkflowProvider>');
  return ctx;
}
