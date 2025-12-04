import { TextField } from '@mui/material';
import { AMOUNT_INPUT_STYLES } from './constants';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export function AmountInput({ value, onChange, error, disabled }: AmountInputProps) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="number"
      placeholder="0"
      variant="standard"
      error={error}
      disabled={disabled}
      slotProps={{
        input: {
          disableUnderline: true,
          sx: AMOUNT_INPUT_STYLES,
        },
        htmlInput: {
          step: '0.000000001',
          min: '0',
        },
      }}
    />
  );
}
