import { Box, TextField, MenuItem } from '@mui/material';
import { SolanaIcon } from './SolanaIcon';

interface AssetSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const renderValue = (value: unknown) => {
  const val = value as string;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        fontSize: '1.25rem',
        fontWeight: 600,
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {val === 'SOL' && <SolanaIcon size={28} />}
      {val}
    </Box>
  );
};

const IconComponent = (props: any) => (
  <Box
    {...props}
    sx={{
      color: '#F3B724',
      transition: 'transform 0.2s ease',
      transform: props.className?.includes('MuiSelect-iconOpen')
        ? 'rotate(180deg)'
        : 'rotate(0)',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
      top: '50%',
      pointerEvents: 'none',
      marginTop: '-5px',
    }}
  >
    ▼
  </Box>
);

export function AssetSelect({ value, onChange, disabled }: AssetSelectProps) {
  return (
    <TextField
      sx={{ minWidth: 140 }}
      select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="standard"
      disabled={disabled}
      slotProps={{
        input: {
          disableUnderline: true,
          sx: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'white',
            minWidth: 160,
          },
        },
        select: {
          renderValue,
          IconComponent,
          sx: {
            backgroundColor: 'transparent',
            borderRadius: 3,
            px: 3,
            py: 1.5,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            '&:focus': {
              backgroundColor: 'transparent',
            },
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
        },
      }}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            sx: {
              backgroundColor: '#000000',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderTop: 'none',
              borderRadius: '0 0 24px 24px',
              marginTop: '-8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              '& .MuiList-root': {
                paddingTop: 0,
              },
            },
          },
        },
      }}
    >
      <MenuItem
        value="SOL"
        sx={{
          fontSize: '1.25rem',
          py: 1.5,
          backgroundColor: '#000000',
          color: 'white',
          '&:hover': {
            backgroundColor: '#000000',
            color: '#F3B724',
          },
          '&.Mui-selected': {
            backgroundColor: '#000000',
            color: 'white',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#F3B724',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SolanaIcon size={28} />
          SOL
        </Box>
      </MenuItem>
    </TextField>
  );
}
