import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { tokens } from '../../theme/tokens';

/** Shown until the first node lands. It never intercepts pointer events. */
export function EmptyState({ visible }: { visible: boolean }) {
  const coarse = useMediaQuery('(pointer: coarse)');

  return (
    <Box
      aria-hidden={!visible}
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 180ms ease',
        padding: 3,
      }}
    >
      <Box sx={{ maxWidth: 300, textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 2,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            border: `1.5px dashed ${tokens.canvasDot}`,
            color: tokens.inkMuted,
          }}
        >
          <AccountTreeOutlined />
        </Box>
        <Typography variant="h6" component="p" sx={{ fontSize: 17 }}>
          Start building your workflow
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, fontSize: 14, textWrap: 'balance' }}>
          {coarse
            ? 'Open the menu, then press and hold a component and drag it here.'
            : 'Drag a component from the sidebar and drop it here.'}
        </Typography>
      </Box>
    </Box>
  );
}
