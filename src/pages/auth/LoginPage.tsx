import React, { useState } from 'react';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginAsync, selectAuthLoading, selectAuthError } from '../../store';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useEffect } from 'react';
import { apiClient } from '../../api';

const schema = yup.object().shape({
  emailOrPhone: yup
    .string()
    .required('Email or phone number is required')
    .test('email-or-phone', 'Please enter a valid email or phone number', (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[\d\s-()]+$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: yup.boolean().default(false),
});

interface LoginFormData {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
}

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const deviceId = apiClient.getDeviceId();
    
    try {
      const result = await dispatch(loginAsync({
        emailOrPhone: data.emailOrPhone,
        password: data.password,
        deviceId,
        deviceName: 'Admin Dashboard Web',
        rememberMe: data.rememberMe,
      }));

      if (loginAsync.fulfilled.match(result)) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (apiClient.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
                : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            py: 4,
            px: 3,
            textAlign: 'center',
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
            }}
          >
            <AdminPanelSettings fontSize="large" />
          </Avatar>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Admin Panel
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Sign in to access your dashboard
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="emailOrPhone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email or Phone Number"
                  placeholder="Enter your email or phone"
                  error={!!errors.emailOrPhone}
                  helperText={errors.emailOrPhone?.message}
                  margin="normal"
                  autoComplete="username"
                  autoFocus
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter your password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  margin="normal"
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} color="primary" />}
                  label="Remember me"
                  sx={{ mt: 1, mb: 2 }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={<LoginIcon />}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component={RouterLink}
                to="/auth/forgot-password"
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                Forgot your password?
              </Link>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/auth/register"
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Paper>
    </Box>
  );
};
