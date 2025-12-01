import { swapApi } from './swapApi/application';
import type { GetQuoteParams } from './swapApi';

export * from './toZcash';
export * from './fromZcash';
export * from './types';
export * from './swapApi';

export { swapApi };

export const getSwapApiAssets = async () => {
  return await swapApi.getTokens();
};

export const getSwapQuote = async (params: GetQuoteParams) => {
  return await swapApi.getQuote(params);
};
