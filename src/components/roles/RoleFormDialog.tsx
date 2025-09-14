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
  Checkbox,
  Autocomplete,
} from '@mui/material';
import { 
  useAppDispatch, 
  useAppSelector, 
  createRole, 
  updateRole, 
  fetchAllPermissions 
} from '../../store';
import type { RoleDto, RoleCreateDto, RoleUpdateDto } from '../../types/dto/role';
import type { PermissionDto } from '../../types/dto/permission';

interface RoleFormDialogProps {
  open: boolean;
  onClose: () => void;
  role?: RoleDto | null;
  mode: 'create' | 'edit';
}

const RoleFormDialog: React.FC<RoleFormDialogProps> = ({
  open,
  onClose,
  role,
  mode,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.roles);
  const { permissions, loading: permissionsLoading } = useAppSelector((state) => state.permissions);

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
      // Fetch permissions when dialog opens
      if (permissions.length === 0 && !permissionsLoading) {
        dispatch(fetchAllPermissions());
      }

      if (mode === 'edit' && role) {
        // When editing, role.permissions might contain permission names, we need to map to IDs
        let permissionIds: string[] = [];
        if (role.permissions && role.permissions.length > 0) {
          permissionIds = role.permissions.map(permissionName => {
            // Try to find permission by name first
            const foundPermission = permissions.find((p: PermissionDto) => p.name === permissionName);
            if (foundPermission) {
              return foundPermission.id;
            }
            // If not found by name, assume it's already an ID
            return permissionName;
          });
        }

        setFormData({
          name: role.name || '',
          description: role.description || '',
          isActive: role.isActive ?? true,
          permissionIds: permissionIds,
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
  }, [open, role, mode, permissions.length, permissionsLoading, dispatch]);

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

  const handleRemovePermission = useCallback((permissionIdToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.filter(id => id !== permissionIdToRemove),
    }));

    // Clear validation error if exists
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

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Permissions *
            </Typography>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={permissions}
              getOptionLabel={(option) => option.name}
              value={formData.permissionIds.map(id => 
                permissions.find(p => p.id === id) || { id, name: id, resource: '', action: '' }
              ).filter(p => p.name)}
              onChange={(_, newValue) => {
                const permissionIds = newValue.map(permission => permission.id);
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
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search and select permissions..."
                  error={!!validationErrors.permissionIds}
                  helperText={validationErrors.permissionIds}
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    checked={selected}
                    sx={{ mr: 1 }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(option as PermissionDto).description || `${option.resource}.${option.action}`}
                    </Typography>
                  </Box>
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                    onDelete={() => handleRemovePermission(option.id)}
                    deleteIcon={<Box sx={{ fontSize: '16px' }}>×</Box>}
                  />
                ))
              }
              disabled={loading || permissionsLoading}
              loading={permissionsLoading}
              loadingText="Loading permissions..."
              noOptionsText="No permissions found"
              sx={{ width: '100%' }}
            />
          </Box>

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
                  const permission = permissions.find((p: PermissionDto) => p.id === permissionId);
                  return (
                    <Chip
                      key={permissionId}
                      label={permission?.name || permissionId}
                      size="small"
                      color="primary"
                      onDelete={() => handleRemovePermission(permissionId)}
                      deleteIcon={<Box sx={{ fontSize: '16px' }}>×</Box>}
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
