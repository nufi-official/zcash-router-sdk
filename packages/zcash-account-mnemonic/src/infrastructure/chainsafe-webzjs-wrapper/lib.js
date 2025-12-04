import { initWebZjs } from './wasmInit';
export let webzJsWallet;
export let webzJsKeys;
export const loadAndInitWebZjs = async () => {
    webzJsWallet = await import('@chainsafe/webzjs-wallet');
    webzJsKeys = await import('@chainsafe/webzjs-keys');
    await initWebZjs(webzJsWallet, webzJsKeys);
};
//# sourceMappingURL=lib.js.map