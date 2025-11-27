import type { WebZjsKeys, WebZjsWallet } from './types';

let wasmInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize WebZjs WASM modules (wallet and keys) and thread pool.
 * MUST be called exactly once before using any WebZjs functionality.
 * Subsequent calls will return the same initialization promise.
 * inspired by https://github.com/ChainSafe/WebZjs/blob/main/packages/e2e-tests/src/index.js
 */
export const initWebZjs = async (
  webzJsWallet: typeof WebZjsWallet,
  webzJsKeys: typeof WebZjsKeys
): Promise<void> => {
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
        const threadCount =
          typeof navigator !== 'undefined' && navigator.hardwareConcurrency
            ? navigator.hardwareConcurrency
            : 4;

        const initThreadPool = webzJsWallet.initThreadPool;
        await initThreadPool(threadCount);
      }

      wasmInitialized = true;
    } catch (error) {
      initializationPromise = null;
      throw new Error(`Failed to initialize WebZjs WASM: ${error as string}`);
    }
  })();

  return initializationPromise;
};
