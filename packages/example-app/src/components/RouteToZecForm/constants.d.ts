export declare const CARVED_BOX_STYLES: {
    readonly border: "1px solid rgba(0, 0, 0, 0.5)";
    readonly borderRadius: 3;
    readonly backgroundColor: "rgba(0, 0, 0, 0.6)";
    readonly boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(0, 0, 0, 0.9)";
};
export declare const SLIDE_DOWN_ANIMATION: {
    readonly animation: "slideDown 2s ease-out";
    readonly '@keyframes slideDown': {
        readonly '0%': {
            readonly opacity: 0;
            readonly transform: "translateY(-20px)";
            readonly maxHeight: 0;
        };
        readonly '100%': {
            readonly opacity: 1;
            readonly transform: "translateY(0)";
            readonly maxHeight: "500px";
        };
    };
};
export declare const AMOUNT_INPUT_STYLES: {
    readonly fontSize: "2.5rem";
    readonly fontWeight: 500;
    readonly color: "white";
    readonly '& input': {
        readonly padding: 0;
    };
    readonly '& input::placeholder': {
        readonly color: "rgba(255, 255, 255, 0.3)";
        readonly opacity: 1;
    };
    readonly '& input[type=number]': {
        readonly MozAppearance: "textfield";
    };
    readonly '& input[type=number]::-webkit-outer-spin-button': {
        readonly WebkitAppearance: "none";
        readonly margin: 0;
    };
    readonly '& input[type=number]::-webkit-inner-spin-button': {
        readonly WebkitAppearance: "none";
        readonly margin: 0;
    };
};
//# sourceMappingURL=constants.d.ts.map