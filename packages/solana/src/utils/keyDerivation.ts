import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Keypair } from '@solana/web3.js';

const bip32 = BIP32Factory(ecc);

/**
 * Solana uses BIP44 with coin type 501
 * Derivation path: m/44'/501'/account'/change'
 */
const SOLANA_COIN_TYPE = 501;

/**
 * Derive a Solana keypair from a mnemonic phrase
 * @param mnemonic - BIP39 mnemonic phrase
 * @param accountIndex - Account index (default: 0)
 * @param change - Change index (default: 0)
 * @returns Solana Keypair
 */
export function deriveKeypairFromMnemonic(
  mnemonic: string,
  accountIndex: number = 0,
  change: number = 0
): Keypair {
  // Validate mnemonic
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  // Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // Derive the path: m/44'/501'/account'/change'
  const path = `m/44'/${SOLANA_COIN_TYPE}'/${accountIndex}'/${change}'`;

  // Derive the key
  const derivedKey = bip32.fromSeed(seed).derivePath(path);

  if (!derivedKey.privateKey) {
    throw new Error('Failed to derive private key');
  }

  // Create Solana keypair from the derived private key
  return Keypair.fromSeed(derivedKey.privateKey.slice(0, 32));
}

/**
 * Get Solana address from keypair
 * @param keypair - Solana Keypair
 * @returns Base58 encoded public key (address)
 */
export function getAddressFromKeypair(keypair: Keypair): string {
  return keypair.publicKey.toBase58();
}

/**
 * Derive a Solana address directly from mnemonic
 * @param mnemonic - BIP39 mnemonic phrase
 * @param accountIndex - Account index (default: 0)
 * @returns Solana address (base58 encoded)
 */
export function deriveAddressFromMnemonic(
  mnemonic: string,
  accountIndex: number = 0
): string {
  const keypair = deriveKeypairFromMnemonic(mnemonic, accountIndex);
  return getAddressFromKeypair(keypair);
}
