/**
 * Test setup file for vitest
 * This file runs before all tests to set up the test environment
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

import initKeysWasm from '@chainsafe/webzjs-keys';
// eslint-disable-next-line import/no-extraneous-dependencies
import Worker from 'web-worker';

// Polyfill Worker for Node.js test environment
if (typeof globalThis.Worker === 'undefined') {
  (globalThis as unknown as { Worker: typeof Worker }).Worker = Worker;
}

// Polyfill for WASM environment
if (typeof globalThis.self === 'undefined') {
  (globalThis as unknown as { self: typeof globalThis }).self = globalThis;
}

// Polyfill String.prototype.normalize for happy-dom
// This is needed by bip39 library
if (!String.prototype.normalize) {
  String.prototype.normalize = function () {
    return this.toString();
  };
}

// Mock addEventListener for Web Worker polyfill
if (typeof globalThis.addEventListener === 'undefined') {
  (globalThis as unknown as { addEventListener: () => void }).addEventListener =
    () => {};
}

// Disable WebAssembly.instantiateStreaming in Node.js test environment
// This forces the WASM loader to use the arrayBuffer() fallback path
(
  WebAssembly as unknown as { instantiateStreaming: undefined }
).instantiateStreaming = undefined;

// Setup fetch polyfill for WASM loading and network requests in Node.js
// This allows the WASM module to load properly and make network requests during tests
const originalFetch = globalThis.fetch;
(
  globalThis as unknown as {
    fetch: (
      url: string | URL | Request,
      init?: RequestInit
    ) => Promise<Response>;
  }
).fetch = async (url: string | URL | Request, init?: RequestInit) => {
  // Extract URL string from Request object or URL
  let urlString: string;
  if (url instanceof Request) {
    urlString = url.url;
  } else {
    urlString = url.toString();
  }

  // Allow real network requests to lightwalletd
  if (
    urlString.includes('zcash-mainnet.chainsafe.dev') ||
    urlString.includes('lightwalletd')
  ) {
    // Use the original fetch for network requests
    if (originalFetch) {
      return originalFetch(url, init);
    }
  }

  // Handle WebZjs WASM file loading
  let wasmFileName: string | null = null;

  if (urlString.includes('webzjs_wallet_bg.wasm')) {
    wasmFileName = 'webzjs-wallet/webzjs_wallet_bg.wasm';
  } else if (urlString.includes('webzjs_keys_bg.wasm')) {
    wasmFileName = 'webzjs-keys/webzjs_keys_bg.wasm';
  } else if (urlString.includes('file://')) {
    // Handle file:// URLs by extracting the WASM filename
    if (urlString.includes('webzjs_wallet_bg.wasm')) {
      wasmFileName = 'webzjs-wallet/webzjs_wallet_bg.wasm';
    } else if (urlString.includes('webzjs_keys_bg.wasm')) {
      wasmFileName = 'webzjs-keys/webzjs_keys_bg.wasm';
    }
  }

  if (wasmFileName) {
    // Load WASM file from the local WebZjs package
    // Try to find the WASM file by resolving from the package location
    let wasmPath: string;
    try {
      // First try to resolve the package itself
      const packageName = wasmFileName.split('/')[0];
      const packagePath = require.resolve(`@chainsafe/${packageName}/package.json`);
      const packageDir = packagePath.replace('/package.json', '');
      wasmPath = resolve(packageDir, wasmFileName.split('/')[1]);
    } catch {
      // Fallback to relative path
      wasmPath = resolve(
        __dirname,
        `../../node_modules/@chainsafe/${wasmFileName}`
      );
    }
    const wasmBuffer = readFileSync(wasmPath);
    // Convert Node.js Buffer to ArrayBuffer
    const arrayBuffer = wasmBuffer.buffer.slice(
      wasmBuffer.byteOffset,
      wasmBuffer.byteOffset + wasmBuffer.byteLength
    );

    // Return a proper Response object using Node.js's built-in Response
    return new Response(arrayBuffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/wasm',
      },
    });
  }

  throw new Error(`Unsupported fetch URL in tests: ${urlString}`);
};

// Initialize webzjs-keys WASM before tests run
await initKeysWasm();
