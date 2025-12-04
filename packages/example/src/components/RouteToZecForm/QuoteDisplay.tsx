import { useState } from 'react';
import { Box, Typography, Divider, Alert, IconButton, Tooltip } from '@mui/material';
import { Info as InfoIcon, ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';
import type { SwapQuoteResponse } from '@zcash-router-sdk/core';
import { CARVED_BOX_STYLES } from './constants';

interface QuoteDisplayProps {
  quote: SwapQuoteResponse | null;
  sourceSymbol: string;
  destinationSymbol: string;
}

export function QuoteDisplay({ quote, sourceSymbol, destinationSymbol }: QuoteDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!quote) return null;

  const depositAddress = quote.quote.depositAddress;

  const handleCopy = async () => {
    if (!depositAddress) return;

    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <InfoIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Swap Quote
        </Typography>
      </Box>

      <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Deposit Address */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Deposit Address ({sourceSymbol})
          </Typography>
          <Tooltip title={copied ? 'Copied!' : 'Copy address'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ color: copied ? 'success.main' : 'text.secondary' }}
            >
              {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            p: 1.5,
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
          onClick={handleCopy}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              fontSize: '0.875rem',
              color: 'primary.light',
            }}
          >
            {depositAddress || 'N/A'}
          </Typography>
        </Box>
      </Box>

      {/* Swap Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            From:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {sourceSymbol}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            To:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {destinationSymbol}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Slippage Tolerance:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            1%
          </Typography>
        </Box>
      </Box>

      {/* Info Alert */}
      <Alert
        severity="info"
        sx={{
          mt: 2,
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          border: '1px solid rgba(33, 150, 243, 0.3)',
        }}
      >
        <Typography variant="caption">
          Send your {sourceSymbol} to the deposit address above to complete the swap to {destinationSymbol}.
        </Typography>
      </Alert>
    </Box>
  );
}
