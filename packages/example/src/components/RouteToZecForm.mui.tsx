import { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { AmountInput } from './RouteToZecForm/AmountInput';
import { AssetSelect } from './RouteToZecForm/AssetSelect';
import { SwapButton } from './RouteToZecForm/SwapButton';
import { SwapTimeline } from './RouteToZecForm/SwapTimeline';
import { AddressDisplay } from './RouteToZecForm/AddressDisplay';
import { useTokenPrice } from './RouteToZecForm/useTokenPrice';
import { useSolBalance } from './RouteToZecForm/useSolBalance';
import { useSolanaAddress } from './RouteToZecForm/useSolanaAddress';
import { useAccounts } from '../contexts/AccountContext';
import {
  CARVED_BOX_STYLES,
  SLIDE_DOWN_ANIMATION,
} from './RouteToZecForm/constants';
import type { SwapStateChangeEvent } from '@asset-route-sdk/core';

interface RouteToZecFormProps {
  addressType: 'transparent' | 'shielded';
  mnemonic: string;
  onConnectClick?: () => void;
  onRefreshBalance?: (refresh: () => void) => void;
  onRefreshAllBalances?: () => void;
}

export function RouteToZecForm({
  addressType,
  mnemonic,
  onConnectClick,
  onRefreshBalance,
  onRefreshAllBalances,
}: RouteToZecFormProps) {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('SOL');
  const [swapStatus, setSwapStatus] = useState<
    'idle' | 'monitoring' | 'success' | 'error'
  >('idle');
  const [currentState, setCurrentState] = useState<SwapStateChangeEvent>();
  const [swapError, setSwapError] = useState<string>();
  const [depositTxHash, setDepositTxHash] = useState<string>();
  const [depositAddress, setDepositAddress] = useState<string>();

  // Get accounts from context
  const { solanaAccount, zcashTransparentAccount, zcashShieldedAccount, isLoading: accountsLoading } = useAccounts();

  const { price, loading: priceLoading } = useTokenPrice(asset);
  const {
    balance: solBalance,
    loading: balanceLoading,
    refresh: refreshSolBalance,
  } = useSolBalance(mnemonic);
  const { address: solanaAddress, loading: addressLoading } =
    useSolanaAddress(mnemonic);

  // Pass refresh function to parent
  useEffect(() => {
    if (onRefreshBalance) {
      onRefreshBalance(refreshSolBalance);
    }
  }, [onRefreshBalance, refreshSolBalance]);

  // Refresh both balances after success or error
  useEffect(() => {
    if (swapStatus === 'success' || swapStatus === 'error') {
      if (onRefreshAllBalances) {
        onRefreshAllBalances();
      } else {
        refreshSolBalance();
      }
    }
  }, [swapStatus, onRefreshAllBalances, refreshSolBalance]);

  // Max balance is the SOL balance (only shown for SOL asset)
  const maxBalance = useMemo(() => {
    if (asset !== 'SOL' || balanceLoading) return '0';
    return solBalance;
  }, [asset, solBalance, balanceLoading]);

  const usdValue = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || price <= 0) {
      return '$0';
    }
    const value = numAmount * price;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [amount, price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!price || price <= 0) {
      alert('Waiting for price data...');
      return;
    }

    // Validate accounts from context
    if (accountsLoading) {
      alert('Accounts are still loading...');
      return;
    }

    if (!solanaAccount) {
      alert('Solana account not available');
      return;
    }

    const zcashAccount = addressType === 'shielded' ? zcashShieldedAccount : zcashTransparentAccount;
    if (!zcashAccount) {
      alert(`Zcash ${addressType} account not available`);
      return;
    }

    try {
      // Set status to monitoring to show processing UI
      setSwapStatus('monitoring');
      setSwapError(undefined);
      setCurrentState(undefined);
      setDepositTxHash(undefined);
      setDepositAddress(undefined);

      console.log('[RouteToZecForm] Starting swap with routeToZcash:', {
        amount: numAmount,
        asset,
        addressType,
      });

      // Execute the swap using routeToZcash
      const { routeToZcash } = await import('@asset-route-sdk/core');

      await routeToZcash({
        sourceAccount: solanaAccount,
        zcashAccount: zcashAccount,
        amount: numAmount.toString(),
        onSwapStatusChange: (event) => {
          // eslint-disable-next-line no-console
          console.log('[RouteToZecForm] Swap status:', event);
          setCurrentState(event);

          // Capture deposit address if available
          if ('depositAddress' in event && event.depositAddress) {
            setDepositAddress(event.depositAddress as string);
          }

          if (event.status === 'DEPOSIT_SENT') {
            // Capture deposit txHash
            if ('txHash' in event && event.txHash) {
              setDepositTxHash(event.txHash);
            }
            // Deposit sent, continue monitoring
            setSwapStatus('monitoring');
          } else if (event.status === 'SUCCESS') {
            setSwapStatus('success');
          } else if (event.status === 'FAILED' || event.status === 'REFUNDED') {
            setSwapStatus('error');
            setSwapError(`Swap ${event.status.toLowerCase()}`);
          }
        },
      });
    } catch (err) {
      console.error('[RouteToZecForm] Failed to execute swap:', err);
      setSwapStatus('error');
      setSwapError(err instanceof Error ? err.message : 'Unknown error');
      alert(
        `Failed to execute swap: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Amount and Asset Selector */}
      <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            → Zcash
          </Typography>
          <AddressDisplay address={solanaAddress} loading={addressLoading} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AmountInput
            value={amount}
            onChange={setAmount}
            disabled={swapStatus === 'monitoring'}
          />
          <AssetSelect
            value={asset}
            onChange={setAsset}
            disabled={swapStatus === 'monitoring'}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {priceLoading ? 'Loading price...' : usdValue}
          </Typography>
          <Typography
            onClick={() => !balanceLoading && setAmount(maxBalance)}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              cursor: balanceLoading ? 'default' : 'pointer',
              opacity: balanceLoading ? 0.6 : 1,
              '&:hover': {
                textDecoration: balanceLoading ? 'none' : 'underline',
              },
            }}
          >
            {balanceLoading
              ? 'Loading balance...'
              : `MAX: ${maxBalance} ${asset}`}
          </Typography>
        </Box>
      </Box>

      {/* Submit Button */}
      <SwapButton
        isProcessing={swapStatus === 'monitoring'}
        text="Swap"
        isLoggedIn={!!mnemonic && !!mnemonic.trim()}
        onConnectClick={onConnectClick}
      />

      {/* Timeline - Show during swap execution */}
      {(swapStatus === 'monitoring' || swapStatus === 'success') && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <SwapTimeline
            currentState={currentState}
            isFetchingQuote={false}
            hasQuote={true}
          />
        </Box>
      )}

      {/* NEAR Intents Explorer - Show when we have deposit address */}
      {depositAddress && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <Box sx={{ ...CARVED_BOX_STYLES, p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', fontWeight: 600 }}
              >
                Swap status:
              </Typography>
              <Link
                href={`https://explorer.near-intents.org/transactions/${depositAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#F3B724',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                NEAR Intents Explorer
                <OpenInNewIcon sx={{ fontSize: '0.875rem' }} />
              </Link>
            </Box>
          </Box>
        </Box>
      )}

      {/* Transaction Info - Show when we have a deposit tx */}
      {depositTxHash && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <Box sx={{ ...CARVED_BOX_STYLES, p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', fontWeight: 600 }}
              >
                Deposit SOL TX:
              </Typography>
              <Link
                href={`https://explorer.solana.com/tx/${depositTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#F3B724',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {depositTxHash.slice(0, 8)}...{depositTxHash.slice(-8)}
                <OpenInNewIcon sx={{ fontSize: '0.875rem' }} />
              </Link>
            </Box>
          </Box>
        </Box>
      )}

      {/* Error Display - Show only on error */}
      {swapStatus === 'error' && swapError && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <Box sx={{ ...CARVED_BOX_STYLES, p: 3 }}>
            <Typography color="error" variant="body2">
              Error: {swapError}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
