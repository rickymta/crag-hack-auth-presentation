import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface PermissionFormData {
  name: string;
  description: string;
  module: string;
  action: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Permission name is required')
    .min(2, 'Permission name must be at least 2 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  module: yup
    .string()
    .required('Module is required'),
  action: yup
    .string()
    .required('Action is required'),
});

const modules = [
  { value: 'users', label: 'Users' },
  { value: 'roles', label: 'Roles' },
  { value: 'permissions', label: 'Permissions' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'settings', label: 'Settings' },
];

const actions = [
  { value: 'create', label: 'Create' },
  { value: 'read', label: 'Read' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
];

const PermissionCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      module: '',
      action: '',
    },
  });

  const onSubmit = async (data: PermissionFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('Creating permission:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/permissions');
    } catch (error) {
      setSubmitError('Failed to create permission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/permissions');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Permission
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Define a new permission for specific module actions.
        </Typography>
      </Box>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Permission Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  variant="outlined"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  variant="outlined"
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="module"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.module}>
                    <InputLabel>Module</InputLabel>
                    <Select {...field} label="Module">
                      {modules.map((module) => (
                        <MenuItem key={module.value} value={module.value}>
                          {module.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.module && (
                      <FormHelperText>{errors.module.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="action"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.action}>
                    <InputLabel>Action</InputLabel>
                    <Select {...field} label="Action">
                      {actions.map((action) => (
                        <MenuItem key={action.value} value={action.value}>
                          {action.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.action && (
                      <FormHelperText>{errors.action.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Permission'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default PermissionCreatePage;
