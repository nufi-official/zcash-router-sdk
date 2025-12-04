/**
 * Storage for Zcash account birthday blocks
 *
 * Stores birthday blocks in localStorage keyed by account fingerprint and index
 * to avoid re-syncing from scratch on subsequent logins
 */

interface BirthdayBlockRecord {
  birthdayBlock: number;
  timestamp: number;
}

const STORAGE_KEY_PREFIX = 'zcash_birthday_block';

/**
 * Generate storage key for an account
 */
function getStorageKey(fingerprintHex: string, accountIndex: number): string {
  return `${STORAGE_KEY_PREFIX}_${fingerprintHex}_${accountIndex}`;
}

/**
 * Get stored birthday block for an account
 *
 * @param fingerprintHex - Seed fingerprint as hex string
 * @param accountIndex - Account index
 * @returns Birthday block number or null if not found
 */
export function getBirthdayBlock(
  fingerprintHex: string,
  accountIndex: number
): number | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const key = getStorageKey(fingerprintHex, accountIndex);
  const stored = localStorage.getItem(key);

  if (!stored) {
    return null;
  }

  try {
    const record = JSON.parse(stored) as BirthdayBlockRecord;
    return record.birthdayBlock;
  } catch {
    // Invalid JSON, remove it
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Store birthday block for an account
 *
 * @param fingerprintHex - Seed fingerprint as hex string
 * @param accountIndex - Account index
 * @param birthdayBlock - Birthday block number to store
 */
export function setBirthdayBlock(
  fingerprintHex: string,
  accountIndex: number,
  birthdayBlock: number
): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const key = getStorageKey(fingerprintHex, accountIndex);
  const record: BirthdayBlockRecord = {
    birthdayBlock,
    timestamp: Date.now(),
  };

  localStorage.setItem(key, JSON.stringify(record));
}

/**
 * Clear stored birthday block for an account
 *
 * @param fingerprintHex - Seed fingerprint as hex string
 * @param accountIndex - Account index
 */
export function clearBirthdayBlock(
  fingerprintHex: string,
  accountIndex: number
): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const key = getStorageKey(fingerprintHex, accountIndex);
  localStorage.removeItem(key);
}

/**
 * Clear all stored birthday blocks
 */
export function clearAllBirthdayBlocks(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
