import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  People,
  Security,
  VpnKey,
  TrendingUp,
  TrendingDown,
  MoreVert,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactElement;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend === 'up' ? (
              <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} fontSize="small" />
            ) : (
              <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} fontSize="small" />
            )}
            <Typography
              variant="body2"
              sx={{ color: trend === 'up' ? 'success.main' : 'error.main' }}
            >
              {change}
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.3% from last month',
      trend: 'up' as const,
      icon: <People />,
      color: '#1976d2',
    },
    {
      title: 'Active Roles',
      value: '23',
      change: '+2 new roles',
      trend: 'up' as const,
      icon: <Security />,
      color: '#2e7d32',
    },
    {
      title: 'Permissions',
      value: '156',
      change: '-3 from last week',
      trend: 'down' as const,
      icon: <VpnKey />,
      color: '#ed6c02',
    },
    {
      title: 'Login Success Rate',
      value: '98.2%',
      change: '+0.5% improvement',
      trend: 'up' as const,
      icon: <TrendingUp />,
      color: '#9c27b0',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: 'John Doe',
      action: 'User created',
      time: '2 minutes ago',
      avatar: 'JD',
    },
    {
      id: 2,
      user: 'Admin',
      action: 'Role permissions updated',
      time: '15 minutes ago',
      avatar: 'A',
    },
    {
      id: 3,
      user: 'Jane Smith',
      action: 'User deactivated',
      time: '1 hour ago',
      avatar: 'JS',
    },
    {
      id: 4,
      user: 'System',
      action: 'Database backup completed',
      time: '2 hours ago',
      avatar: 'S',
    },
    {
      id: 5,
      user: 'Mike Johnson',
      action: 'Password reset requested',
      time: '3 hours ago',
      avatar: 'MJ',
    },
  ];

  const topRoles = [
    { name: 'Administrator', users: 5, percentage: 15 },
    { name: 'Manager', users: 12, percentage: 35 },
    { name: 'Editor', users: 18, percentage: 55 },
    { name: 'Viewer', users: 25, percentage: 75 },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's what's happening with your admin panel today.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Recent Activity
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <List>
                {recentActivity.map((activity, index) => (
                  <ListItem
                    key={activity.id}
                    divider={index < recentActivity.length - 1}
                    sx={{ px: 0 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {activity.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.user} • ${activity.time}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Distribution */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                Role Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {topRoles.map((role, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {role.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {role.users} users
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={role.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                <Chip
                  label="Create User"
                  clickable
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label="Manage Roles"
                  clickable
                  color="secondary"
                  variant="outlined"
                />
                <Chip
                  label="View Reports"
                  clickable
                  color="info"
                  variant="outlined"
                />
                <Chip
                  label="System Settings"
                  clickable
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label="Export Data"
                  clickable
                  color="success"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
