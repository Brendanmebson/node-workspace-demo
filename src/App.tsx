import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ReactFlowProvider } from '@xyflow/react';
import { CanvasControls } from './components/controls/CanvasControls';
import { DragGhost } from './components/Sidebar/DragGhost';
import { Sidebar } from './components/Sidebar/Sidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { DragProvider } from './context/DragContext';
import { WorkflowProvider } from './context/WorkflowContext';
import { theme } from './theme/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactFlowProvider>
        <WorkflowProvider>
          <DragProvider>
            <Box component="main" sx={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
              <WorkflowCanvas />
              <CanvasControls />
              <Sidebar />
            </Box>
            <DragGhost />
          </DragProvider>
        </WorkflowProvider>
      </ReactFlowProvider>
    </ThemeProvider>
  );
}
