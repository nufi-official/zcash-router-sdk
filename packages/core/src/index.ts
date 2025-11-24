import type { AssetRouteConfig, AssetRouteResult } from './types';

export type { AssetRouteConfig, AssetRouteResult };

/**
 * AssetRouteSDK - A TypeScript SDK for asset routing
 *
 * @example
 * ```typescript
 * const sdk = new AssetRouteSDK({ baseUrl: 'https://api.example.com' });
 * const result = await sdk.route('/assets/image.png');
 * ```
 */
export class AssetRouteSDK {
  private config: Required<AssetRouteConfig>;

  /**
   * Creates a new instance of AssetRouteSDK
   *
   * @param config - Configuration options
   */
  constructor(config: AssetRouteConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      timeout: config.timeout ?? 5000,
      headers: config.headers ?? {},
    };
  }

  /**
   * Routes an asset request
   *
   * @param path - The asset path to route
   * @returns A promise that resolves to the route result
   */
  async route(path: string): Promise<AssetRouteResult> {
    try {
      // Example implementation - replace with your actual logic
      const url = `${this.config.baseUrl}${path}`;

      return {
        success: true,
        data: { url, path },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Gets the current configuration
   *
   * @returns The current configuration
   */
  getConfig(): Readonly<Required<AssetRouteConfig>> {
    return { ...this.config };
  }

  /**
   * Updates the configuration
   *
   * @param config - Partial configuration to update
   */
  updateConfig(config: Partial<AssetRouteConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      headers: {
        ...this.config.headers,
        ...(config.headers ?? {}),
      },
    };
  }
}

/**
 * Creates a new AssetRouteSDK instance
 *
 * @param config - Configuration options
 * @returns A new AssetRouteSDK instance
 */
export function createAssetRouteSDK(
  config: AssetRouteConfig
): AssetRouteSDK {
  return new AssetRouteSDK(config);
}

// Default export
export default AssetRouteSDK;
