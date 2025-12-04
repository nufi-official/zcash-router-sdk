interface RouteFromZecFormProps {
    addressType: 'transparent' | 'shielded';
    mnemonic: string;
    onConnectClick?: () => void;
    onRefreshBalance?: (refresh: () => void) => void;
    onRefreshAllBalances?: () => void;
}
export declare function RouteFromZecForm({ addressType, mnemonic, onConnectClick, onRefreshBalance, onRefreshAllBalances, }: RouteFromZecFormProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=RouteFromZecForm.mui.d.ts.map