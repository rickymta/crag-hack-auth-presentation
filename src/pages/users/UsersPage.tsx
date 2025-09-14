import React, { useState, useEffect, useCallback } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Alert,
  Avatar,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import type { GridColDef, GridRowParams } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchUsers, deleteUser, clearError, fetchAllRoles } from "../../store";
import UserFormDialog from "../../components/users/UserFormDialog";
import type { UserListItemDto, UserFilterDto } from "../../types/dto/user";
import { deactivateUser, activateUser } from "../../store/slices/userSlice";

const UsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, pagination } = useSelector(
    (state: RootState) => state.users
  );
  const { roles } = useSelector((state: RootState) => state.roles);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<UserListItemDto | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const loadUsers = useCallback(() => {
    const filterParams: UserFilterDto = {
      pageNumber: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      sortBy: "createdAt",
      sortDirection: "desc",
      searchTerm: searchTerm || undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    };
    dispatch(fetchUsers(filterParams));
  }, [
    dispatch,
    paginationModel.page,
    paginationModel.pageSize,
    searchTerm,
    statusFilter,
  ]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Fetch roles only once
  useEffect(() => {
    dispatch(fetchAllRoles());
  }, [dispatch]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEditUser = (user: UserListItemDto) => {
    // Map role names to role IDs
    const roleDataValues = Array.isArray(roles)
      ? roles
      : roles && (roles as any).roles
      ? (roles as any).roles
      : [];
    const roleIds =
      user.roles?.map((roleName) => {
        const role = roleDataValues.find((r: any) => r.name === roleName);
        return role?.id || roleName; // fallback to roleName if ID not found
      }) || [];

    // Create updated user object with roleIds
    const userWithRoleIds = {
      ...user,
      roleIds: roleIds,
    };
    setSelectedUser(userWithRoleIds);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      if (!isActive) {
        // Deactivate user
        await dispatch(deactivateUser(id));
      } else {
        // Activate user
        await dispatch(activateUser(id));
      }
      loadUsers();
    } catch (error) {
      console.error("Failed to toggle role status:", error);
    }
  };

  const handleDeleteUser = (id: string) => {
    setSelectedUserId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      await dispatch(deleteUser(selectedUserId));
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
      loadUsers();
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "-";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRoleCount = (roles: string[] | undefined) => {
    const count = roles?.length || 0;
    if (count === 0) return 'No roles';
    if (count === 1) return '1 role';
    return `${count} roles`;
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Avatar src={params.row.avatar} sx={{ width: 32, height: 32 }}>
          {params.row.firstName?.[0]}
          {params.row.lastName?.[0]}
        </Avatar>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      align: "center",
      headerAlign: "center",
      valueGetter: (_value, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2">{params.value}</Typography>
          {params.row.isEmailVerified ? (
            <Chip label="V" color="success" size="small" />
          ) : (
            <Chip label="X" color="warning" size="small" />
          )}
        </Box>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2">{params.value || "-"}</Typography>
          {params.value &&
            (params.row.isPhoneVerified ? (
              <Chip label="V" color="success" size="small" />
            ) : (
              <Chip label="X" color="warning" size="small" />
            ))}
        </Box>
      ),
    },
    {
      field: "roles",
      headerName: "Roles",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const userCount = params.value?.length || 0;
        return (
          <Chip
            label={formatRoleCount(params.value)}
            size="small"
            variant="outlined"
            color={userCount > 0 ? "primary" : "default"}
            onClick={() => handleEditUser(params.row)}
          />
        );
      },
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Switch
              checked={params.value}
              onChange={(e) =>
                handleToggleActive(params.row.id, e.target.checked)
              }
              size="small"
            />
          }
          label={params.value ? "Active" : "Inactive"}
          labelPlacement="end"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 120,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "lastLoginAt",
      headerName: "Last Login",
      width: 120,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      align: "center",
      headerAlign: "center",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditUser(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Delete"
          onClick={() => handleDeleteUser(params.row.id)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <FormControl size="medium" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              input={<OutlinedInput label="Status" />}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
          >
            Create User
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadUsers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>

        {/* Error Display */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => dispatch(clearError())}
          >
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          rowCount={pagination.totalCount}
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
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
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiDataGrid-cell--textCenter": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiDataGrid-columnHeader": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              textAlign: "center",
              width: "100%",
            },
          }}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Form Dialog */}
      <UserFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        user={selectedUser}
        mode={dialogMode}
      />
    </Box>
  );
};

export default UsersPage;
