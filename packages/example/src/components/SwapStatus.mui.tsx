import type { SwapStateChangeEvent } from '@asset-route-sdk/core';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';

interface SwapStatusProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  currentState?: SwapStateChangeEvent;
  txHash?: string;
  error?: string;
}

export function SwapStatus({
  status,
  currentState,
  txHash,
  error,
}: SwapStatusProps) {
  if (status === 'idle') {
    return null;
  }

  const getActiveStep = () => {
    if (!currentState) return 0;

    if (currentState.status === 'DEPOSIT_SENT') return 0;
    if (currentState.status === 'KNOWN_DEPOSIT_TX' ||
        currentState.status === 'PENDING_DEPOSIT' ||
        currentState.status === 'INCOMPLETE_DEPOSIT') return 1;
    if (currentState.status === 'PROCESSING') return 2;
    if (currentState.status === 'SUCCESS') return 4; // Return 4 so all steps show as completed

    return 0;
  };

  const steps = [
    'Deposit Sent',
    'Deposit Confirmed',
    'Processing Swap',
    'Swap Complete',
  ];

  return (
    <Box
      sx={{
        border: '1px solid rgba(0, 0, 0, 0.5)',
        borderRadius: 3,
        p: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(0, 0, 0, 0.9)',
      }}
    >
      {(status === 'processing' || status === 'success') && currentState && (
        <Box>
          <Stepper activeStep={getActiveStep()} alternativeLabel>
            {steps.map((label, index) => {
              const stepStatus =
                index < getActiveStep() ? 'completed' :
                index === getActiveStep() ? 'active' : 'pending';

              return (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {stepStatus === 'completed' && (
                          <CheckIcon color="success" sx={{ fontSize: 32 }} />
                        )}
                        {stepStatus === 'active' && (
                          <PendingIcon color="primary" sx={{ fontSize: 32 }} />
                        )}
                        {stepStatus === 'pending' && (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              border: '2px solid',
                              borderColor: 'grey.400',
                            }}
                          />
                        )}
                      </Box>
                    )}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {getActiveStep() < 3 && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress />
            </Box>
          )}

          {/* Status Details */}
          <Box sx={{ mt: 3 }}>
            <Chip
              label={currentState.status.replace(/_/g, ' ')}
              color={
                currentState.status === 'SUCCESS' ? 'success' :
                currentState.status === 'FAILED' || currentState.status === 'REFUNDED' ? 'error' :
                'primary'
              }
              size="small"
            />
          </Box>

          {status === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Swap completed successfully!
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {status === 'error' && error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Error: {error}
          </Typography>
        </Alert>
      )}

      {txHash && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Transaction Hash:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              bgcolor: 'grey.100',
              p: 1,
              borderRadius: 1,
            }}
          >
            {txHash}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
