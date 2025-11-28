import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  Typography,
  Box,
  Paper,
  Alert,
  AlertTitle,
  Chip,
  Stack,
  TextField,
} from '@mui/material';
import { RouteToZecForm } from './components/RouteToZecForm.mui';

// Hot vibrant theme with energetic colors
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b35', // Hot Orange
      light: '#ff8c5a',
      dark: '#e85a2a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff006e', // Hot Pink/Magenta
      light: '#ff3d8f',
      dark: '#d9005c',
      contrastText: '#ffffff',
    },
    success: {
      main: '#06ffa5', // Neon Green
      light: '#3cffb8',
      dark: '#05d98a',
    },
    warning: {
      main: '#ffbe0b', // Electric Yellow
      light: '#ffcb3c',
      dark: '#e6ab00',
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
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(255, 107, 53, 0.15)',
    '0px 4px 12px rgba(255, 107, 53, 0.2)',
    '0px 8px 16px rgba(255, 107, 53, 0.25)',
    '0px 12px 24px rgba(255, 0, 110, 0.3)',
    '0px 16px 32px rgba(255, 0, 110, 0.35)',
    '0px 20px 40px rgba(255, 0, 110, 0.4)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
    '0px 24px 48px rgba(255, 0, 110, 0.45)',
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
            boxShadow: '0px 8px 24px rgba(255, 107, 53, 0.4)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff8c5a 0%, #ff6b35 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #ff006e 0%, #ff3d8f 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff3d8f 0%, #ff006e 100%)',
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3,
          position: 'relative',
        }}
      >
        {/* Development Notice - Top Left */}
        <Box sx={{ position: 'absolute', top: 20, left: 20, maxWidth: '500px' }}>
          <Alert severity="warning">
            <AlertTitle>Development Notice</AlertTitle>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2, fontSize: '0.85rem' }}>
              <li>Wallet integration not implemented</li>
              <li>API configuration required via env vars</li>
              <li>Demo only - do not use with real funds</li>
              <li>Test mnemonics only</li>
            </Box>
          </Alert>
        </Box>

        {/* Mnemonic Input - Top Right */}
        <Box sx={{ position: 'absolute', top: 20, right: 20, maxWidth: '500px' }}>
          <Box
            sx={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              p: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
            >
              Mnemonic Phrase
            </Typography>
            <TextField
              fullWidth
              placeholder="your twelve or twenty-four word mnemonic..."
              multiline
              rows={3}
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'white',
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
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mt: 1,
                display: 'block',
              }}
            >
              ⚠️ Never share your mnemonic
            </Typography>
          </Box>
        </Box>

        {/* Centered Forms Container */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          {/* Swap Forms Grid - Centered */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            alignItems="stretch"
            sx={{ maxWidth: '1200px', width: '100%' }}
          >
            {/* Route to Zcash */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Paper
                elevation={3}
                sx={{
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)',
                    color: 'white',
                    p: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, position: 'relative', zIndex: 1 }}>
                    Route to Zcash
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95, position: 'relative', zIndex: 1 }}>
                    Swap SOL → ZEC
                  </Typography>
                </Box>
                <Box sx={{ p: 3, flex: 1 }}>
                  <RouteToZecForm />
                </Box>
              </Paper>
            </Box>

            {/* Route from Zcash - Coming Soon */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Paper
                elevation={3}
                sx={{
                  overflow: 'hidden',
                  opacity: 0.7,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #ff006e 0%, #ff3d8f 100%)',
                    color: 'white',
                    p: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, position: 'relative', zIndex: 1 }}>
                    Route from Zcash
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95, position: 'relative', zIndex: 1 }}>
                    Swap ZEC → SOL
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Chip
                    label="Coming Soon"
                    sx={{
                      mb: 2,
                      background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
                      fontWeight: 600,
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                  >
                    This form will allow you to route assets
                    <br />
                    from Zcash to other blockchains
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Stack>
        </Box>

        {/* Footer - Bottom Center */}
        <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
          <Typography variant="body2" color="text.secondary">
            Built with React, Vite, TypeScript, and Material-UI
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
