import { WebWalletManagerImpl } from './webWalletManager';
let webWalletManagerInstance = null;
let currentConfig = null;
export function getWebWalletManager(network, lightwalletdUrl, minConfirmations) {
    const configKey = `${network}-${lightwalletdUrl}-${minConfirmations}`;
    if (currentConfig !== configKey) {
        webWalletManagerInstance = null;
        currentConfig = configKey;
    }
    if (!webWalletManagerInstance) {
        webWalletManagerInstance = new WebWalletManagerImpl({
            network,
            lightwalletdUrl,
            minConfirmations,
        });
    }
    return webWalletManagerInstance;
}
export function clearWebWalletManager() {
    if (webWalletManagerInstance) {
        const manager = webWalletManagerInstance;
        if (typeof manager.destroy === 'function') {
            manager.destroy();
        }
    }
    webWalletManagerInstance = null;
    currentConfig = null;
}
export function resetWebWalletManager() {
    clearWebWalletManager();
    currentConfig = null;
}
//# sourceMappingURL=webWalletManagerSingleton.js.map