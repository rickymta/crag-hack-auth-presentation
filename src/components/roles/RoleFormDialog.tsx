import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { RoleDto, RoleCreateDto } from '../../types/dto/role';

interface RoleFormDialogProps {
  open: boolean;
  onClose: () => void;
  role?: RoleDto | null;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  description: string;
  isActive: boolean;
  permissionIds: string[];
}

// Mock permissions - in real app this should come from API
const availablePermissions = [
  { id: '1', name: 'user.read', description: 'Read users' },
  { id: '2', name: 'user.create', description: 'Create users' },
  { id: '3', name: 'user.update', description: 'Update users' },
  { id: '4', name: 'user.delete', description: 'Delete users' },
  { id: '5', name: 'role.read', description: 'Read roles' },
  { id: '6', name: 'role.create', description: 'Create roles' },
  { id: '7', name: 'role.update', description: 'Update roles' },
  { id: '8', name: 'role.delete', description: 'Delete roles' },
  { id: '9', name: 'permission.read', description: 'Read permissions' },
  { id: '10', name: 'permission.create', description: 'Create permissions' },
  { id: '11', name: 'permission.update', description: 'Update permissions' },
  { id: '12', name: 'permission.delete', description: 'Delete permissions' },
];

const RoleFormDialog: React.FC<RoleFormDialogProps> = ({
  open,
  onClose,
  role,
  mode,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    isActive: true,
    permissionIds: [],
  });

  useEffect(() => {
    if (role && mode === 'edit') {
      setFormData({
        name: role.name,
        description: role.description || '',
        isActive: role.isActive,
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
    setError(null);
    setSuccess(false);
  }, [role, mode, open]);

  const handleInputChange = (field: keyof Omit<FormData, 'permissionIds' | 'isActive'>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCheckboxChange = (field: 'isActive') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.checked,
    }));
  };

  const handlePermissionChange = (permissionId: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: e.target.checked
        ? [...prev.permissionIds, permissionId]
        : prev.permissionIds.filter((id: string) => id !== permissionId),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Role name is required');
      return false;
    }

    if (formData.name.length < 2) {
      setError('Role name must be at least 2 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const roleData: RoleCreateDto = {
        name: formData.name,
        description: formData.description || undefined,
        isActive: formData.isActive,
        permissionIds: formData.permissionIds,
      };

      // TODO: Implement actual API calls when role service is ready
      console.log(mode === 'create' ? 'Creating role:' : 'Updating role:', roleData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {mode === 'create' ? 'Create New Role' : 'Edit Role'}
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {mode === 'create' ? 'Role created successfully!' : 'Role updated successfully!'}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Basic Info */}
            <TextField
              required
              fullWidth
              label="Role Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              disabled={loading}
              placeholder="e.g., Admin, User, Manager"
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange('description')}
              disabled={loading}
              placeholder="Describe the role and its responsibilities..."
            />

            {/* Active Status */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={handleCheckboxChange('isActive')}
                  disabled={loading}
                />
              }
              label="Active"
            />

            {/* Permissions */}
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <Typography variant="h6">Permissions</Typography>
                <Typography variant="body2" color="text.secondary">
                  Select the permissions for this role
                </Typography>
              </FormLabel>
              <FormGroup sx={{ mt: 2 }}>
                {availablePermissions.map((permission) => (
                  <FormControlLabel
                    key={permission.id}
                    control={
                      <Checkbox
                        checked={formData.permissionIds.includes(permission.id)}
                        onChange={handlePermissionChange(permission.id)}
                        disabled={loading}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {permission.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {permission.description}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (mode === 'create' ? 'Create Role' : 'Update Role')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RoleFormDialog;
