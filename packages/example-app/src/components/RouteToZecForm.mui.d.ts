interface RouteToZecFormProps {
    addressType: 'transparent' | 'shielded';
    mnemonic: string;
    onConnectClick?: () => void;
    onRefreshBalance?: (refresh: () => void) => void;
    onRefreshAllBalances?: () => void;
}
export declare function RouteToZecForm({ addressType, mnemonic, onConnectClick, onRefreshBalance, onRefreshAllBalances, }: RouteToZecFormProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=RouteToZecForm.mui.d.ts.map