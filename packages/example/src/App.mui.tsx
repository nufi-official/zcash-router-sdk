import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  Alert,
  AlertTitle,
  Chip,
  Stack,
} from '@mui/material';
import { SwapHoriz as SwapIcon } from '@mui/icons-material';
import { RouteToZecForm } from './components/RouteToZecForm.mui';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}
      >
        {/* App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: 'primary.main' }}
        >
          <Toolbar>
            <SwapIcon sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 600 }}
            >
              Asset Route SDK
            </Typography>
            <Chip label="Demo" color="secondary" size="small" />
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 6,
            mb: 4,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Cross-Chain Asset Routing
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Seamlessly swap assets between Solana and Zcash
            </Typography>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ pb: 8 }}>
          {/* Development Notice */}
          <Alert severity="warning" sx={{ mb: 4 }}>
            <AlertTitle>Development Notice</AlertTitle>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              <li>
                Wallet integration (sendDeposit) is not implemented - requires
                real wallet SDK
              </li>
              <li>
                API configuration (JWT token, base URL) needs to be set via
                environment variables
              </li>
              <li>
                This is a demo app for testing the SDK - do not use with real
                funds on mainnet
              </li>
              <li>
                Use test mnemonics only - never enter your real wallet mnemonic
              </li>
            </Box>
          </Alert>

          {/* Swap Forms Grid */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            alignItems="stretch"
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
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Route to Zcash
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
                  opacity: 0.6,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    p: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Route from Zcash
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
                  <Chip label="Coming Soon" color="secondary" sx={{ mb: 2 }} />
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

          {/* Footer */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Built with React, Vite, TypeScript, and Material-UI
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
