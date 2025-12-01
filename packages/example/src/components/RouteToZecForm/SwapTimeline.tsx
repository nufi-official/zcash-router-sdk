import { Box, Stepper, Step, StepLabel, Chip } from '@mui/material';
import { CheckCircle as CheckIcon, Pending as PendingIcon } from '@mui/icons-material';
import type { SwapStateChangeEvent } from '@asset-route-sdk/core';
import { SWAP_HAPPY_PATH_TIMELINE, SWAP_END_STATES } from '@asset-route-sdk/core';
import { CARVED_BOX_STYLES } from './constants';

interface SwapTimelineProps {
  currentState: SwapStateChangeEvent;
}

export function SwapTimeline({ currentState }: SwapTimelineProps) {
  // Determine which timeline to show based on current state
  const getTimeline = () => {
    if (!currentState) return SWAP_HAPPY_PATH_TIMELINE;

    // If we hit an end state, show only that end state
    if (SWAP_END_STATES.has(currentState.status)) {
      return [currentState.status];
    }

    // Otherwise show happy path
    return SWAP_HAPPY_PATH_TIMELINE;
  };

  const timeline = getTimeline();
  const steps = timeline.map((status) => status.replace(/_/g, ' '));

  const getActiveStep = () => {
    if (!currentState) return -1;

    // If it's an end state, show it as completed
    if (SWAP_END_STATES.has(currentState.status)) {
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
    <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
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

      {/* Current Status Chip */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
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
  );
}
