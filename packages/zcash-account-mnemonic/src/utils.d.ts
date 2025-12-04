export type NewType<name extends string, base = string> = base & {
    [_ in `__NewType_${name}`]: undefined;
};
export declare const ensure: <T>(value: T | undefined) => T;
//# sourceMappingURL=utils.d.ts.map