import { describe, it, expect, beforeAll } from 'vitest';
import { loadAndInitWebZjs } from '../chainsafe-webzjs-wrapper';
import { MnemonicCryptoProvider } from '../mnemonicCryptoProvider';
describe('MnemonicCryptoProvider', () => {
    beforeAll(async () => {
        await loadAndInitWebZjs();
    });
    describe('getUnifiedFullViewingKey', () => {
        it('should generate different UFVKs for different account indices', async () => {
            const cryptoProvider = new MnemonicCryptoProvider('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
            const ufvk0 = await cryptoProvider.getUnifiedFullViewingKey(0);
            const ufvk1 = await cryptoProvider.getUnifiedFullViewingKey(1);
            const ufvk2 = await cryptoProvider.getUnifiedFullViewingKey(2);
            expect(ufvk0).toEqual('uview1qggz6nejagvka9wtm9r7xf84kkwy4cc0cgchptr98w0cyz33cj4958q5ulkd32nz2u3s0sp9yhcw7tu2n3nlw9x6ulghyd2zgc857tnzme2zpr3vn24zhtm2rjduv9a5zxlmzz404n7l0k69gmu4tfn2g3vpcn03rhz63e3l92fn8gra37tyly7utvgveswl20vz23pu84rc2nyqess38wvlgr2xzyhgj232ne5qutpe6ql6ghzetdy7pfzcmdzd5gd5dnwk25fwv7nnzmnty7u5ax3nzzgr6pdc905ckpd0s9v2cvn7e03qm7r46e5ngax536ywz7zxjptymm90px0rhvmqtwvttuy6d7degly023lqvskclk6mezyt69dwu6c4tfzrjgq4uuh5xa9m5dclgatykgtrrw268qe5pldfkx73f2kd5yyy2tjpjql92pa6tsk2nh2h88q23nee9z379het4akl6haqmuwf9d0nl0susg4tnxyk');
            expect(ufvk1).toEqual('uview1aw37gtvg5v0sv3spppss0sug348qgfpenz3g6v9y6acs464vtrw9nvl0jj5ks72adhrcvd44pmu7kagrj875ge0xrw84vsj3n2rlztwwp7z8flwjlzjznk4ef5kwqfe8urc7zaqcc4j085zegsgz6azdu0ckwqcx4kyfvcmz3x2vvgq09ru9swtmc09249a7s9d38pvplfq2nq98twh4cpu98hv6xwwc8f82nlhmz4qkyc2gqmtf75s8ug5kl55r4kwjv88au2ha72p4nqaflr9en8r36ntn3tsetvfzxzchv4lffrp33ae0dq56keqa4wrpnyd03sn8vhz52wzpmy4dxvex08drzpyazg4h75ptex9pnfftk96rej6a879slcmpu0vnlvyd49md0gmd59gr2ne8v4tgl6eg7ht3mqvrvk6qcwx7s5qeemyal30q5ae8rjsceqdu9vs7llwlyxjh8clj6e5kg3ejfpjj74qxtwnnt59dzasc');
            expect(ufvk2).toEqual('uview15dg7myukga8alkuukqr4r7g8404j7u8ytdgcscx09rqglfhjruehk2pt2p05fjyp7quf0ftdgjp0kc4x2dtc030zxgps35k8twqu2mg98e8t0ldzggd83qjtjnzty3y2lpaahuvnph8t0kvlq4zyzyzuxle56paaymscnktg5kryc6e82s6ay9slu96g8e7gsgczph8dg6vcs42my5xk68qmjcq4s0k762uav7arjyjaspu7xzr64y8nnla2gzzw7cx5dnzm8nc99mjwex7wqxj3ps0d2d6flfewd48usds0werd6m6shnnet4q5z4h0rqc09gtwevmzgl3r400ygcr9rx22dzetd0wdtnuwjtw2nqytjhv78rgfxrgy073y6j6z47wfsldgtxjay4vxkqffc00dffjkpptfa3l8npwzqtqwhja0ewl40chf96krk4jqp66z0jlds02qg80dxweg5us32gzjgrvf94ssvlmjkqtfhvmwnuj3');
        });
    });
    describe('getSeedFingerprint', () => {
        it('should generate seed fingerprint', async () => {
            const cryptoProvider = new MnemonicCryptoProvider('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
            const seedFingerprintHex = await cryptoProvider.getSeedFingerprint();
            expect(seedFingerprintHex).toEqual('21ed3d7882c7e37fe012b54a6408048048cb09782d4b2938617da793ccd27815');
        });
    });
});
//# sourceMappingURL=mnemonicCryptoProvider.test.js.map