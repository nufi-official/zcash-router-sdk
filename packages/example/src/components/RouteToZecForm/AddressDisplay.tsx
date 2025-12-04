import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { useState } from 'react';

interface AddressDisplayProps {
  label?: string;
  address: string;
  loading?: boolean;
}

export function AddressDisplay({ label, address, loading = false }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const ellipsizeAddress = (addr: string) => {
    if (!addr) return '';
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  if (loading) {
    return (
      <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7 }}>
        Loading...
      </Typography>
    );
  }

  if (!address) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="caption" sx={{ color: 'white', fontFamily: 'monospace' }}>
        {ellipsizeAddress(address)}
      </Typography>
      <Tooltip title={copied ? 'Copied!' : 'Copy address'}>
        <IconButton
          onClick={handleCopy}
          size="small"
          sx={{
            padding: 0,
            minWidth: 0,
            color: copied ? '#F3B724' : 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: '#F3B724',
              backgroundColor: 'transparent',
            },
          }}
        >
          <CopyIcon sx={{ fontSize: '0.875rem' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
