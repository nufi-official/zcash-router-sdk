import { useState, useCallback } from 'react';
import { validateMnemonic } from 'bip39';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Send as SendIcon, Brightness1 } from '@mui/icons-material';
import {
  routeToZcash,
  type SwapStateChangeEvent,
  type AccountFull,
} from '@asset-route-sdk/core';
import { createSolanaAccount } from '@asset-route-sdk/solana-hot-address-only';
import { createZcashShieldedAccount } from '@asset-route-sdk/zcash-hot-shielded-full';
import { SwapStatus } from './SwapStatus.mui';

// Solana Icon Component
const SolanaIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 397.7 311.7" fill="currentColor">
    <defs>
      <linearGradient
        id="solanaGradient"
        x1="360.8791"
        y1="351.4553"
        x2="141.213"
        y2="-69.2936"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" style={{ stopColor: '#00FFA3' }} />
        <stop offset="1" style={{ stopColor: '#DC1FFF' }} />
      </linearGradient>
    </defs>
    <path
      d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"
      fill="url(#solanaGradient)"
    />
    <path
      d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"
      fill="url(#solanaGradient)"
    />
    <path
      d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"
      fill="url(#solanaGradient)"
    />
  </svg>
);

export function RouteToZecForm() {
  // Form state
  const [solanaMnemonic] = useState('');
  const [zcashMnemonic] = useState('');
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
    <Box
      component="form"
      onSubmit={(e) => handleSubmit(e)}
      sx={{ width: '100%' }}
    >
      {/* Amount and Asset Selector Combined */}
      <Box
        sx={{
          border: '1px solid rgba(0, 0, 0, 0.5)',
          borderRadius: 3,
          p: 3,
          mb: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(0, 0, 0, 0.9)',
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
        >
          Sell
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="0"
            variant="standard"
            error={!!errors['amount']}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '2.5rem',
                fontWeight: 500,
                color: 'white',
                '& input': {
                  padding: 0,
                },
                '& input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.3)',
                  opacity: 1,
                },
              },
            }}
            inputProps={{
              step: '0.000000001',
              min: '0',
            }}
          />
          <TextField
            sx={{
              minWidth: 140,
            }}
            select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'white',
                  minWidth: 160,
                },
              },
              select: {
                renderValue: (value: unknown) => {
                  const val = value as string;
                  return (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        fontFamily:
                          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      }}
                    >
                      {val === 'SOL' && <SolanaIcon size={28} />}
                      {val}
                    </Box>
                  );
                },
                IconComponent: (props) => (
                  <Box
                    {...props}
                    sx={{
                      color: '#F3B724',
                      transition: 'transform 0.2s ease',
                      transform: props.className?.includes('MuiSelect-iconOpen')
                        ? 'rotate(180deg)'
                        : 'rotate(0)',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      right: -12,
                      top: '50%',
                      pointerEvents: 'none',
                      'margin-right': '14px',
                      'margin-top': '-5px',
                    }}
                  >
                    ▼
                  </Box>
                ),
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  '&:focus': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: 0,
                    paddingBottom: 0,
                  },
                },
              },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(10, 10, 10, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderTop: 'none',
                    borderRadius: '0 0 24px 24px',
                    marginTop: '-8px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    '& .MuiList-root': {
                      paddingTop: 0,
                    },
                  },
                },
              },
            }}
          >
            <MenuItem
              value="SOL"
              sx={{
                fontSize: '1.25rem',
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SolanaIcon size={28} />
                SOL
              </Box>
            </MenuItem>
          </TextField>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          $0
        </Typography>
        {errors['amount'] && (
          <Typography
            variant="caption"
            sx={{ color: 'error.main', mt: 1, display: 'block' }}
          >
            {errors['amount']}
          </Typography>
        )}
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={swapStatus === 'processing'}
        startIcon={
          swapStatus === 'processing' ? (
            <CircularProgress size={20} />
          ) : (
            <SendIcon />
          )
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
