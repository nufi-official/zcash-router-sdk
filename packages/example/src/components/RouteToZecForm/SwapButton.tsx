import { Button, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface SwapButtonProps {
  isProcessing: boolean;
}

export function SwapButton({ isProcessing }: SwapButtonProps) {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      fullWidth
      disabled={isProcessing}
      startIcon={isProcessing ? <CircularProgress size={20} /> : <SendIcon />}
      sx={{ mt: 3, py: 1.5 }}
    >
      {isProcessing ? 'Processing...' : 'Swap to Zcash'}
    </Button>
  );
}
