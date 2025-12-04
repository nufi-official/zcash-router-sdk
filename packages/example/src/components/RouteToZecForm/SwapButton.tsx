import { Button, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface SwapButtonProps {
  isProcessing: boolean;
  text?: string;
  isLoggedIn?: boolean;
  onConnectClick?: () => void;
}

export function SwapButton({
  isProcessing,
  text = 'Swap to Zcash',
  isLoggedIn = true,
  onConnectClick
}: SwapButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoggedIn && onConnectClick) {
      e.preventDefault();
      onConnectClick();
    }
  };

  return (
    <Button
      type={isLoggedIn ? "submit" : "button"}
      variant="contained"
      size="large"
      fullWidth
      disabled={isProcessing}
      onClick={handleClick}
      startIcon={isProcessing ? <CircularProgress size={20} /> : (isLoggedIn ? <SendIcon /> : undefined)}
      sx={{ mt: 3, py: 1.5 }}
    >
      {isProcessing ? 'Processing...' : (isLoggedIn ? text : 'Connect')}
    </Button>
  );
}
