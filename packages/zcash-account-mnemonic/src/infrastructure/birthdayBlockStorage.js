const STORAGE_KEY_PREFIX = 'zcash_birthday_block';
function getStorageKey(fingerprintHex, accountIndex) {
    return `${STORAGE_KEY_PREFIX}_${fingerprintHex}_${accountIndex}`;
}
export function getBirthdayBlock(fingerprintHex, accountIndex) {
    if (typeof localStorage === 'undefined') {
        return null;
    }
    const key = getStorageKey(fingerprintHex, accountIndex);
    const stored = localStorage.getItem(key);
    if (!stored) {
        return null;
    }
    try {
        const record = JSON.parse(stored);
        return record.birthdayBlock;
    }
    catch {
        localStorage.removeItem(key);
        return null;
    }
}
export function setBirthdayBlock(fingerprintHex, accountIndex, birthdayBlock) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    const key = getStorageKey(fingerprintHex, accountIndex);
    const record = {
        birthdayBlock,
        timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(record));
}
export function clearBirthdayBlock(fingerprintHex, accountIndex) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    const key = getStorageKey(fingerprintHex, accountIndex);
    localStorage.removeItem(key);
}
export function clearAllBirthdayBlocks() {
    if (typeof localStorage === 'undefined') {
        return;
    }
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_KEY_PREFIX)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
}
//# sourceMappingURL=birthdayBlockStorage.js.map