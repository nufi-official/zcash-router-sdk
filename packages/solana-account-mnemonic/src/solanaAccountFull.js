import { Connection, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, } from '@solana/web3.js';
import { deriveKeypairFromMnemonic } from './utils/keyDerivation';
export class SolanaAccountFull {
    constructor(params) {
        this.type = 'full';
        this.getAddress = async () => {
            if (this.cachedAddress) {
                return this.cachedAddress;
            }
            const keypair = this.getKeypair();
            this.cachedAddress = keypair.publicKey.toBase58();
            return this.cachedAddress;
        };
        this.getBalance = async () => {
            try {
                const keypair = this.getKeypair();
                const publicKey = keypair.publicKey;
                const balance = await this.connection.getBalance(publicKey);
                const FEE_RESERVE = 3000000n;
                const balanceBigInt = BigInt(balance);
                return balanceBigInt > FEE_RESERVE ? balanceBigInt - FEE_RESERVE : 0n;
            }
            catch (error) {
                throw new Error(`Failed to fetch Solana balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        };
        this.assetToBaseUnits = (amount) => {
            const amountFloat = parseFloat(amount);
            if (isNaN(amountFloat) || amountFloat < 0) {
                throw new Error(`Invalid amount: ${amount}`);
            }
            const [whole = '0', decimal = ''] = amount.split('.');
            const paddedDecimal = decimal.padEnd(9, '0').slice(0, 9);
            const lamportsStr = whole + paddedDecimal;
            return BigInt(lamportsStr);
        };
        this.sendDeposit = async ({ address, amount, }) => {
            const amountLamports = BigInt(amount);
            if (amountLamports <= 0n) {
                throw new Error(`Invalid amount: ${amount}`);
            }
            const keypair = this.getKeypair();
            const fromPubkey = keypair.publicKey;
            const toPubkey = new PublicKey(address);
            const balance = await this.getBalance();
            if (balance < amountLamports) {
                throw new Error(`Insufficient balance. Required: ${amountLamports}, Available: ${balance}`);
            }
            const transaction = new Transaction().add(SystemProgram.transfer({
                fromPubkey,
                toPubkey,
                lamports: Number(amountLamports),
            }));
            const signature = await sendAndConfirmTransaction(this.connection, transaction, [keypair], {
                commitment: 'confirmed',
            });
            return signature;
        };
        this.mnemonic = params.mnemonic;
        this.accountIndex = params.accountIndex;
        this.network = params.network;
        const rpcUrl = params.rpcUrl || this.getDefaultRpcUrl();
        this.connection = new Connection(rpcUrl, 'confirmed');
        this.asset = {
            blockchain: 'sol',
            tokenId: params.tokenId,
        };
    }
    getDefaultRpcUrl() {
        switch (this.network) {
            case 'mainnet':
                return 'https://solana-mainnet.nu.fi';
            default:
                throw new Error(`Unsupported network: ${this.network}`);
        }
    }
    getKeypair() {
        if (this.cachedKeypair) {
            return this.cachedKeypair;
        }
        const keypair = deriveKeypairFromMnemonic(this.mnemonic, this.accountIndex);
        this.cachedKeypair = keypair;
        return keypair;
    }
}
//# sourceMappingURL=solanaAccountFull.js.map