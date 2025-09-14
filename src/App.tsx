import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import store from './store';
import { ThemeProvider } from './theme/ThemeProvider';
import { router } from './router';
import { TokenRefreshProvider } from './components/auth/TokenRefreshProvider';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <TokenRefreshProvider>
          <RouterProvider router={router} />
        </TokenRefreshProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
