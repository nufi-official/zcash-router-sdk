import type { SwapStateChangeEvent } from '@asset-route-sdk/core';
import {
  Box,
  Paper,
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
    if (currentState.status === 'SUCCESS') return 3;

    return 0;
  };

  const steps = [
    'Deposit Sent',
    'Deposit Confirmed',
    'Processing Swap',
    'Swap Complete',
  ];

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Swap Progress
      </Typography>

      {status === 'processing' && currentState && (
        <Box sx={{ mt: 2 }}>
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
        </Box>
      )}

      {status === 'success' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Swap completed successfully!
          </Typography>
        </Alert>
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
    </Paper>
  );
}
