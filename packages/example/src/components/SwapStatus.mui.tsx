import type { SwapStateChangeEvent } from '@asset-route-sdk/core';
import { SWAP_HAPPY_PATH_TIMELINE, SWAP_END_STATES } from '@asset-route-sdk/core';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  LinearProgress,
  Link,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';

interface SwapStatusProps {
  status: 'idle' | 'fetching-quote' | 'monitoring' | 'success' | 'error';
  currentState?: SwapStateChangeEvent;
  txHash?: string;
  error?: string;
  swapExplorerUrl?: string;
}

export function SwapStatus({
  status,
  currentState,
  txHash,
  error,
  swapExplorerUrl,
}: SwapStatusProps) {
  if (status === 'idle' || status === 'fetching-quote') {
    return null;
  }

  // Determine which timeline to show based on current state
  const getTimeline = () => {
    if (!currentState) return SWAP_HAPPY_PATH_TIMELINE;

    // DEPOSIT_SENT is a local status, not from the API, so handle it separately
    if (currentState.status === 'DEPOSIT_SENT') {
      return SWAP_HAPPY_PATH_TIMELINE;
    }

    // If we hit an end state, show only that end state
    if (SWAP_END_STATES.has(currentState.status as any)) {
      // For end states, show just the final status
      return [currentState.status as any];
    }

    // Otherwise show happy path
    return SWAP_HAPPY_PATH_TIMELINE;
  };

  const timeline = getTimeline();
  const steps = timeline.map((status) => status.replace(/_/g, ' '));

  const getActiveStep = () => {
    if (!currentState) return -1;

    // DEPOSIT_SENT is not in the timeline, treat it as -1 (not started yet)
    if (currentState.status === 'DEPOSIT_SENT') {
      return -1;
    }

    // If it's an end state, show it as completed
    if (SWAP_END_STATES.has(currentState.status as any)) {
      return 1; // Single step, completed
    }

    // Find the index of current status in happy path
    const currentIndex = timeline.findIndex(
      (step) => step === currentState.status
    );

    // If SUCCESS, return length to show all completed
    if (currentState.status === 'SUCCESS') {
      return timeline.length;
    }

    // Return the current index (not +1) so the current step is active (purple)
    return currentIndex >= 0 ? currentIndex : 0;
  };

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
      {(status === 'monitoring' || status === 'success') && currentState && (
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

          {getActiveStep() < timeline.length && (
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

          {/* Swap Explorer Link - Show during PROCESSING */}
          {currentState.status === 'PROCESSING' && (
            <Box sx={{ mt: 2 }}>
              <Link
                href={swapExplorerUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Typography variant="body2">
                  View swap details →
                </Typography>
              </Link>
            </Box>
          )}

          {status === 'success' && (
            <Box>
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Swap completed successfully!
                </Typography>
              </Alert>
              {/* Transaction Explorer Link - Show on SUCCESS */}
              {txHash && (
                <Box sx={{ mt: 2 }}>
                  <Link
                    href={txHash || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <Typography variant="body2">
                      View transaction →
                    </Typography>
                  </Link>
                </Box>
              )}
            </Box>
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
    </Box>
  );
}
