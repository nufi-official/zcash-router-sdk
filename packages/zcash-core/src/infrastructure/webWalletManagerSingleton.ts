import type { ZcashNetwork } from '../domain/network';
import { WebWalletManagerImpl } from './webWalletManager';
import type { WebWalletManager } from '../domain/webWalletManager';

// Singleton instance
let webWalletManagerInstance: WebWalletManager | null = null;
let currentConfig: string | null = null;

/**
 * Get or create a singleton WebWalletManager instance
 *
 * This ensures that all accounts share the same wallet instance,
 * preventing duplicate accounts from being created
 */
export function getWebWalletManager(
  network: ZcashNetwork,
  lightwalletdUrl: string,
  minConfirmations: number
): WebWalletManager {
  // Create a config key to detect if settings changed
  const configKey = `${network}-${lightwalletdUrl}-${minConfirmations}`;

  // If config changed, clear the instance
  if (currentConfig !== configKey) {
    webWalletManagerInstance = null;
    currentConfig = configKey;
  }

  // Create new instance if needed
  if (!webWalletManagerInstance) {
    webWalletManagerInstance = new WebWalletManagerImpl({
      network,
      lightwalletdUrl,
      minConfirmations,
    });
  }

  return webWalletManagerInstance;
}

/**
 * Clear the singleton instance
 * Useful for testing or when switching wallets
 */
export function clearWebWalletManager(): void {
  if (webWalletManagerInstance && typeof (webWalletManagerInstance as any).destroy === 'function') {
    (webWalletManagerInstance as any).destroy();
  }
  webWalletManagerInstance = null;
  currentConfig = null;
}
