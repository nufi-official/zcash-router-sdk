import { describe, it, expect, beforeEach } from 'vitest';
import { AssetRouteSDK, createAssetRouteSDK } from '../src/index';
import type { AssetRouteConfig } from '../src/types';

describe('AssetRouteSDK', () => {
  let sdk: AssetRouteSDK;
  const config: AssetRouteConfig = {
    baseUrl: 'https://api.example.com',
    timeout: 3000,
    headers: {
      'X-API-Key': 'test-key',
    },
  };

  beforeEach(() => {
    sdk = new AssetRouteSDK(config);
  });

  describe('constructor', () => {
    it('should create an instance with the provided config', () => {
      expect(sdk).toBeInstanceOf(AssetRouteSDK);
    });

    it('should use default timeout if not provided', () => {
      const sdkWithDefaults = new AssetRouteSDK({
        baseUrl: 'https://api.example.com',
      });
      const config = sdkWithDefaults.getConfig();
      expect(config.timeout).toBe(5000);
    });

    it('should use empty headers if not provided', () => {
      const sdkWithDefaults = new AssetRouteSDK({
        baseUrl: 'https://api.example.com',
      });
      const config = sdkWithDefaults.getConfig();
      expect(config.headers).toEqual({});
    });
  });

  describe('route', () => {
    it('should return a successful result', async () => {
      const result = await sdk.route('/assets/image.png');
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should construct the correct URL', async () => {
      const result = await sdk.route('/assets/image.png');
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('url');
      expect((result.data as { url: string }).url).toBe(
        'https://api.example.com/assets/image.png'
      );
    });
  });

  describe('getConfig', () => {
    it('should return the current configuration', () => {
      const currentConfig = sdk.getConfig();
      expect(currentConfig.baseUrl).toBe(config.baseUrl);
      expect(currentConfig.timeout).toBe(config.timeout);
      expect(currentConfig.headers).toEqual(config.headers);
    });

    it('should return a copy of the config', () => {
      const currentConfig = sdk.getConfig();
      expect(currentConfig).not.toBe(sdk.getConfig());
    });
  });

  describe('updateConfig', () => {
    it('should update the base URL', () => {
      sdk.updateConfig({ baseUrl: 'https://new-api.example.com' });
      const config = sdk.getConfig();
      expect(config.baseUrl).toBe('https://new-api.example.com');
    });

    it('should update the timeout', () => {
      sdk.updateConfig({ timeout: 10000 });
      const config = sdk.getConfig();
      expect(config.timeout).toBe(10000);
    });

    it('should merge headers', () => {
      sdk.updateConfig({
        headers: {
          'X-Another-Header': 'value',
        },
      });
      const config = sdk.getConfig();
      expect(config.headers).toEqual({
        'X-API-Key': 'test-key',
        'X-Another-Header': 'value',
      });
    });
  });
});

describe('createAssetRouteSDK', () => {
  it('should create an AssetRouteSDK instance', () => {
    const sdk = createAssetRouteSDK({ baseUrl: 'https://api.example.com' });
    expect(sdk).toBeInstanceOf(AssetRouteSDK);
  });
});
