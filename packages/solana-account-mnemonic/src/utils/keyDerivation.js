import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';
const SOLANA_COIN_TYPE = 501;
export function deriveKeypairFromMnemonic(mnemonic, accountIndex = 0, change = 0) {
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
    }
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const path = `m/44'/${SOLANA_COIN_TYPE}'/${accountIndex}'/${change}'`;
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
    return new Keypair(keyPair);
}
export function getAddressFromKeypair(keypair) {
    return keypair.publicKey.toBase58();
}
export function deriveAddressFromMnemonic(mnemonic, accountIndex = 0) {
    const keypair = deriveKeypairFromMnemonic(mnemonic, accountIndex);
    return getAddressFromKeypair(keypair);
}
//# sourceMappingURL=keyDerivation.js.map