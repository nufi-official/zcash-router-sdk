import { swapApi } from './swapApi/application';

export * from './toZcash';
export * from './fromZcash';
export * from './types';

export const getSwapApiAssets = async () => {
  return await swapApi.getTokens();
};
