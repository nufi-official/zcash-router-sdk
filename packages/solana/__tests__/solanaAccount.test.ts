import { describe, it, expect } from 'vitest';
import { createSolanaAccount } from '../src';

describe('SolanaAccountAddressOnly', () => {
  const testMnemonic =
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
  const accountIndex = 0;
  const network = 'mainnet' as const;

  describe('getAddress', () => {
    it('should derive a valid Solana address', async () => {
      const account = await createSolanaAccount({
        mnemonic: testMnemonic,
        accountIndex,
        network,
      });

      const address = await account.getAddress();

      expect(address).toMatch('4nFZgXtZAEwbfA56LRVRdsDGNeW3U55gr5hL9c5E5de5');
    });
  });

  describe('assetToBaseUnits', () => {
    it('should convert SOL to lamports correctly', async () => {
      const account = await createSolanaAccount({
        mnemonic: testMnemonic,
        accountIndex,
        network,
      });

      // 1 SOL = 1,000,000,000 lamports
      expect(account.assetToBaseUnits('1')).toBe(1_000_000_000n);
      expect(account.assetToBaseUnits('1.0')).toBe(1_000_000_000n);
      expect(account.assetToBaseUnits('0.5')).toBe(500_000_000n);
      expect(account.assetToBaseUnits('0.000000001')).toBe(1n);
      expect(account.assetToBaseUnits('10')).toBe(10_000_000_000n);
    });

    it('should handle decimal places correctly', async () => {
      const account = await createSolanaAccount({
        mnemonic: testMnemonic,
        accountIndex,
        network,
      });

      expect(account.assetToBaseUnits('1.123456789')).toBe(1_123_456_789n);
      expect(account.assetToBaseUnits('0.123456789')).toBe(123_456_789n);
    });

    it('should throw on invalid amounts', async () => {
      const account = await createSolanaAccount({
        mnemonic: testMnemonic,
        accountIndex,
        network,
      });

      expect(() => account.assetToBaseUnits('invalid')).toThrow(
        'Invalid amount'
      );
      expect(() => account.assetToBaseUnits('-1')).toThrow('Invalid amount');
    });

    it('should handle zero', async () => {
      const account = await createSolanaAccount({
        mnemonic: testMnemonic,
        accountIndex,
        network,
      });

      expect(account.assetToBaseUnits('0')).toBe(0n);
      expect(account.assetToBaseUnits('0.0')).toBe(0n);
    });
  });
});
