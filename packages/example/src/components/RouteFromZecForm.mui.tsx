import { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { AmountInput } from './RouteToZecForm/AmountInput';
import { AssetSelect } from './RouteToZecForm/AssetSelect';
import { SwapButton } from './RouteToZecForm/SwapButton';
import { useTokenPrice } from './RouteToZecForm/useTokenPrice';
import { useZecBalance } from './RouteToZecForm/useZecBalance';
import { CARVED_BOX_STYLES } from './RouteToZecForm/constants';

interface RouteFromZecFormProps {
  addressType: 'transparent' | 'shielded';
  mnemonic: string;
}

export function RouteFromZecForm({ addressType, mnemonic }: RouteFromZecFormProps) {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('SOL');

  const { price: assetPrice, loading: priceLoading } = useTokenPrice(asset);
  const { price: zecPrice, loading: zecPriceLoading } = useTokenPrice('ZEC');
  const { balance: zecBalance, loading: balanceLoading } = useZecBalance(addressType, mnemonic);

  // Calculate max SOL amount based on ZEC balance
  const maxBalance = useMemo(() => {
    if (balanceLoading || zecPriceLoading || priceLoading) return '0';

    const zecBalanceNum = parseFloat(zecBalance);
    const zecPriceNum = zecPrice;
    const assetPriceNum = assetPrice;

    if (isNaN(zecBalanceNum) || zecBalanceNum <= 0 || zecPriceNum <= 0 || assetPriceNum <= 0) {
      return '0';
    }

    // Convert ZEC balance to USD, then to SOL
    const zecValueInUsd = zecBalanceNum * zecPriceNum;
    const maxAssetAmount = zecValueInUsd / assetPriceNum;

    return maxAssetAmount.toFixed(6);
  }, [zecBalance, zecPrice, assetPrice, balanceLoading, zecPriceLoading, priceLoading]);

  const usdValue = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || assetPrice <= 0) {
      return '$0';
    }
    const value = numAmount * assetPrice;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [amount, assetPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // TODO: Implement swap from ZEC to other assets
    alert('Route from Zcash functionality coming soon!');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Amount and Asset Selector */}
      <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
        >
          Buy
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <AmountInput value={amount} onChange={setAmount} />
          </Box>
          <AssetSelect value={asset} onChange={setAsset} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {priceLoading ? 'Loading price...' : usdValue}
          </Typography>
          <Typography
            onClick={() => setAmount(maxBalance)}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#F3B724',
              cursor: 'pointer',
              mr: '14px',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            MAX: {maxBalance} {asset}
          </Typography>
        </Box>
      </Box>

      {/* Submit Button */}
      <SwapButton
        isProcessing={false}
        text="Get Quote"
      />
    </Box>
  );
}
