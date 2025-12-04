import { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  Typography,
  Box,
  Paper,
  Alert,
  AlertTitle,
  Stack,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { generateMnemonic } from 'bip39';
import { RouteToZecForm } from './components/RouteToZecForm.mui';
import { RouteFromZecForm } from './components/RouteFromZecForm.mui';
import { loadAndInitWebZjs } from '@asset-route-sdk/zcash-core';

// Theme with official Solana and Zcash brand colors
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9945FF', // Solana Purple
      light: '#b36dff',
      dark: '#7a2ecc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F3B724', // Zcash Gold
      light: '#f5c550',
      dark: '#c9981d',
      contrastText: '#000000',
    },
    success: {
      main: '#14F195', // Solana Green
      light: '#43f4aa',
      dark: '#10c177',
    },
    warning: {
      main: '#F3B724', // Zcash Gold
      light: '#f5c550',
      dark: '#c9981d',
    },
    error: {
      main: '#ff1744', // Hot Red
      light: '#ff4569',
      dark: '#e6133b',
    },
    background: {
      default: '#000000', // Pure Black
      paper: '#0a0a0a', // Near Black
    },
    text: {
      primary: '#ffffff',
      secondary: '#a8b2d1',
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.04em',
      fontSize: '3.5rem',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
      fontSize: '2.75rem',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '2.25rem',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
      fontSize: '1rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(153, 69, 255, 0.15)',
    '0px 4px 12px rgba(153, 69, 255, 0.2)',
    '0px 8px 16px rgba(153, 69, 255, 0.25)',
    '0px 12px 24px rgba(20, 241, 149, 0.3)',
    '0px 16px 32px rgba(20, 241, 149, 0.35)',
    '0px 20px 40px rgba(20, 241, 149, 0.4)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
    '0px 24px 48px rgba(243, 183, 36, 0.45)',
  ] as const,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '10px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(153, 69, 255, 0.4)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #14F195 0%, #9945FF 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #F3B724 0%, #9945FF 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9945FF 0%, #F3B724 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [addressType, setAddressType] = useState<'transparent' | 'shielded'>(
    'transparent'
  );
  const [mnemonic, setMnemonic] = useState(''); // The confirmed mnemonic used by forms
  const [mnemonicInput, setMnemonicInput] = useState(''); // The input field value
  const [isConnected, setIsConnected] = useState(false);

  // Store refresh functions from forms using refs to avoid stale closures
  const refreshSolBalanceRef = useRef<(() => void) | null>(null);
  const refreshZecBalanceRef = useRef<(() => void) | null>(null);

  // Initialize WASM on mount (but don't block UI)
  useEffect(() => {
    void loadAndInitWebZjs();
  }, []);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleLogin = () => {
    if (!mnemonicInput.trim()) {
      alert('Please enter a mnemonic phrase');
      return;
    }
    setMnemonic(mnemonicInput.trim());
    setIsConnected(false); // Close the panel after login
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setMnemonic('');
    setMnemonicInput('');
  };

  const handleRefreshBalances = () => {
    if (refreshSolBalanceRef.current) refreshSolBalanceRef.current();
    if (refreshZecBalanceRef.current) refreshZecBalanceRef.current();
  };

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonicInput(newMnemonic);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          bgcolor: 'background.default',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Development Notice - Top Left */}
        <Box
          sx={{ position: 'absolute', top: 20, left: 20, maxWidth: '500px' }}
        >
          <Alert severity="warning">
            <AlertTitle>Development Notice</AlertTitle>
            <Box
              component="ul"
              sx={{ mt: 1, mb: 0, pl: 2, fontSize: '0.85rem' }}
            >
              <li>Wallet integration not implemented</li>
              <li>API configuration required via env vars</li>
              <li>Demo only - do not use with real funds</li>
              <li>Test mnemonics only</li>
            </Box>
          </Alert>
        </Box>

        {/* Connect Wallet - Top Right */}
        <Box
          sx={{ position: 'absolute', top: 20, right: 20, maxWidth: '500px' }}
          onBlur={(e) => {
            // Check if the new focus target is outside this container
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsConnected(false);
            }
          }}
          tabIndex={-1}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-end' }}>
              {mnemonic && (
                <IconButton
                  onClick={handleRefreshBalances}
                  sx={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    color: 'rgba(243, 183, 36, 0.8)',
                    border: '2px solid rgba(243, 183, 36, 0.3)',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: '#F3B724',
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              )}
              <Button
                onClick={
                  mnemonic ? () => setIsConnected(!isConnected) : handleConnect
                }
                variant="contained"
                size="large"
                sx={{
                  background: mnemonic
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'linear-gradient(135deg, #14F195 0%, #9945FF 50%, #F3B724 100%)',
                  backdropFilter: mnemonic ? 'blur(10px)' : 'none',
                  color: mnemonic ? 'rgba(243, 183, 36, 0.8)' : 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: mnemonic
                    ? 'none'
                    : '0 4px 20px rgba(20, 241, 149, 0.4)',
                  minWidth: 'auto',
                  border: mnemonic
                    ? '2px solid rgba(243, 183, 36, 0.3)'
                    : 'none',
                  '&:hover': {
                    background: mnemonic
                      ? 'rgba(0, 0, 0, 0.7)'
                      : 'linear-gradient(135deg, #10c177 0%, #7a2ecc 50%, #c9981d 100%)',
                    color: mnemonic ? '#F3B724' : 'white',
                    boxShadow: mnemonic
                      ? 'none'
                      : '0 6px 25px rgba(20, 241, 149, 0.6)',
                  },
                }}
              >
                {mnemonic
                  ? `Mnemonic: ${mnemonic.split(' ')[0]}...`
                  : 'Connect'}
              </Button>
            </Box>

            {isConnected && mnemonic && (
              <Button
                onClick={handleDisconnect}
                variant="contained"
                size="large"
                sx={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(10px)',
                  color: 'error.main',
                  fontWeight: 700,
                  fontSize: '1rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 'auto',
                  alignSelf: 'flex-end',
                  border: '2px solid rgba(243, 183, 36, 0.3)',
                  animation: 'slideDown 0.3s ease-out',
                  '@keyframes slideDown': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(-20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#ff1744',
                    boxShadow: 'none',
                  },
                }}
              >
                Disconnect
              </Button>
            )}

            {isConnected && !mnemonic && (
              <Box
                sx={{
                  border: '2px solid rgba(243, 183, 36, 0.3)',
                  borderRadius: 3,
                  p: 3,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(10px)',
                  animation: 'slideDown 0.3s ease-out',
                  '@keyframes slideDown': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(-20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    Mnemonic Phrase
                  </Typography>
                  <Button
                    onClick={handleGenerateMnemonic}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#F3B724',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(243, 183, 36, 0.1)',
                      },
                    }}
                  >
                    Generate New
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  value={mnemonicInput}
                  onChange={(e) => setMnemonicInput(e.target.value)}
                  placeholder="your twelve or twenty-four word mnemonic..."
                  multiline
                  rows={3}
                  variant="standard"
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      sx: {
                        fontFamily:
                          '"JetBrains Mono", "Consolas", "Monaco", monospace',
                        fontSize: '0.875rem',
                        color: 'white',
                        fontWeight: 400,
                        lineHeight: 1.8,
                        '& textarea': {
                          padding: 0,
                        },
                        '& textarea::placeholder': {
                          color: 'rgba(255, 255, 255, 0.3)',
                          opacity: 1,
                        },
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={handleLogin}
                    variant="contained"
                    fullWidth
                    sx={{
                      background:
                        'linear-gradient(135deg, #14F195 0%, #9945FF 50%, #F3B724 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      py: 1.2,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 2px 10px rgba(20, 241, 149, 0.3)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #10c177 0%, #7a2ecc 50%, #c9981d 100%)',
                        boxShadow: '0 4px 15px rgba(20, 241, 149, 0.5)',
                      },
                    }}
                  >
                    Confirm
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Centered Forms Container */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Box sx={{ maxWidth: '1200px', width: '100%' }}>
            {/* Zcash Address Type Selector */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  border: '2px solid rgba(243, 183, 36, 0.3)',
                  borderRadius: '32px',
                  p: 0.5,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                }}
              >
                {/* Sliding background */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: addressType === 'transparent' ? 4 : 'calc(50%)',
                    width: 'calc(50% - 4px)',
                    height: 'calc(100% - 8px)',
                    background:
                      'linear-gradient(135deg, #F3B724 0%, #9945FF 100%)',
                    boxShadow: '0 4px 16px rgba(243, 183, 36, 0.4)',
                    borderRadius: '28px',
                    transition: 'left 0.3s ease',
                    pointerEvents: 'none',
                  }}
                />

                {/* Transparent option */}
                <Box
                  onClick={() => setAddressType('transparent')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '28px',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    color:
                      addressType === 'transparent'
                        ? 'white'
                        : 'rgba(243, 183, 36, 0.8)',
                    fontWeight: 600,
                    minWidth: '140px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    '&:hover': {
                      color:
                        addressType === 'transparent' ? 'white' : '#F3B724',
                    },
                  }}
                >
                  Transparent
                </Box>

                {/* Shielded option */}
                <Box
                  onClick={() => setAddressType('shielded')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '28px',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    color:
                      addressType === 'shielded'
                        ? 'white'
                        : 'rgba(243, 183, 36, 0.8)',
                    fontWeight: 600,
                    minWidth: '140px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    '&:hover': {
                      color: addressType === 'shielded' ? 'white' : '#F3B724',
                    },
                  }}
                >
                  Shielded
                </Box>
              </Box>
            </Box>

            {/* Swap Forms Grid - Centered */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              alignItems="flex-start"
              sx={{ width: '100%' }}
            >
              {/* Route to Zcash */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Paper
                  elevation={3}
                  sx={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background:
                      'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      background:
                        'linear-gradient(135deg, #14F195 0%, #9945FF 50%, #F3B724 100%)',
                      color: 'white',
                      p: 3,
                      position: 'relative',
                      borderRadius: '24px 24px 48px 48px',
                      boxShadow:
                        '0 0 32px rgba(20, 241, 149, 0.5), 0 0 16px rgba(153, 69, 255, 0.4)',
                      zIndex: 1,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
                        borderRadius: '24px 24px 48px 48px',
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, position: 'relative', zIndex: 1 }}
                    >
                      Route to Zcash
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.95, position: 'relative', zIndex: 1 }}
                    >
                      Swap SOL → ZEC
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3, flex: 1 }}>
                    <RouteToZecForm
                      addressType={addressType}
                      mnemonic={mnemonic}
                      onConnectClick={handleConnect}
                      onRefreshBalance={(refresh) => {
                        refreshSolBalanceRef.current = refresh;
                      }}
                    />
                  </Box>
                </Paper>
              </Box>

              {/* Route from Zcash */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Paper
                  elevation={3}
                  sx={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background:
                      'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      background:
                        'linear-gradient(135deg, #F3B724 0%, #9945FF 50%, #14F195 100%)',
                      color: 'white',
                      p: 3,
                      position: 'relative',
                      borderRadius: '24px 24px 48px 48px',
                      boxShadow:
                        '0 0 32px rgba(243, 183, 36, 0.5), 0 0 16px rgba(153, 69, 255, 0.4)',
                      zIndex: 1,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
                        borderRadius: '24px 24px 48px 48px',
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, position: 'relative', zIndex: 1 }}
                    >
                      Route from Zcash
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.95, position: 'relative', zIndex: 1 }}
                    >
                      Swap ZEC → SOL
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3, flex: 1 }}>
                    <RouteFromZecForm
                      addressType={addressType}
                      mnemonic={mnemonic}
                      onConnectClick={handleConnect}
                      onRefreshBalance={(refresh) => {
                        refreshZecBalanceRef.current = refresh;
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
