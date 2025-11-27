import type { WebZjsKeys, WebZjsWallet } from './types';
import { initWebZjs } from './wasmInit';

export let webzJsWallet: typeof WebZjsWallet;
export let webzJsKeys: typeof WebZjsKeys;

export const loadAndInitWebZjs = async (): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  webzJsWallet = await import('@chainsafe/webzjs-wallet');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  webzJsKeys = await import('@chainsafe/webzjs-keys');
  await initWebZjs(webzJsWallet, webzJsKeys);
};
