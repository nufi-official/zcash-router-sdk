import { RouteToZecForm } from './components/RouteToZecForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Asset Route SDK
          </h1>
          <p className="text-gray-600">
            Cross-chain asset routing example application
          </p>
        </header>

        {/* Forms Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Route to Zcash Form */}
          <RouteToZecForm />

          {/* Route from Zcash Form (Placeholder) */}
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg opacity-50">
            <h2 className="text-2xl font-bold mb-6">Route from Zcash</h2>
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg font-medium mb-2">Coming Soon</p>
              <p className="text-sm">
                This form will allow you to route assets from Zcash to other blockchains
              </p>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <footer className="mt-12 text-center text-sm text-gray-600 max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="font-medium text-yellow-800 mb-2">⚠️ Development Notice</p>
            <ul className="text-left space-y-1 text-yellow-700">
              <li>• Wallet integration (sendDeposit) is not implemented - requires real wallet SDK</li>
              <li>• API configuration (JWT token, base URL) needs to be set via environment variables</li>
              <li>• This is a demo app for testing the SDK - do not use with real funds on mainnet</li>
              <li>• Use test mnemonics only - never enter your real wallet mnemonic</li>
            </ul>
          </div>
          <p className="text-gray-500">
            Built with React, Vite, TypeScript, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
