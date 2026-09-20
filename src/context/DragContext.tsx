import { useReactFlow } from '@xyflow/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type ReactNode,
} from 'react';
import { NODE_HEIGHT, NODE_WIDTH } from '../theme/tokens';
import type { CatalogItem } from '../types/workflow';
import { useWorkflow } from './WorkflowContext';

/** Mouse: start dragging after this many px. */
const MOUSE_THRESHOLD = 4;
/** Touch: hold this long before a drag starts, so the list can still scroll. */
const TOUCH_HOLD_MS = 220;
/** Touch: moving further than this before the hold ends means the user is scrolling. */
const TOUCH_SLOP = 10;

interface DragContextValue {
  /** The item currently being dragged, or null. */
  dragging: CatalogItem | null;
  beginDrag: (event: ReactPointerEvent<HTMLElement>, item: CatalogItem) => void;
  /** Keyboard path: place a node near the middle of the canvas. */
  placeAtCenter: (item: CatalogItem) => void;
  ghostRef: RefObject<HTMLDivElement | null>;
  /** Apply the latest pointer position to the ghost element without re-rendering. */
  positionGhost: () => void;
}

const DragContext = createContext<DragContextValue | null>(null);

function isOverCanvas(x: number, y: number) {
  return !!document.elementFromPoint(x, y)?.closest('[data-canvas-drop]');
}

/**
 * Pointer-based drag from the sidebar to the canvas.
 *
 * HTML5 drag and drop does not fire on touch screens, so this uses pointer
 * events for mouse, pen and touch alike. The ghost follows the pointer through
 * a ref, so moving it never re-renders React.
 */
export function DragProvider({ children }: { children: ReactNode }) {
  const { screenToFlowPosition, getZoom } = useReactFlow();
  const { addNode, nodes, setSidebarOpen } = useWorkflow();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [dragging, setDragging] = useState<CatalogItem | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const cancelRef = useRef<(() => void) | null>(null);

  // Latest values for handlers that outlive a render.
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;
  const nodeCountRef = useRef(nodes.length);
  nodeCountRef.current = nodes.length;

  const positionGhost = useCallback(() => {
    const el = ghostRef.current;
    if (!el) return;
    const { x, y } = pointerRef.current;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${zoomRef.current})`;
    // Dim the ghost over anything that is not the canvas: releasing there cancels.
    el.setAttribute('data-over-canvas', String(isOverCanvas(x, y)));
  }, []);

  const drop = useCallback(
    (item: CatalogItem, x: number, y: number) => {
      const flow = screenToFlowPosition({ x, y });
      addNode(item.type, { x: flow.x - NODE_WIDTH / 2, y: flow.y - NODE_HEIGHT / 2 });
      // On a phone the drawer covers the canvas, so return to the workspace.
      if (isMobileRef.current) setSidebarOpen(false);
    },
    [addNode, screenToFlowPosition, setSidebarOpen],
  );

  const beginDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>, item: CatalogItem) => {
      if (cancelRef.current) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      const { pointerId } = event;
      const isTouch = event.pointerType !== 'mouse';
      const target = event.currentTarget;
      const origin = { x: event.clientX, y: event.clientY };
      const latest = { ...origin };
      let active = false;
      let holdTimer: number | undefined;

      try {
        target.setPointerCapture(pointerId);
      } catch {
        /* Capture is a nicety, not a requirement. */
      }

      const activate = () => {
        active = true;
        pointerRef.current = { ...latest };
        zoomRef.current = getZoom();
        document.body.classList.add('is-dragging-node');
        if (isTouch) navigator.vibrate?.(6);
        setDragging(item);
      };

      const cleanup = () => {
        window.clearTimeout(holdTimer);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onCancel);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('touchmove', onTouchMove);
        try {
          target.releasePointerCapture(pointerId);
        } catch {
          /* Already released. */
        }
        document.body.classList.remove('is-dragging-node');
        cancelRef.current = null;
        setDragging(null);
      };

      function onMove(e: PointerEvent) {
        if (e.pointerId !== pointerId) return;
        latest.x = e.clientX;
        latest.y = e.clientY;
        if (!active) {
          const moved = Math.hypot(e.clientX - origin.x, e.clientY - origin.y);
          if (isTouch) {
            // Moved before the hold finished: the user is scrolling the list.
            if (moved > TOUCH_SLOP) cleanup();
            return;
          }
          if (moved < MOUSE_THRESHOLD) return;
          activate();
        }
        pointerRef.current = { x: e.clientX, y: e.clientY };
        positionGhost();
      }

      function onUp(e: PointerEvent) {
        if (e.pointerId !== pointerId) return;
        const wasActive = active;
        cleanup();
        if (wasActive && isOverCanvas(e.clientX, e.clientY)) drop(item, e.clientX, e.clientY);
      }

      function onCancel(e: PointerEvent) {
        if (e.pointerId === pointerId) cleanup();
      }

      function onKey(e: KeyboardEvent) {
        if (e.key === 'Escape') cleanup();
      }

      // Once a touch drag is live, stop the browser from scrolling the page or list.
      function onTouchMove(e: TouchEvent) {
        if (active && e.cancelable) e.preventDefault();
      }

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onCancel);
      window.addEventListener('keydown', onKey);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      cancelRef.current = cleanup;

      if (isTouch) holdTimer = window.setTimeout(activate, TOUCH_HOLD_MS);
    },
    [drop, getZoom, positionGhost],
  );

  const placeAtCenter = useCallback(
    (item: CatalogItem) => {
      const canvas = document.querySelector('[data-canvas-drop]');
      const rect = canvas?.getBoundingClientRect();
      const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      // Stagger repeat placements so they do not stack exactly.
      const stagger = (nodeCountRef.current % 6) * 28;
      drop(item, cx + stagger, cy + stagger);
    },
    [drop],
  );

  // Abort any drag in flight if the provider unmounts.
  useEffect(() => () => cancelRef.current?.(), []);

  const value = useMemo(
    () => ({ dragging, beginDrag, placeAtCenter, ghostRef, positionGhost }),
    [dragging, beginDrag, placeAtCenter, positionGhost],
  );

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDrag() {
  const ctx = useContext(DragContext);
  if (!ctx) throw new Error('useDrag must be used inside <DragProvider>');
  return ctx;
}
