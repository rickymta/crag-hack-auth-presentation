import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Settings,
  Logout,
  Notifications,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar, toggleTheme, selectThemeMode, selectAuthUser } from '../../store';
import { logoutAsync } from '../../store/slices/authSlice';
import { SafeAvatar } from '../common/SafeAvatar';

interface HeaderProps {
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeMode = useAppSelector(selectThemeMode);
  const currentUser = useAppSelector(selectAuthUser);
  const { profile } = useAppSelector((state) => state.userProfile);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleMenuToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
    handleProfileMenuClose();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    handleProfileMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ml: sidebarOpen ? '280px' : '0px',
        width: sidebarOpen ? 'calc(100% - 280px)' : '100%',
        transition: 'width 0.3s, margin-left 0.3s',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={handleMenuToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={themeMode === 'dark'}
                onChange={handleThemeToggle}
                icon={<LightMode />}
                checkedIcon={<DarkMode />}
              />
            }
            label=""
            sx={{ mr: 1 }}
          />

          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            onClick={handleNotificationMenuOpen}
          >
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <SafeAvatar
              src={profile?.avatar || currentUser?.avatar}
              sx={{ width: 32, height: 32 }}
            >
              {currentUser?.fullName?.split(' ').map((name: string) => name[0]).join('').substring(0, 2) || 'U'}
            </SafeAvatar>
          </IconButton>
        </Box>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="primary-search-account-menu"
        keepMounted
        open={isMenuOpen}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" noWrap>
            {currentUser?.fullName || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {currentUser?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        id="notification-menu"
        keepMounted
        open={isNotificationMenuOpen}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1">
            Notifications
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box>
            <Typography variant="body2">New user registered</Typography>
            <Typography variant="caption" color="text.secondary">
              2 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box>
            <Typography variant="body2">Role permissions updated</Typography>
            <Typography variant="caption" color="text.secondary">
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box>
            <Typography variant="body2">System maintenance scheduled</Typography>
            <Typography variant="caption" color="text.secondary">
              2 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box>
            <Typography variant="body2">New feature deployed</Typography>
            <Typography variant="caption" color="text.secondary">
              1 day ago
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};
