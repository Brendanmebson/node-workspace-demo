# Workflow canvas

A visual node workspace. Open the drawer, drag components onto the canvas, and connect them with the ports on each card.

Built with React 19, TypeScript, Vite, Material UI and React Flow (`@xyflow/react`). No Tailwind.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```

## What you can do

- Open the drawer with the menu button (top left). It slides over the canvas and closes with the X, Escape, or a tap on the dimmed area on phones.
- Drag any component out of the drawer and release it on the canvas. The node lands centered under the pointer. The same component can be dragged out as many times as you like.
- Drag from a port on one card to a port on another to connect them. Connections follow the nodes when you move them.
- Click a connection to select it, then use the small button on its midpoint or press Delete.
- Use the ⋮ button on a node to duplicate or delete it. Delete and Backspace also remove the selected node, and Ctrl/Cmd + D duplicates it.
- Pan by dragging the background. Zoom with the wheel, a pinch, or the controls at the bottom right.

Ports are hollow when free and filled once something is attached.

## Touch screens

HTML5 drag and drop does not fire on touch devices, so the drawer uses pointer events instead. On a phone, press and hold a component for a moment, then drag. A quick vertical swipe still scrolls the list. While you drag, the drawer steps aside so the whole canvas is visible under your finger, and it stays closed after the drop.

Focusing a component with the keyboard and pressing Enter places it near the middle of the canvas.

## Structure

```
src/
├── components/
│   ├── Sidebar/           Sidebar, DraggableNode, DragGhost
│   ├── WorkflowCanvas/    WorkflowCanvas, EmptyState
│   ├── nodes/             NodeCard, WorkflowNode, nodeTypes
│   ├── edges/             DeletableEdge
│   └── controls/          CanvasControls
├── context/
│   ├── WorkflowContext    nodes, edges, sidebarOpen, selectedNode, add/duplicate/delete
│   └── DragContext        sidebar-to-canvas drag (pointer events, ghost, drop)
├── data/components.ts     the catalog of draggable node types
├── theme/                 design tokens and the MUI theme
├── types/workflow.ts
├── App.tsx
└── main.tsx
```

To add a node type, add one entry to `catalog` in `src/data/components.ts`. The sidebar item, the node type registration and the icon follow from it.

## How the drag works

`DragContext` listens for pointer events on `window` once a drag starts. The ghost card is positioned through a ref, so moving it does not re-render React. On release it checks whether the pointer is over the canvas, converts the screen position with `screenToFlowPosition`, and offsets by half the node size so the node's center sits on the drop point. Releasing anywhere else cancels the drag.

Nodes have a fixed size (`NODE_WIDTH` and `NODE_HEIGHT` in `theme/tokens.ts`). That is what makes the drop position exact.

## Design notes

- The canvas is the product. There is no header or dashboard chrome. The only fixed elements are the menu button and the zoom controls.
- One typeface, Schibsted Grotesk, self-hosted through Fontsource.
- Neutral canvas, white cards, and one accent (a green-teal) for selection, live connections and the Trigger tile. Node types get a muted tint on the icon tile only.
- Depth comes from stacked translucent shadows instead of solid borders.
- Motion answers an action: the drawer slides, a dropped node settles in, ports grow when a connection can land on them. It all uses one ease-out curve, stays under 300 ms, and turns off with `prefers-reduced-motion`.
- Touch targets grow to 44 px on coarse pointers.

## Notes

- State lives in memory. Reloading clears the canvas.
- There is no undo or persistence. Neither was in the brief.
# node-workspace
