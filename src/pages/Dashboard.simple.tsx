import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  People,
  Security,
  Settings,
  TrendingUp,
  Add,
  MoreVert,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value.toLocaleString()}
          </Typography>
          {trend !== undefined && (
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUp 
                fontSize="small" 
                color={trend >= 0 ? 'success' : 'error'} 
              />
              <Typography 
                variant="body2" 
                color={trend >= 0 ? 'success.main' : 'error.main'}
                sx={{ ml: 0.5 }}
              >
                {trend >= 0 ? '+' : ''}{trend}% this month
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.main` }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { users } = useSelector((state: RootState) => state.users);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  // Mock data - in real app this would come from API
  const stats = {
    totalUsers: users.length || 156,
    activeUsers: users.filter(u => u.isActive).length || 142,
    totalRoles: 8,
    totalPermissions: 24,
  };

  const recentUsers = users.slice(0, 5);

  const quickActions = [
    { label: 'Create User', icon: <People />, action: () => console.log('Create user') },
    { label: 'Manage Roles', icon: <Security />, action: () => console.log('Manage roles') },
    { label: 'System Settings', icon: <Settings />, action: () => console.log('Settings') },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {currentUser?.firstName || 'Admin'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your application today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 3, 
          mb: 4,
          '& > *': { 
            flex: '1 1 300px',
            minWidth: '250px'
          }
        }}
      >
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<People />}
          color="primary"
          trend={12}
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<People />}
          color="success"
          trend={8}
        />
        <StatsCard
          title="Total Roles"
          value={stats.totalRoles}
          icon={<Security />}
          color="secondary"
        />
        <StatsCard
          title="Permissions"
          value={stats.totalPermissions}
          icon={<Settings />}
          color="warning"
        />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Quick Actions */}
        <Box sx={{ flex: '0 0 350px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={action.icon}
                    onClick={action.action}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Users */}
        <Box sx={{ flex: '1 1 500px' }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Users
                </Typography>
                <Button size="small" startIcon={<Add />}>
                  Add User
                </Button>
              </Box>
              
              <List>
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                  <ListItem key={user.id}>
                    <ListItemAvatar>
                      <Avatar src={user.avatar}>
                        {user.firstName[0]}{user.lastName[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.firstName} ${user.lastName}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                          <Box mt={0.5} display="flex" gap={1}>
                            <Chip 
                              label={user.isActive ? 'Active' : 'Inactive'} 
                              size="small"
                              color={user.isActive ? 'success' : 'default'}
                            />
                            {user.isEmailVerified && (
                              <Chip label="Verified" size="small" color="primary" />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <MoreVert />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )) : (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">
                      No users found. Create your first user to get started.
                    </Typography>
                    <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }}>
                      Create User
                    </Button>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* System Health */}
      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 3,
                '& > *': { 
                  flex: '1 1 300px',
                  minWidth: '200px'
                }
              }}
            >
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Database</Typography>
                  <Typography variant="body2" color="success.main">98%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={98} color="success" />
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">API Response</Typography>
                  <Typography variant="body2" color="success.main">95%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={95} color="success" />
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Server Load</Typography>
                  <Typography variant="body2" color="warning.main">76%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={76} color="warning" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
