// Polyfills for Node.js built-ins in the browser
import { Buffer } from 'buffer';
import process from 'process';

// Set up global polyfills
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).process = process;
  (window as any).global = window;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).process = process;
  (globalThis as any).global = globalThis;
}

// Export to prevent tree-shaking
export { Buffer, process };
