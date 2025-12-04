/// <reference types="vite/client" />

import type { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: NodeJS.Process;
    global: typeof globalThis;
  }

  var Buffer: typeof import('buffer').Buffer;
  var process: NodeJS.Process;
  var global: typeof globalThis;
}

export {};
