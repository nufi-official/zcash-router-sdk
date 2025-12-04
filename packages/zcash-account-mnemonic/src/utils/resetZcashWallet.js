import { clearAllBirthdayBlocks } from '../infrastructure/birthdayBlockStorage';
import { clearWebWalletManager } from '../infrastructure/webWalletManagerSingleton';
export function resetZcashWallet() {
    clearWebWalletManager();
    clearAllBirthdayBlocks();
}
//# sourceMappingURL=resetZcashWallet.js.map