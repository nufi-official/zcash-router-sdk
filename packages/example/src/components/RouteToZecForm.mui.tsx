import { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import type { SwapStateChangeEvent } from '@asset-route-sdk/core';
import { SwapStatus } from './SwapStatus.mui';
import { SolanaIcon } from './RouteToZecForm/SolanaIcon';
import { CARVED_BOX_STYLES, SLIDE_DOWN_ANIMATION, AMOUNT_INPUT_STYLES } from './RouteToZecForm/constants';
import { createMockSwapStates } from './RouteToZecForm/mockSwapStates';

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

  const startMockProgress = useCallback(() => {
    const mockStates = createMockSwapStates();
    let currentIndex = 0;
    setSwapStatus('processing');
    setCurrentState(mockStates[0]);

    setInterval(() => {
      currentIndex++;
      if (currentIndex < mockStates.length) {
        setCurrentState(mockStates[currentIndex]);
        if (mockStates[currentIndex].status === 'SUCCESS') {
          setSwapStatus('success');
        }
      }
    }, 3000);
  }, []);

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

      // Skip validation for mock
      // if (!validateForm()) {
      //   return;
      // }

      // Start mock progress
      startMockProgress();

      // TODO: Uncomment below for real implementation
      /*
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
      */
    },
    [validateForm, startMockProgress]
  );

  return (
    <Box
      component="form"
      onSubmit={(e) => handleSubmit(e)}
      sx={{ width: '100%' }}
    >
      {/* Amount and Asset Selector Combined */}
      <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
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
            slotProps={{
              input: {
                disableUnderline: true,
                sx: AMOUNT_INPUT_STYLES,
              },
              htmlInput: {
                step: '0.000000001',
                min: '0',
              },
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
                  backgroundColor: 'transparent',
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  '&:focus': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
