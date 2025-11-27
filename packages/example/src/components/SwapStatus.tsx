import type { SwapStateChangeEvent } from '@asset-route-sdk/core';

interface SwapStatusProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  currentState?: SwapStateChangeEvent;
  txHash?: string;
  error?: string;
}

export function SwapStatus({ status, currentState, txHash, error }: SwapStatusProps) {
  if (status === 'idle') {
    return null;
  }

  return (
    <div className="mt-6 p-4 rounded-lg border">
      <h3 className="font-semibold mb-3">Swap Progress</h3>

      {status === 'processing' && currentState && (
        <div className="space-y-2">
          {/* Deposit Sent */}
          {currentState.status === 'DEPOSIT_SENT' && (
            <StatusItem
              label="Deposit Sent"
              status="complete"
              details={`TX: ${currentState.txHash.slice(0, 10)}...${currentState.txHash.slice(-8)}`}
            />
          )}

          {/* Known Deposit */}
          {(currentState.status === 'KNOWN_DEPOSIT_TX' ||
            currentState.status === 'PENDING_DEPOSIT' ||
            currentState.status === 'INCOMPLETE_DEPOSIT' ||
            currentState.status === 'PROCESSING' ||
            currentState.status === 'SUCCESS') && (
            <>
              <StatusItem label="Deposit Sent" status="complete" />
              <StatusItem
                label="Deposit Confirmed"
                status={currentState.status === 'KNOWN_DEPOSIT_TX' ||
                       currentState.status === 'PENDING_DEPOSIT' ? 'active' : 'complete'}
              />
            </>
          )}

          {/* Processing */}
          {(currentState.status === 'PROCESSING' || currentState.status === 'SUCCESS') && (
            <StatusItem
              label="Processing Swap"
              status={currentState.status === 'PROCESSING' ? 'active' : 'complete'}
            />
          )}

          {/* Success */}
          {currentState.status === 'SUCCESS' && (
            <StatusItem label="Swap Complete" status="complete" />
          )}

          {/* Failed/Refunded */}
          {(currentState.status === 'FAILED' || currentState.status === 'REFUNDED') && (
            <StatusItem
              label={currentState.status === 'REFUNDED' ? 'Swap Refunded' : 'Swap Failed'}
              status="error"
            />
          )}
        </div>
      )}

      {status === 'success' && (
        <div className="text-green-600 font-medium">
          ✓ Swap completed successfully!
        </div>
      )}

      {status === 'error' && error && (
        <div className="text-red-600 font-medium">
          ✗ Error: {error}
        </div>
      )}

      {txHash && (
        <div className="mt-3 text-sm text-gray-600">
          <div className="font-medium">Transaction Hash:</div>
          <div className="font-mono break-all">{txHash}</div>
        </div>
      )}
    </div>
  );
}

interface StatusItemProps {
  label: string;
  status: 'active' | 'complete' | 'error';
  details?: string;
}

function StatusItem({ label, status, details }: StatusItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${
        status === 'complete' ? 'bg-green-500' :
        status === 'active' ? 'bg-blue-500 animate-pulse' :
        'bg-red-500'
      }`} />
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {details && <div className="text-sm text-gray-600">{details}</div>}
      </div>
    </div>
  );
}
