/**
 * Common test utilities and fixtures
 */

import type { SecretProvider } from '../domain/secretProvider';

/**
 * Test seed phrase for consistent testing
 * DO NOT use this in production!
 */
export const TEST_SEED =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

/**
 * Creates a test secret provider with a given seed
 */
export const createTestSecretProvider = (seed: string): SecretProvider => {
  return {
    getMnemonic: async () => seed,
    storeMnemonic: async () => {
      // No-op for tests
    },
    clearMnemonic: async () => {
      // No-op for tests
    },
  };
};
