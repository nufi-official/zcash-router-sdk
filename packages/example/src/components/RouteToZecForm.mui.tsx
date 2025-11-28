import { useState, useCallback } from 'react';
import { validateMnemonic } from 'bip39';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import {
  routeToZcash,
  type SwapStateChangeEvent,
  type AccountFull,
} from '@asset-route-sdk/core';
import { createSolanaAccount } from '@asset-route-sdk/solana-hot-address-only';
import { createZcashShieldedAccount } from '@asset-route-sdk/zcash-hot-shielded-full';
import { SwapStatus } from './SwapStatus.mui';

export function RouteToZecForm() {
  // Form state
  const [solanaMnemonic, setSolanaMnemonic] = useState('');
  const [zcashMnemonic, setZcashMnemonic] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('SOL');

  // Swap state
  const [swapStatus, setSwapStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [currentState, setCurrentState] = useState<SwapStateChangeEvent>();
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<string>();

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!solanaMnemonic.trim()) {
      newErrors.solanaMnemonic = 'Solana mnemonic is required';
    } else if (!validateMnemonic(solanaMnemonic.trim())) {
      newErrors.solanaMnemonic = 'Invalid BIP39 mnemonic';
    }

    if (!zcashMnemonic.trim()) {
      newErrors.zcashMnemonic = 'Zcash mnemonic is required';
    } else if (!validateMnemonic(zcashMnemonic.trim())) {
      newErrors.zcashMnemonic = 'Invalid BIP39 mnemonic';
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [solanaMnemonic, zcashMnemonic, amount]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        setSwapStatus('processing');
        setError(undefined);
        setTxHash(undefined);
        setCurrentState(undefined);

        // Create Solana account
        const solanaAddressOnly = await createSolanaAccount({
          mnemonic: solanaMnemonic.trim(),
          accountIndex: 0,
          network: 'mainnet',
          tokenId: 'native',
        });

        // Create AccountFull wrapper
        const solanaAccount: AccountFull = {
          ...solanaAddressOnly,
          type: 'full',
          async getBalance() {
            return BigInt(0);
          },
          async sendDeposit({ address, amount }) {
            console.log('Mock sendDeposit called:', { address, amount });
            throw new Error(
              'Wallet integration not implemented yet. Please implement sendDeposit with a real Solana wallet SDK.'
            );
          },
        };

        // Create Zcash account
        const zcashAccount = await createZcashShieldedAccount({
          mnemonic: zcashMnemonic.trim(),
          accountIndex: 0,
          network: 'main',
          lightwalletdUrl:
            process.env.VITE_LIGHTWALLETD_URL ||
            'https://lightwalletd.example.com',
          minConfirmations: 1,
        });

        // Execute swap
        await routeToZcash({
          sourceAccount: solanaAccount,
          zcashAccount: zcashAccount as any,
          amount,
          onSwapStatusChange: (event) => {
            console.log('Swap status update:', event);
            setCurrentState(event);

            if (event.status === 'DEPOSIT_SENT') {
              setTxHash(event.txHash);
            } else if (event.status === 'SUCCESS') {
              setSwapStatus('success');
            } else if (
              event.status === 'FAILED' ||
              event.status === 'REFUNDED'
            ) {
              setSwapStatus('error');
              setError(`Swap ${event.status.toLowerCase()}`);
            }
          },
        });
      } catch (err) {
        console.error('Swap error:', err);
        setSwapStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    },
    [solanaMnemonic, zcashMnemonic, amount, validateForm]
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Asset Selector */}
      <TextField
        select
        fullWidth
        label="Source Asset"
        value={asset}
        onChange={(e) => setAsset(e.target.value)}
        margin="normal"
        variant="outlined"
      >
        <MenuItem value="SOL">SOL (Solana)</MenuItem>
      </TextField>

      {/* Solana Mnemonic */}
      <TextField
        fullWidth
        label="Solana Mnemonic"
        value={solanaMnemonic}
        onChange={(e) => setSolanaMnemonic(e.target.value)}
        placeholder="your twelve or twenty-four word mnemonic..."
        multiline
        rows={3}
        margin="normal"
        variant="outlined"
        required
        error={!!errors['solanaMnemonic']}
        helperText={
          errors['solanaMnemonic'] ||
          '⚠️ Never share your mnemonic. This is for demo purposes only.'
        }
        sx={{
          '& .MuiInputBase-input': {
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          },
        }}
      />

      {/* Zcash Mnemonic */}
      <TextField
        fullWidth
        label="Zcash Mnemonic (Destination)"
        value={zcashMnemonic}
        onChange={(e) => setZcashMnemonic(e.target.value)}
        placeholder="your twelve or twenty-four word mnemonic..."
        multiline
        rows={3}
        margin="normal"
        variant="outlined"
        required
        error={!!errors['zcashMnemonic']}
        helperText={errors['zcashMnemonic']}
        sx={{
          '& .MuiInputBase-input': {
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          },
        }}
      />

      {/* Amount */}
      <TextField
        fullWidth
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        margin="normal"
        variant="outlined"
        required
        error={!!errors['amount']}
        helperText={errors['amount']}
        InputProps={{
          endAdornment: (
            <Typography variant="body2" color="text.secondary">
              {asset}
            </Typography>
          ),
        }}
        inputProps={{
          step: '0.000000001',
          min: '0',
        }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={swapStatus === 'processing'}
        startIcon={
          swapStatus === 'processing' ? <CircularProgress size={20} /> : <SendIcon />
        }
        sx={{ mt: 3, py: 1.5 }}
      >
        {swapStatus === 'processing' ? 'Processing...' : 'Swap to Zcash'}
      </Button>

      {/* Status Display */}
      {swapStatus !== 'idle' && (
        <Box sx={{ mt: 3 }}>
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
