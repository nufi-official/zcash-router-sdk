import { ReactNode } from 'react';
import type { AccountFull } from '@zcash-router-sdk/core';
interface AccountContextType {
    solanaAccount: AccountFull | null;
    zcashTransparentAccount: AccountFull | null;
    zcashShieldedAccount: AccountFull | null;
    isLoading: boolean;
    error: string | null;
}
interface AccountProviderProps {
    children: ReactNode;
    mnemonic: string;
}
export declare function AccountProvider({ children, mnemonic }: AccountProviderProps): import("react").JSX.Element;
export declare function useAccounts(): AccountContextType;
export {};
//# sourceMappingURL=AccountContext.d.ts.map