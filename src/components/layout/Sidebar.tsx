import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  Collapse,
  Badge,
} from "@mui/material";
import {
  Dashboard,
  People,
  AdminPanelSettings,
  Settings,
  ExpandLess,
  ExpandMore,
  Group,
  VpnKey,
  Analytics,
  Notifications,
  Help,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  width: number;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactElement;
  path?: string;
  children?: MenuItem[];
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Dashboard />,
    path: "/dashboard",
  },
  {
    id: "users",
    title: "User Management",
    icon: <People />,
    path: "/users",
  },
  {
    id: "roles",
    title: "Role Management",
    icon: <Group />,
    path: "/roles",
  },
  {
    id: "permissions",
    title: "Permissions",
    icon: <VpnKey />,
    path: "/permissions",
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: <Analytics />,
    path: "/analytics",
    badge: 3,
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: <Notifications />,
    path: "/notifications",
    badge: 12,
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings />,
    path: "/settings",
  },
  {
    id: "help",
    title: "Help & Support",
    icon: <Help />,
    path: "/help",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, width }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to check if any child menu is active
  const hasActiveChild = (item: MenuItem) => {
    if (item.children) {
      return item.children.some(
        (child) => child.path && location.pathname === child.path
      );
    }
    return false;
  };

  // Get initially expanded items (only those with active children)
  const getInitiallyExpanded = () => {
    return menuItems
      .filter((item) => item.children && hasActiveChild(item))
      .map((item) => item.id);
  };

  const [expandedItems, setExpandedItems] =
    useState<string[]>(getInitiallyExpanded);

  // Update expanded items when location changes
  useEffect(() => {
    const activeParents = getInitiallyExpanded();
    setExpandedItems(activeParents);
  }, [location.pathname]);

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setExpandedItems((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id]
      );
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isItemActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (item: MenuItem) => {
    return hasActiveChild(item);
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.path ? isItemActive(item.path) : isParentActive(item);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={isActive}
            sx={{
              pl: 2 + depth * 2,
              minHeight: 48,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                "& .MuiListItemIcon-root": {
                  color: "primary.contrastText",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActive ? "inherit" : "text.secondary",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
              }}
            />
            {item.badge && (
              <Badge badgeContent={item.badge} color="error" sx={{ mr: 1 }} />
            )}
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
          borderRight: 1,
          borderColor: "divider",
        },
      }}
    >
      {/* Logo/Brand */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <AdminPanelSettings sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ overflow: "auto", flex: 1 }}>
        <List>{menuItems.map((item) => renderMenuItem(item))}</List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          Admin Dashboard v1.0
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          © 2025 Your Company
        </Typography>
      </Box>
    </Drawer>
  );
};
