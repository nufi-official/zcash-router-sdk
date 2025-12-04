import type { ZcashNetwork } from '../domain/network';
import type { WebWalletManager } from '../domain/webWalletManager';
export declare function getWebWalletManager(network: ZcashNetwork, lightwalletdUrl: string, minConfirmations: number): WebWalletManager;
export declare function clearWebWalletManager(): void;
export declare function resetWebWalletManager(): void;
//# sourceMappingURL=webWalletManagerSingleton.d.ts.map