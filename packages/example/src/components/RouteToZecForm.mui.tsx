import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { SwapStatus } from './SwapStatus.mui';
import { AmountInput } from './RouteToZecForm/AmountInput';
import { AssetSelect } from './RouteToZecForm/AssetSelect';
import { SwapButton } from './RouteToZecForm/SwapButton';
import { useSwapState } from './RouteToZecForm/useSwapState';
import { CARVED_BOX_STYLES, SLIDE_DOWN_ANIMATION } from './RouteToZecForm/constants';

export function RouteToZecForm() {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('SOL');

  const { swapStatus, currentState, txHash, error, startMockProgress } = useSwapState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startMockProgress();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Amount and Asset Selector */}
      <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
        >
          Sell
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AmountInput value={amount} onChange={setAmount} />
          <AssetSelect value={asset} onChange={setAsset} />
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          $0
        </Typography>
      </Box>

      {/* Submit Button */}
      <SwapButton isProcessing={swapStatus === 'processing'} />

      {/* Status Display */}
      {swapStatus !== 'idle' && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <SwapStatus
            status={swapStatus}
            currentState={currentState}
            txHash={txHash}
            error={error}
          />
        </Box>
      )}
    </Box>
  );
}
