import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector, createRole, updateRole } from '../../store';
import type { RoleDto, RoleCreateDto, RoleUpdateDto } from '../../types/dto/role';

interface RoleFormDialogProps {
  open: boolean;
  onClose: () => void;
  role?: RoleDto | null;
  mode: 'create' | 'edit';
}

// Mock permissions data matching API response format
const MOCK_PERMISSIONS = [
  { id: 'permissions.assign', name: 'permissions.assign', description: 'Assign permissions to roles' },
  { id: 'permissions.create', name: 'permissions.create', description: 'Create new permissions' },
  { id: 'permissions.delete', name: 'permissions.delete', description: 'Delete permissions' },
  { id: 'permissions.manage', name: 'permissions.manage', description: 'Manage permissions' },
  { id: 'permissions.read', name: 'permissions.read', description: 'View permissions' },
  { id: 'permissions.update', name: 'permissions.update', description: 'Update permissions' },
  { id: 'profile.read', name: 'profile.read', description: 'View user profiles' },
  { id: 'profile.write', name: 'profile.write', description: 'Edit user profiles' },
  { id: 'roles.delete', name: 'roles.delete', description: 'Delete roles' },
  { id: 'roles.read', name: 'roles.read', description: 'View roles' },
  { id: 'roles.write', name: 'roles.write', description: 'Create and update roles' },
  { id: 'users.delete', name: 'users.delete', description: 'Delete users' },
  { id: 'users.read', name: 'users.read', description: 'View users' },
  { id: 'users.write', name: 'users.write', description: 'Create and update users' },
];

const RoleFormDialog: React.FC<RoleFormDialogProps> = ({
  open,
  onClose,
  role,
  mode,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.roles);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    permissionIds: [] as string[],
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    permissionIds?: string;
  }>({});

  // Reset form when dialog opens/closes or role changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && role) {
        setFormData({
          name: role.name || '',
          description: role.description || '',
          isActive: role.isActive ?? true,
          permissionIds: role.permissions || [],
        });
      } else {
        setFormData({
          name: '',
          description: '',
          isActive: true,
          permissionIds: [],
        });
      }
      setValidationErrors({});
    }
  }, [open, role, mode]);

  const validateForm = useCallback(() => {
    const errors: typeof validationErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Role name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Role name must be at least 2 characters';
    }

    if (formData.permissionIds.length === 0) {
      errors.permissionIds = 'At least one permission must be selected';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [validationErrors]);

  const handlePermissionChange = useCallback((event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const permissionIds = typeof value === 'string' ? value.split(',') : value;
    
    setFormData(prev => ({
      ...prev,
      permissionIds,
    }));

    // Clear validation error
    if (validationErrors.permissionIds) {
      setValidationErrors(prev => ({
        ...prev,
        permissionIds: undefined,
      }));
    }
  }, [validationErrors.permissionIds]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'create') {
        const createData: RoleCreateDto = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          isActive: formData.isActive,
          permissionIds: formData.permissionIds,
        };

        await dispatch(createRole(createData)).unwrap();
      } else if (mode === 'edit' && role) {
        const updateData: RoleUpdateDto = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          isActive: formData.isActive,
          permissionIds: formData.permissionIds,
        };

        await dispatch(updateRole({ id: role.id, roleData: updateData })).unwrap();
      }

      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is handled by Redux state
    }
  }, [dispatch, formData, mode, role, validateForm, onClose]);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
    }
  }, [loading, onClose]);

  const getPermissionName = (permissionId: string): string => {
    const permission = MOCK_PERMISSIONS.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle>
        {mode === 'create' ? 'Create New Role' : 'Edit Role'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Role Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            required
            fullWidth
            disabled={loading}
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            multiline
            rows={3}
            fullWidth
            disabled={loading}
          />

          <FormControl fullWidth error={!!validationErrors.permissionIds}>
            <InputLabel id="permissions-label">Permissions *</InputLabel>
            <Select
              labelId="permissions-label"
              multiple
              value={formData.permissionIds}
              onChange={handlePermissionChange}
              input={<OutlinedInput label="Permissions *" />}
              disabled={loading}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 350, // Tăng chiều cao để hiển thị nhiều items hơn
                    width: 480, // Chiều rộng menu để đủ chỗ cho text
                    overflow: 'auto',
                  },
                  sx: {
                    // Custom scrollbar styling
                    '& .MuiList-root': {
                      paddingTop: 0,
                      paddingBottom: 0,
                    },
                    // Custom scrollbar cho webkit browsers
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                      },
                    },
                  },
                },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                // Cải thiện performance cho danh sách dài
                variant: 'menu',
                autoFocus: false, // Không tự động focus để tránh scroll nhảy
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip
                      key={value}
                      label={getPermissionName(value)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            >
              {MOCK_PERMISSIONS.map((permission) => (
                <MenuItem 
                  key={permission.id} 
                  value={permission.id}
                  sx={{
                    minHeight: 64, // Tăng chiều cao cho mỗi item
                    py: 1.5, // Padding top/bottom
                    px: 2, // Padding left/right
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {permission.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        lineHeight: 1.2,
                        wordBreak: 'break-word',
                      }}
                    >
                      {permission.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {validationErrors.permissionIds && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {validationErrors.permissionIds}
              </Typography>
            )}
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleInputChange('isActive')}
                disabled={loading}
              />
            }
            label="Active Role"
          />

          {formData.permissionIds.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Selected Permissions:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {formData.permissionIds.map((permissionId) => {
                  const permission = MOCK_PERMISSIONS.find(p => p.id === permissionId);
                  return (
                    <Chip
                      key={permissionId}
                      label={permission?.name || permissionId}
                      size="small"
                      color="primary"
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Role' : 'Update Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleFormDialog;
