/**
 * Configuration options for the Asset Route SDK
 */
export interface AssetRouteConfig {
  /**
   * Base URL for asset routing
   */
  baseUrl: string;

  /**
   * Optional timeout in milliseconds
   * @default 5000
   */
  timeout?: number;

  /**
   * Optional custom headers
   */
  headers?: Record<string, string>;
}

/**
 * Result of an asset route operation
 */
export interface AssetRouteResult {
  /**
   * Whether the operation was successful
   */
  success: boolean;

  /**
   * Optional data returned from the operation
   */
  data?: unknown;

  /**
   * Optional error message if the operation failed
   */
  error?: string;
}
