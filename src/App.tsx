import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import store from './store';
import { ThemeProvider } from './theme/ThemeProvider';
import { router } from './router';
import { TokenRefreshProvider } from './components/auth/TokenRefreshProvider';
import { ProfileProvider } from './components/profile/ProfileProvider';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <TokenRefreshProvider>
          <ProfileProvider>
            <RouterProvider router={router} />
          </ProfileProvider>
        </TokenRefreshProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
