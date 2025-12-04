const ZCASH_DECIMALS = 8;
const ZATOSHIS_PER_ZEC = BigInt(10) ** BigInt(8);
export const zecToZatoshis = (zec) => {
    if (typeof zec === 'bigint') {
        return (zec * ZATOSHIS_PER_ZEC);
    }
    const [whole = '0', fraction = ''] = zec.split('.');
    const paddedFraction = fraction
        .padEnd(ZCASH_DECIMALS, '0')
        .slice(0, ZCASH_DECIMALS);
    const zatoshis = BigInt(whole) * ZATOSHIS_PER_ZEC + BigInt(paddedFraction);
    return zatoshis;
};
export const zatoshisToZec = (zatoshis) => (zatoshis / ZATOSHIS_PER_ZEC).toString();
//# sourceMappingURL=parseUtils.js.map