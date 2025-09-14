import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Alert,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
} from '@mui/x-data-grid';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector, fetchRoles, deleteRole, toggleRoleStatus, clearRoleError } from '../../store';
import type { RoleDto } from '../../types/dto/role';
import RoleFormDialog from '../../components/roles/RoleFormDialog';

const RolesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roles, loading, error } = useAppSelector((state) => state.roles);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');

  const loadRoles = useCallback(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // Filter roles based on search term - ensure roles is always an array
  const safeRoles = Array.isArray(roles) ? roles : [];
  const filteredRoles = safeRoles.filter((role: RoleDto) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    setSelectedRole(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEditRole = (role: RoleDto) => {
    setSelectedRole(role);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteRole = (id: string) => {
    setSelectedRoleId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRoleId) {
      try {
        await dispatch(deleteRole(selectedRoleId)).unwrap();
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
      setDeleteDialogOpen(false);
      setSelectedRoleId(null);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await dispatch(toggleRoleStatus({ id, isActive: !isActive })).unwrap();
    } catch (error) {
      console.error('Failed to toggle role status:', error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRole(null);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPermissionCount = (permissions: string[] | undefined) => {
    const count = permissions?.length || 0;
    if (count === 0) return 'No permissions';
    if (count === 1) return '1 permission';
    return `${count} permissions`;
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Role Name',
      width: 200,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'userCount',
      headerName: 'Users',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value || 0}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const permissionCount = params.value?.length || 0;
        return (
          <Chip
            label={formatPermissionCount(params.value)}
            size="small"
            variant="outlined"
            color={permissionCount > 0 ? 'primary' : 'default'}
            sx={{ cursor: 'pointer' }}
            onClick={() => handleEditRole(params.row as RoleDto)}
          />
        );
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Switch
              checked={params.value}
              onChange={(e) => handleToggleActive(params.row.id, e.target.checked)}
              size="small"
            />
          }
          label={params.value ? 'Active' : 'Inactive'}
          labelPlacement="end"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditRole(params.row as RoleDto)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteRole(params.row.id)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Role Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadRoles}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateRole}
          >
            Create Role
          </Button>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearRoleError())}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search roles by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Box>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredRoles}
          columns={columns}
          loading={loading}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& .MuiDataGrid-cell--textCenter': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& .MuiDataGrid-columnHeader': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              textAlign: 'center',
              width: '100%',
            },
          }}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Role Form Dialog */}
      {/* Role Form Dialog */}
      <RoleFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        role={selectedRole}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this role? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesPage;
