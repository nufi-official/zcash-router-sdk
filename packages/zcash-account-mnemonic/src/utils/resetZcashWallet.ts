import { clearAllBirthdayBlocks } from '../infrastructure/birthdayBlockStorage';
import { clearWebWalletManager } from '../infrastructure/webWalletManagerSingleton';

/**
 * Reset all Zcash wallet state
 *
 * This clears:
 * - The WebWalletManager singleton (and destroys the underlying wallet)
 * - All stored birthday blocks in localStorage
 *
 * Use this when you want to start completely fresh with a new wallet
 * or when you need to clear corrupted state
 */
export function resetZcashWallet(): void {
  // Clear the wallet manager instance
  clearWebWalletManager();

  // Clear all birthday blocks from localStorage
  clearAllBirthdayBlocks();
}
