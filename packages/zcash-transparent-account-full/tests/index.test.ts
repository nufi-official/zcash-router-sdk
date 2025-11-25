import { describe, it, expect } from 'vitest';
import { VERSION } from '../src/index';

describe('@asset-route-sdk/zcash-transparent-account-full', () => {
  it('should export VERSION', () => {
    expect(VERSION).toBe('0.1.0');
  });
});
