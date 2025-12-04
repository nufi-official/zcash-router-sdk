let wasmInitialized = false;
let initializationPromise = null;
export const initWebZjs = async (webzJsWallet, webzJsKeys) => {
    if (wasmInitialized) {
        return Promise.resolve();
    }
    if (initializationPromise) {
        return initializationPromise;
    }
    initializationPromise = (async () => {
        try {
            const initWalletWasm = webzJsWallet.default;
            const initKeysWasm = webzJsKeys.default;
            await Promise.all([initWalletWasm(), initKeysWasm()]);
            if (process.env.NODE_ENV !== 'test') {
                const threadCount = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
                    ? navigator.hardwareConcurrency
                    : 4;
                const initThreadPool = webzJsWallet.initThreadPool;
                await initThreadPool(threadCount);
            }
            wasmInitialized = true;
        }
        catch (error) {
            initializationPromise = null;
            throw new Error(`Failed to initialize WebZjs WASM: ${error}`);
        }
    })();
    return initializationPromise;
};
//# sourceMappingURL=wasmInit.js.map