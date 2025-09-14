import React from 'react';
import type { ReactNode } from 'react';
import { Box, Container, Toolbar } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectSidebarOpen } from '../../store';
import { initializeTheme } from '../../store';
import { useEffect } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const sidebarWidth = 240; // Fixed width since we don't have selectSidebarWidth

  // Initialize theme settings from localStorage
  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} width={sidebarWidth} />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s',
          ml: sidebarOpen ? 0 : `-${sidebarWidth}px`,
        }}
      >
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} />
        
        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: 'background.default',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Toolbar /> {/* Spacer for fixed header */}
          <Container
            maxWidth={false}
            sx={{
              py: 3,
              px: { xs: 2, sm: 3 },
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
