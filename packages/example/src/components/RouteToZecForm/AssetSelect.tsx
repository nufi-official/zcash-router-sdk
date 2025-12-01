import { Box, TextField, MenuItem } from '@mui/material';
import { SolanaIcon } from './SolanaIcon';

interface AssetSelectProps {
  value: string;
  onChange: (value: string) => void;
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
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
      right: -12,
      top: '50%',
      pointerEvents: 'none',
      'margin-right': '14px',
      'margin-top': '-5px',
    }}
  >
    ▼
  </Box>
);

export function AssetSelect({ value, onChange }: AssetSelectProps) {
  return (
    <TextField
      sx={{ minWidth: 140 }}
      select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="standard"
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
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
              backgroundColor: 'rgba(10, 10, 10, 0.98)',
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
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
