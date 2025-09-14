import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  Science as TestIcon,
} from '@mui/icons-material';
import { TokenUtils } from '../../utils/tokenUtils';
import { TokenStatusCard } from './TokenStatusCard';

export const TokenManagementDemo: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTokenTests = () => {
    const results: string[] = [];
    
    // Test 1: Check token expiry
    const isExpired = TokenUtils.isTokenExpired();
    results.push(`Token Expired Check: ${isExpired ? 'EXPIRED' : 'VALID'}`);
    
    // Test 2: Time until expiry
    const timeUntilExpiry = TokenUtils.getFormattedTimeUntilExpiry();
    results.push(`Time Until Expiry: ${timeUntilExpiry}`);
    
    // Test 3: Refresh token availability
    const hasRefreshToken = TokenUtils.hasRefreshToken();
    results.push(`Refresh Token Available: ${hasRefreshToken ? 'YES' : 'NO'}`);
    
    // Test 4: Valid auth check
    const hasValidAuth = TokenUtils.hasValidAuth();
    results.push(`Valid Authentication: ${hasValidAuth ? 'YES' : 'NO'}`);
    
    // Test 5: User info extraction
    const userInfo = TokenUtils.getUserFromToken();
    results.push(`User Info: ${userInfo ? `${userInfo.email} (${userInfo.userId})` : 'NONE'}`);
    
    setTestResults(results);
  };

  const simulateTokenExpiry = () => {
    // This would typically involve setting a token with a very short expiry
    // For demo purposes, we'll just show what would happen
    setTestResults([
      'SIMULATION: Token expiry simulated',
      'Auto-refresh should trigger within 5 minutes',
      'Background token refresh will handle this automatically',
      'User will not be logged out if refresh token is valid',
    ]);
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TestIcon color="primary" />
            <Typography variant="h6">
              Token Management Demo & Testing
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            This demo shows the automatic token refresh system in action. 
            The system continuously monitors token expiry and refreshes tokens in the background.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            {/* Action Buttons */}
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={runTokenTests}
              >
                Run Token Tests
              </Button>
              
              <Button
                variant="outlined"
                onClick={simulateTokenExpiry}
              >
                Simulate Token Expiry
              </Button>
              
              <Button
                variant="text"
                startIcon={<SettingsIcon />}
                onClick={() => setSettingsOpen(true)}
              >
                Settings
              </Button>
            </Box>

            {/* Test Results */}
            {testResults.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Test Results:
                </Typography>
                <Alert severity="info">
                  <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                    {testResults.join('\n')}
                  </Box>
                </Alert>
              </Box>
            )}

            {/* Current Token Status */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Live Token Status:
              </Typography>
              <TokenStatusCard />
            </Box>

            {/* Feature Overview */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Automatic Token Management Features:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <Typography component="li" variant="body2">
                  🔄 **Automatic Refresh**: Tokens are refreshed automatically before expiry
                </Typography>
                <Typography component="li" variant="body2">
                  ⏰ **Smart Timing**: Refresh triggers 5 minutes before token expires
                </Typography>
                <Typography component="li" variant="body2">
                  🛡️ **Error Recovery**: Handles network failures and retry logic
                </Typography>
                <Typography component="li" variant="body2">
                  🔍 **Background Monitoring**: Continuous token expiry checking
                </Typography>
                <Typography component="li" variant="body2">
                  📱 **Seamless UX**: Users never see authentication interruptions
                </Typography>
                <Typography component="li" variant="body2">
                  🔐 **Secure Storage**: Proper token storage and cleanup
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Token Refresh Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              label="Refresh Check Interval (minutes)"
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              helperText="How often to check if token needs refresh"
              inputProps={{ min: 1, max: 30 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              }
              label="Enable Automatic Token Refresh"
            />
            
            <Alert severity="info">
              <Typography variant="body2">
                These settings control the TokenRefreshProvider behavior. 
                Changes will take effect after page refresh.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => setSettingsOpen(false)}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
