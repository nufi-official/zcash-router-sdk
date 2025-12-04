export const checkStatusResponse = [
    'KNOWN_DEPOSIT_TX',
    'PENDING_DEPOSIT',
    'INCOMPLETE_DEPOSIT',
    'PROCESSING',
    'SUCCESS',
    'REFUNDED',
    'FAILED',
];
export const SWAP_HAPPY_PATH_TIMELINE = [
    'PENDING_DEPOSIT',
    'KNOWN_DEPOSIT_TX',
    'PROCESSING',
    'SUCCESS',
];
export const SWAP_END_STATES = new Set([
    'SUCCESS',
    'FAILED',
    'REFUNDED',
]);
//# sourceMappingURL=swapApi.js.map