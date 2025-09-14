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
  Paper,
  Avatar,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerAsync, selectAuthLoading, selectAuthError } from '../../store';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useEffect } from 'react';
import { apiClient } from '../../api';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'),
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/, 'Password must contain at least one number')
    .matches(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

interface RegisterFormData {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const steps = ['Personal Information', 'Account Setup', 'Complete Registration'];

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedFields = watch();

  const onSubmit = async (data: RegisterFormData) => {
    const deviceId = apiClient.getDeviceId();
    
    const result = await dispatch(registerAsync({
      email: data.email,
      phoneNumber: data.phoneNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      confirmPassword: data.confirmPassword,
      deviceId,
      deviceName: 'Admin Dashboard Web',
    }));

    if (registerAsync.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];
    
    switch (activeStep) {
      case 0:
        fieldsToValidate = ['firstName', 'lastName', 'email'];
        break;
      case 1:
        fieldsToValidate = ['phoneNumber', 'password', 'confirmPassword'];
        break;
    }
    
    const result = await trigger(fieldsToValidate);
    if (result) {
      if (activeStep === steps.length - 1) {
        handleSubmit(onSubmit)();
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (apiClient.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="First Name"
                  placeholder="Enter your first name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  margin="normal"
                  autoComplete="given-name"
                  autoFocus
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Last Name"
                  placeholder="Enter your last name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  margin="normal"
                  autoComplete="family-name"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  margin="normal"
                  autoComplete="email"
                />
              )}
            />
          </>
        );

      case 1:
        return (
          <>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone Number"
                  placeholder="+84 123 456 789"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  margin="normal"
                  autoComplete="tel"
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
                  placeholder="Create a strong password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  margin="normal"
                  autoComplete="new-password"
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
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  margin="normal"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </>
        );

      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2"><strong>Name:</strong> {watchedFields.firstName} {watchedFields.lastName}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><strong>Email:</strong> {watchedFields.email}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><strong>Phone:</strong> {watchedFields.phoneNumber}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

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
          maxWidth: 500,
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
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Join the admin dashboard
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isLoading}
                startIcon={activeStep === steps.length - 1 ? <PersonAdd /> : undefined}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
              >
                {activeStep === steps.length - 1 
                  ? (isLoading ? 'Creating Account...' : 'Create Account')
                  : 'Next'
                }
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/auth/login"
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Paper>
    </Box>
  );
};
