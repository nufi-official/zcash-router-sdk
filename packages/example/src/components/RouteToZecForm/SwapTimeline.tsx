import { Box, Stepper, Step, StepLabel, Chip } from '@mui/material';
import { CheckCircle as CheckIcon, Pending as PendingIcon } from '@mui/icons-material';
import type { SwapStateChangeEvent } from '@asset-route-sdk/core';
import { SWAP_HAPPY_PATH_TIMELINE, SWAP_END_STATES } from '@asset-route-sdk/core';
import { CARVED_BOX_STYLES } from './constants';

interface SwapTimelineProps {
  currentState?: SwapStateChangeEvent;
  isFetchingQuote?: boolean;
  hasQuote?: boolean;
}

export function SwapTimeline({ currentState, isFetchingQuote, hasQuote }: SwapTimelineProps) {
  // Build timeline steps
  const buildTimeline = () => {
    if (!currentState || isFetchingQuote) {
      // Show all steps in pending state when fetching quote
      return ['GETTING QUOTE', 'PENDING DEPOSIT', 'KNOWN DEPOSIT TX', 'PROCESSING', 'SUCCESS'];
    }

    // If we hit an end state, show only that end state
    if (SWAP_END_STATES.has(currentState.status)) {
      return ['GETTING QUOTE', currentState.status.replace(/_/g, ' ')];
    }

    // Otherwise show happy path with "Getting Quote" completed
    const timeline = SWAP_HAPPY_PATH_TIMELINE;
    return ['GETTING QUOTE', ...timeline.map((status) => status.replace(/_/g, ' '))];
  };

  const allSteps = buildTimeline();

  const getActiveStep = () => {
    // If fetching quote, "Getting Quote" is active (step 0)
    if (isFetchingQuote) {
      return 0;
    }

    if (!currentState) {
      return 1; // Quote received, move to step 1 (Pending Deposit)
    }

    // If it's an end state, show it as completed
    if (SWAP_END_STATES.has(currentState.status)) {
      return 2; // Getting Quote + end state, both completed
    }

    // Find the index of current status in happy path
    const currentIndex = SWAP_HAPPY_PATH_TIMELINE.findIndex(
      (step) => step === currentState.status
    );

    // If SUCCESS, return length to show all completed
    if (currentState.status === 'SUCCESS') {
      return allSteps.length;
    }

    // Add 1 to account for "Getting Quote" step being first and completed
    return currentIndex >= 0 ? currentIndex + 1 : 1;
  };

  const getCurrentStatusLabel = () => {
    if (isFetchingQuote) {
      return 'GETTING QUOTE';
    }
    if (currentState) {
      return currentState.status.replace(/_/g, ' ');
    }
    return 'PENDING DEPOSIT';
  };

  return (
    <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
      <Stepper activeStep={getActiveStep()} alternativeLabel>
        {allSteps.map((label, index) => {
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
          label={getCurrentStatusLabel()}
          color={
            currentState?.status === 'SUCCESS' ? 'success' :
            currentState?.status === 'FAILED' || currentState?.status === 'REFUNDED' ? 'error' :
            'primary'
          }
          size="small"
        />
      </Box>
    </Box>
  );
}
