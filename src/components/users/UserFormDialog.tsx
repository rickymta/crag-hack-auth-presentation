import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { PhotoCamera, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { createUser, updateUser, fetchUsers, fetchAllRoles } from "../../store";
import type {
  UserCreateDto,
  UserAdminUpdateDto,
  UserListItemDto,
} from "../../types/dto/user";

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  user?: UserListItemDto | null;
  mode: "create" | "edit";
}

interface FormData {
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  roleIds: string[];
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onClose,
  user,
  mode,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { roles } = useSelector((state: RootState) => state.roles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch roles on component mount
  useEffect(() => {
    dispatch(fetchAllRoles());
  }, [dispatch]);

  // Ensure roles is always an array
  let rolesArray: any[] = [];
  try
  {
    rolesArray = roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
  }

  const [formData, setFormData] = useState<FormData>({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    avatar: "",
    isEmailVerified: false,
    isPhoneVerified: false,
    isActive: true,
    roleIds: [],
  });

  useEffect(() => {
    if (user && mode === "edit") {
      // Map role names to role IDs
      const userRoleIds =
        user.roles
          ?.map((roleName) => {
            const role = rolesArray.find(
              (r: { id: string; name: string }) => r.name === roleName
            );
            return role?.id;
          })
          .filter(Boolean) || []; // filter out undefined values

      setFormData({
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        password: "",
        confirmPassword: "",
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || "",
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        isActive: user.isActive,
        roleIds: userRoleIds,
      });
    } else {
      setFormData({
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        avatar: "",
        isEmailVerified: false,
        isPhoneVerified: false,
        isActive: true,
        roleIds: [],
      });
    }
    setError(null);
    setSuccess(false);
  }, [user, mode, open]);

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleCheckboxChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.checked,
      }));
    };

  const handleRoleChange = (event: any) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      roleIds: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }

    if (mode === "create") {
      if (!formData.password) {
        setError("Password is required");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
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
      if (mode === "create") {
        const createData: UserCreateDto = {
          email: formData.email,
          phoneNumber: formData.phoneNumber || undefined,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          avatar: formData.avatar || undefined,
          isEmailVerified: formData.isEmailVerified,
          isPhoneVerified: formData.isPhoneVerified,
          isActive: formData.isActive,
          roleIds: formData.roleIds,
        };

        const result = await dispatch(createUser(createData));
        if (createUser.fulfilled.match(result)) {
          setSuccess(true);
          setTimeout(() => {
            onClose();
            dispatch(
              fetchUsers({
                pageNumber: 1,
                pageSize: 10,
                sortBy: "createdAt",
                sortDirection: "desc",
              })
            );
          }, 1000);
        } else {
          setError((result.payload as string) || "Failed to create user");
        }
      } else {
        const updateData: UserAdminUpdateDto = {
          id: user!.id,
          email: formData.email,
          phoneNumber: formData.phoneNumber || undefined,
          firstName: formData.firstName,
          lastName: formData.lastName,
          avatar: formData.avatar || undefined,
          isEmailVerified: formData.isEmailVerified,
          isPhoneVerified: formData.isPhoneVerified,
          isActive: formData.isActive,
          roleIds: formData.roleIds,
        };

        console.log("updateData:", updateData);
        const result = await dispatch(updateUser({ userData: updateData }));
        if (updateUser.fulfilled.match(result)) {
          setSuccess(true);
          setTimeout(() => {
            onClose();
            dispatch(
              fetchUsers({
                pageNumber: 1,
                pageSize: 10,
                sortBy: "createdAt",
                sortDirection: "desc",
              })
            );
          }, 1000);
        } else {
          setError((result.payload as string) || "Failed to update user");
        }
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
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
          {mode === "create" ? "Create New User" : "Edit User"}
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
              {mode === "create"
                ? "User created successfully!"
                : "User updated successfully!"}
            </Alert>
          )}

          <Stack spacing={2}>
            {/* Avatar */}
            <Box display="flex" justifyContent="center" mb={2}>
              <Box position="relative">
                <Avatar src={formData.avatar} sx={{ width: 80, height: 80 }}>
                  {formData.firstName?.[0]}
                  {formData.lastName?.[0]}
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: -5,
                    right: -5,
                    backgroundColor: "background.paper",
                    "&:hover": { backgroundColor: "background.paper" },
                  }}
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </IconButton>
              </Box>
            </Box>

            {/* Basic Info */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                disabled={loading}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                required
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                disabled={loading}
              />
              <TextField
                required
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                disabled={loading}
              />
            </Box>

            {/* Password fields for create mode */}
            {mode === "create" && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  disabled={loading}
                />
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  disabled={loading}
                />
              </Box>
            )}

            {/* Roles */}
            <FormControl fullWidth>
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                value={formData.roleIds}
                onChange={handleRoleChange}
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const role = rolesArray.find(
                        (r: { id: string }) => r.id === value
                      );
                      return (
                        <Chip
                          key={value}
                          label={role?.name || value}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
                disabled={loading}
              >
                {rolesArray.map((role: { id: string; name: string }) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status checkboxes */}
            <FormControl component="fieldset">
              <FormLabel component="legend">Status</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isActive}
                      onChange={handleCheckboxChange("isActive")}
                      disabled={loading}
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isEmailVerified}
                      onChange={handleCheckboxChange("isEmailVerified")}
                      disabled={loading}
                    />
                  }
                  label="Email Verified"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isPhoneVerified}
                      onChange={handleCheckboxChange("isPhoneVerified")}
                      disabled={loading}
                    />
                  }
                  label="Phone Verified"
                />
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
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Create User"
              : "Update User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormDialog;
