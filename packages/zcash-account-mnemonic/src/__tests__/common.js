export const TEST_SEED = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
export const createTestSecretProvider = (seed) => {
    return {
        getMnemonic: async () => seed,
        storeMnemonic: async () => {
        },
        clearMnemonic: async () => {
        },
    };
};
//# sourceMappingURL=common.js.map