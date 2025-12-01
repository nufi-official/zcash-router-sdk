import { Box, Typography, Divider, Alert } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import type { SwapQuoteResponse } from '@asset-route-sdk/core';
import { CARVED_BOX_STYLES } from './constants';

interface QuoteDisplayProps {
  quote: SwapQuoteResponse | null;
  sourceSymbol: string;
  destinationSymbol: string;
}

export function QuoteDisplay({ quote, sourceSymbol, destinationSymbol }: QuoteDisplayProps) {
  if (!quote) return null;

  const depositAddress = quote.quote.depositAddress;

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
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          Deposit Address ({sourceSymbol})
        </Typography>
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            p: 1.5,
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
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
