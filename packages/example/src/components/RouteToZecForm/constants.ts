// Styling constants
export const CARVED_BOX_STYLES = {
  border: '1px solid rgba(0, 0, 0, 0.5)',
  borderRadius: 3,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(0, 0, 0, 0.9)',
} as const;

export const SLIDE_DOWN_ANIMATION = {
  animation: 'slideDown 0.8s ease-out',
  '@keyframes slideDown': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-20px)',
      maxHeight: 0,
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
      maxHeight: '500px',
    },
  },
} as const;

export const AMOUNT_INPUT_STYLES = {
  fontSize: '2.5rem',
  fontWeight: 500,
  color: 'white',
  '& input': {
    padding: 0,
  },
  '& input::placeholder': {
    color: 'rgba(255, 255, 255, 0.3)',
    opacity: 1,
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
} as const;
