import { useState, useCallback } from 'react';
import { validateMnemonic } from 'bip39';
import {
  routeToZcash,
  type SwapStateChangeEvent,
  type AccountFull,
} from '@asset-route-sdk/core';
import { createSolanaAccount } from '@asset-route-sdk/solana-account-mnemonic';
import { createZcashShieldedAccount } from '@asset-route-sdk/zcash-account-mnemonic';
import { SwapStatus } from './SwapStatus';

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

        // Create Solana account (address-only, we'll wrap it as AccountFull for demo)
        const solanaAddressOnly = await createSolanaAccount({
          mnemonic: solanaMnemonic.trim(),
          accountIndex: 0,
          network: 'mainnet',
          tokenId: undefined,
        });

        // TODO: In production, integrate with real Solana wallet SDK
        // For now, create a mock AccountFull wrapper
        const solanaAccount: AccountFull = {
          ...solanaAddressOnly,
          type: 'full',
          async getBalance() {
            // TODO: Implement real balance fetching
            return BigInt(0);
          },
          async sendDeposit({ address, amount }) {
            // TODO: Implement real transaction sending
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
          zcashAccount: zcashAccount as any, // Type assertion needed due to complex Extract type
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
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Route to Zcash</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asset Selector */}
        <div>
          <label
            htmlFor="asset"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Source Asset
          </label>
          <select
            id="asset"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SOL">SOL (Solana)</option>
          </select>
        </div>

        {/* Solana Mnemonic */}
        <div>
          <label
            htmlFor="solanaMnemonic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Solana Mnemonic
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="solanaMnemonic"
            value={solanaMnemonic}
            onChange={(e) => setSolanaMnemonic(e.target.value)}
            placeholder="your twelve or twenty-four word mnemonic..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
              errors['solanaMnemonic'] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors['solanaMnemonic'] && (
            <p className="mt-1 text-sm text-red-600">
              {errors['solanaMnemonic']}
            </p>
          )}
          <p className="mt-1 text-xs text-yellow-600">
            ⚠️ Never share your mnemonic. This is for demo purposes only.
          </p>
        </div>

        {/* Zcash Mnemonic */}
        <div>
          <label
            htmlFor="zcashMnemonic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Zcash Mnemonic (Destination)
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="zcashMnemonic"
            value={zcashMnemonic}
            onChange={(e) => setZcashMnemonic(e.target.value)}
            placeholder="your twelve or twenty-four word mnemonic..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
              errors['zcashMnemonic'] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors['zcashMnemonic'] && (
            <p className="mt-1 text-sm text-red-600">
              {errors['zcashMnemonic']}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000000001"
              min="0"
              placeholder="0.0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors['amount'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="absolute right-3 top-2 text-gray-500">
              {asset}
            </span>
          </div>
          {errors['amount'] && (
            <p className="mt-1 text-sm text-red-600">{errors['amount']}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={swapStatus === 'processing'}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            swapStatus === 'processing'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {swapStatus === 'processing' ? 'Processing...' : 'Swap to Zcash'}
        </button>
      </form>

      {/* Status Display */}
      <SwapStatus
        status={swapStatus}
        currentState={currentState}
        txHash={txHash}
        error={error}
      />
    </div>
  );
}
