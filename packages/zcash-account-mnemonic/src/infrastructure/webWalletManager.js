import { ensure } from '../utils';
import { webzJsWallet } from './chainsafe-webzjs-wrapper';
import { getBirthdayBlock, setBirthdayBlock } from './birthdayBlockStorage';
export class WebWalletManagerImpl {
    constructor(config) {
        this.wallet = null;
        this.accountIdCache = new Map();
        this.pendingSync = null;
        this.pendingImports = new Map();
        this.config = config;
    }
    async getOrCreateWallet() {
        if (!this.wallet) {
            this.wallet = new webzJsWallet.WebWallet(this.config.network, this.config.lightwalletdUrl, this.config.minConfirmations);
        }
        return this.wallet;
    }
    async getCurrentBlockHeight() {
        const wallet = await this.getOrCreateWallet();
        try {
            const latestBlock = await wallet.get_latest_block();
            return latestBlock - BigInt(20);
        }
        catch (error) {
        }
        return BigInt(1);
    }
    async importOrGetAccount(account) {
        const ufvk = account.unifiedFullViewingKey;
        const accountName = `wallet-${account.seedFingerprintHex}-account-${account.accountIndex}`;
        const seedFingerprint = new Uint8Array(Buffer.from(account.seedFingerprintHex, 'hex'));
        const accountIndex = account.accountIndex;
        const cacheKey = `${Buffer.from(seedFingerprint).toString('hex')}-${accountIndex}`;
        const cachedAccountId = this.accountIdCache.get(cacheKey);
        if (cachedAccountId !== undefined) {
            return cachedAccountId;
        }
        const pendingImport = this.pendingImports.get(cacheKey);
        if (pendingImport) {
            return pendingImport;
        }
        const importPromise = (async () => {
            try {
                let birthdayHeight = getBirthdayBlock(account.seedFingerprintHex, accountIndex);
                if (birthdayHeight === null) {
                    const currentHeight = await this.getCurrentBlockHeight();
                    birthdayHeight = Number(currentHeight.toString()) - 1000;
                    setBirthdayBlock(account.seedFingerprintHex, accountIndex, birthdayHeight);
                }
                const wallet = await this.getOrCreateWallet();
                const sfp = webzJsWallet.SeedFingerprint.from_bytes(seedFingerprint);
                const accountId = await wallet.create_account_ufvk(accountName, ufvk, sfp, accountIndex, birthdayHeight);
                this.accountIdCache.set(cacheKey, accountId);
                return accountId;
            }
            finally {
                this.pendingImports.delete(cacheKey);
            }
        })();
        this.pendingImports.set(cacheKey, importPromise);
        return importPromise;
    }
    async sync() {
        const wallet = await this.getOrCreateWallet();
        if (this.accountIdCache.size === 0) {
            return Promise.resolve();
        }
        if (this.pendingSync) {
            return this.pendingSync;
        }
        this.pendingSync = (async () => {
            try {
                await wallet.sync();
            }
            finally {
                this.pendingSync = null;
            }
        })();
        return this.pendingSync;
    }
    async getCurrentAddress(account) {
        const accountId = await this.importOrGetAccount(account);
        const wallet = await this.getOrCreateWallet();
        return (await wallet.get_current_address(accountId));
    }
    async getCurrentTransparentAddress(account) {
        const accountId = await this.importOrGetAccount(account);
        const wallet = await this.getOrCreateWallet();
        return (await wallet.get_current_address_transparent(accountId));
    }
    async createPczt(account, toAddress, amount) {
        const accountId = await this.importOrGetAccount(account);
        const wallet = await this.getOrCreateWallet();
        await this.sync();
        const pczt = await wallet.pczt_create(accountId, toAddress, BigInt(amount.toString()));
        try {
            const pcztBytes = pczt.serialize();
            return Buffer.from(pcztBytes).toString('hex');
        }
        finally {
            pczt.free();
        }
    }
    async createShieldPczt(account) {
        const accountId = await this.importOrGetAccount(account);
        const wallet = await this.getOrCreateWallet();
        await this.sync();
        const pczt = await wallet.pczt_shield(accountId);
        try {
            const pcztBytes = pczt.serialize();
            return Buffer.from(pcztBytes).toString('hex');
        }
        finally {
            pczt.free();
        }
    }
    async provePczt(signedPcztHex) {
        const wallet = await this.getOrCreateWallet();
        await this.sync();
        const pcztBytes = new Uint8Array(Buffer.from(signedPcztHex, 'hex'));
        const pczt = webzJsWallet.Pczt.from_bytes(pcztBytes);
        const provedPczt = await wallet.pczt_prove(pczt);
        try {
            const provedPcztBytes = provedPczt.serialize();
            return Buffer.from(provedPcztBytes).toString('hex');
        }
        finally {
            if (provedPczt && typeof provedPczt.free === 'function') {
                provedPczt.free();
            }
        }
    }
    async submitTransaction(provedPcztHex) {
        const wallet = await this.getOrCreateWallet();
        const pcztBytes = new Uint8Array(Buffer.from(provedPcztHex, 'hex'));
        const pczt = webzJsWallet.Pczt.from_bytes(pcztBytes);
        const txHash = await wallet.pczt_send(pczt);
        return txHash;
    }
    async getAccountBalances(account) {
        const wallet = await this.getOrCreateWallet();
        const accountId = await this.importOrGetAccount(account);
        await this.sync();
        const summary = ensure(await wallet.get_wallet_summary());
        const accountBalances = summary.account_balances;
        const accountBalanceEntry = accountBalances.find(([id]) => id === accountId);
        const [, accountBalance] = ensure(accountBalanceEntry);
        if (!accountBalance) {
            throw new Error(`No balance found for account ${accountId}`);
        }
        const samplingBalance = accountBalance.sapling_balance;
        const orchardBalance = accountBalance.orchard_balance;
        return {
            shieldedBalance: BigInt(samplingBalance + orchardBalance),
            unshieldedBalance: BigInt(accountBalance.unshielded_balance),
        };
    }
    destroy() {
        if (this.wallet && typeof this.wallet.free === 'function') {
            this.wallet.free();
        }
        this.wallet = null;
        this.accountIdCache.clear();
        this.pendingSync = null;
        this.pendingImports.clear();
    }
}
//# sourceMappingURL=webWalletManager.js.map