import { readFileSync } from 'fs';
import { resolve } from 'path';
import initKeysWasm from '@chainsafe/webzjs-keys';
import Worker from 'web-worker';
if (typeof globalThis.Worker === 'undefined') {
    globalThis.Worker = Worker;
}
if (typeof globalThis.self === 'undefined') {
    globalThis.self = globalThis;
}
if (!String.prototype.normalize) {
    String.prototype.normalize = function () {
        return this.toString();
    };
}
if (typeof globalThis.addEventListener === 'undefined') {
    globalThis.addEventListener =
        () => { };
}
WebAssembly.instantiateStreaming = undefined;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
    let urlString;
    if (url instanceof Request) {
        urlString = url.url;
    }
    else {
        urlString = url.toString();
    }
    if (urlString.includes('zcash-mainnet.chainsafe.dev') ||
        urlString.includes('lightwalletd')) {
        if (originalFetch) {
            return originalFetch(url, init);
        }
    }
    let wasmFileName = null;
    if (urlString.includes('webzjs_wallet_bg.wasm')) {
        wasmFileName = 'webzjs-wallet/webzjs_wallet_bg.wasm';
    }
    else if (urlString.includes('webzjs_keys_bg.wasm')) {
        wasmFileName = 'webzjs-keys/webzjs_keys_bg.wasm';
    }
    else if (urlString.includes('file://')) {
        if (urlString.includes('webzjs_wallet_bg.wasm')) {
            wasmFileName = 'webzjs-wallet/webzjs_wallet_bg.wasm';
        }
        else if (urlString.includes('webzjs_keys_bg.wasm')) {
            wasmFileName = 'webzjs-keys/webzjs_keys_bg.wasm';
        }
    }
    if (wasmFileName) {
        let wasmPath;
        try {
            const packageName = wasmFileName.split('/')[0];
            const packagePath = require.resolve(`@chainsafe/${packageName}/package.json`);
            const packageDir = packagePath.replace('/package.json', '');
            wasmPath = resolve(packageDir, wasmFileName.split('/')[1]);
        }
        catch {
            wasmPath = resolve(__dirname, `../../node_modules/@chainsafe/${wasmFileName}`);
        }
        const wasmBuffer = readFileSync(wasmPath);
        const arrayBuffer = wasmBuffer.buffer.slice(wasmBuffer.byteOffset, wasmBuffer.byteOffset + wasmBuffer.byteLength);
        return new Response(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/wasm',
            },
        });
    }
    throw new Error(`Unsupported fetch URL in tests: ${urlString}`);
};
await initKeysWasm();
//# sourceMappingURL=vitest.setup.js.map