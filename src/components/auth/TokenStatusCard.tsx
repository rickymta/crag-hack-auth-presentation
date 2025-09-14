import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  AccessTime as TimeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { RootState } from '../../store';
import { refreshTokenAsync } from '../../store/slices/authSlice';
import { TokenUtils } from '../../utils/tokenUtils';

interface TokenStatusCardProps {
  className?: string;
}

export const TokenStatusCard: React.FC<TokenStatusCardProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasRefreshToken, setHasRefreshToken] = useState(false);

  // Update time until expiry every second
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateTime = () => {
      setTimeUntilExpiry(TokenUtils.getFormattedTimeUntilExpiry());
      setUserInfo(TokenUtils.getUserFromToken());
    };

    // Check refresh token availability only once per mount/auth change
    setHasRefreshToken(TokenUtils.hasRefreshToken());

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleRefreshToken = async () => {
    setLoading(true);
    try {
      await dispatch(refreshTokenAsync() as any);
      // Update refresh token availability after successful refresh
      setHasRefreshToken(TokenUtils.hasRefreshToken());
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      // Check if refresh token is still available after failed refresh
      setHasRefreshToken(TokenUtils.hasRefreshToken());
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <SecurityIcon color="disabled" />
            <Typography variant="h6" color="text.secondary">
              Authentication Status
            </Typography>
          </Box>
          <Alert severity="warning">
            Not authenticated. Please log in to view token status.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isExpired = TokenUtils.isTokenExpired();

  return (
    <Card className={className}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <SecurityIcon color="primary" />
          <Typography variant="h6">
            Token Status
          </Typography>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          {/* Token Status */}
          <Box flex={1}>
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Access Token
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Chip
                  label={isExpired ? 'Expired' : 'Valid'}
                  color={isExpired ? 'error' : 'success'}
                  size="small"
                />
                <Box display="flex" alignItems="center" gap={0.5}>
                  <TimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {timeUntilExpiry}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Refresh Token
              </Typography>
              <Chip
                label={hasRefreshToken ? 'Available' : 'Missing'}
                color={hasRefreshToken ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Box>

          {/* User Info */}
          {userInfo && (
            <Box flex={1}>
              <Typography variant="subtitle2" gutterBottom>
                Token Information
              </Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  User ID: {userInfo.userId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {userInfo.email}
                </Typography>
                {userInfo.roles?.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Roles: {userInfo.roles.join(', ')}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={handleRefreshToken}
            disabled={loading || !hasRefreshToken}
          >
            Refresh Token
          </Button>

          {isExpired && (
            <Alert severity="warning" sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <InfoIcon fontSize="small" />
                Token expired. Refresh to continue using the app.
              </Box>
            </Alert>
          )}
        </Box>

        {!hasRefreshToken && (
          <Alert severity="error" sx={{ mt: 2 }}>
            No refresh token available. Please log in again.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
