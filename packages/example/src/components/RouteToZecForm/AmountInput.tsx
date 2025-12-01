import { TextField } from '@mui/material';
import { AMOUNT_INPUT_STYLES } from './constants';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function AmountInput({ value, onChange, error }: AmountInputProps) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="number"
      placeholder="0"
      variant="standard"
      error={error}
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
