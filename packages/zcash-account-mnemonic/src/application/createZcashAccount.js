import { MnemonicCryptoProvider } from '../infrastructure/mnemonicCryptoProvider';
import { getWebWalletManager } from '../infrastructure/webWalletManagerSingleton';
import { ZcashWallet } from '../domain/zcashWallet';
import { ZcashAccount } from './zcashAccount';
export async function createZcashAccount(params) {
    const { mnemonic, accountIndex, network, lightwalletdUrl, minConfirmations, addressType, } = params;
    const mnemonicProvider = new MnemonicCryptoProvider(mnemonic);
    const webWalletManager = getWebWalletManager(network, lightwalletdUrl, minConfirmations);
    const wallet = new ZcashWallet({
        cryptoProviders: { mnemonic: mnemonicProvider },
        webWalletManager,
    });
    const account = await wallet.createAccount({
        accountIndex,
        cryptoProviderType: 'mnemonic',
    });
    return new ZcashAccount({
        wallet,
        account,
        cryptoProviders: { mnemonic: mnemonicProvider },
        webWalletManager,
        addressType,
    });
}
export async function createZcashShieldedAccount(params) {
    return createZcashAccount({
        ...params,
        addressType: 'shielded',
    });
}
export async function createZcashTransparentAccount(params) {
    return createZcashAccount({
        ...params,
        addressType: 'transparent',
    });
}
//# sourceMappingURL=createZcashAccount.js.map