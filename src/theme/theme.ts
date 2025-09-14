import { createTheme } from '@mui/material/styles';
import type { Theme, PaletteMode } from '@mui/material';

// Custom color palette
const getDesignTokens = (mode: PaletteMode): any => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode colors
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff',
          },
          secondary: {
            main: '#dc004e',
            light: '#ff5983',
            dark: '#9a0036',
            contrastText: '#fff',
          },
          background: {
            default: '#fafafa',
            paper: '#fff',
          },
          text: {
            primary: '#212121',
            secondary: '#757575',
          },
          divider: '#e0e0e0',
          grey: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
          },
        }
      : {
          // Dark mode colors
          primary: {
            main: '#90caf9',
            light: '#bbdefb',
            dark: '#64b5f6',
            contrastText: '#000',
          },
          secondary: {
            main: '#f48fb1',
            light: '#f8bbd9',
            dark: '#f06292',
            contrastText: '#000',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b3b3b3',
          },
          divider: '#2e2e2e',
          grey: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
          },
        }),
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#000',
    },
  },
});

export const createAppTheme = (mode: PaletteMode): Theme => {
  const theme = createTheme({
    ...getDesignTokens(mode),
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.125rem',
        fontWeight: 500,
        lineHeight: 1.235,
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.334,
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.6,
      },
      h4: {
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: mode === 'dark' 
              ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
              : '0px 2px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: mode === 'dark' ? '1px solid #2e2e2e' : '1px solid #e0e0e0',
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
            color: mode === 'dark' ? '#ffffff' : '#212121',
            boxShadow: mode === 'dark' 
              ? '0px 1px 4px rgba(0, 0, 0, 0.3)'
              : '0px 1px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#2e2e2e' : '#f5f5f5',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: mode === 'dark' ? '#2e2e2e' : '#e0e0e0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: mode === 'dark' ? '#2e2e2e' : '#f5f5f5',
              borderColor: mode === 'dark' ? '#2e2e2e' : '#e0e0e0',
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: mode === 'dark' ? '#2e2e2e' : '#e0e0e0',
            },
          },
        },
      },
    },
  });

  return theme;
};
