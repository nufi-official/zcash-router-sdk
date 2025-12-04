import { swapApi } from './swapApi/application';
export * from './toZcash';
export * from './fromZcash';
export * from './types';
export * from './swapApi';
export { swapApi };
export const getSwapApiAssets = async () => {
    return await swapApi.getTokens();
};
export const getSwapQuote = async (params) => {
    return await swapApi.getQuote(params);
};
//# sourceMappingURL=index.js.map