export const ensure = (value) => {
    if (value === undefined) {
        throw new Error('Value is undefined');
    }
    return value;
};
//# sourceMappingURL=utils.js.map