import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import store from './store';
import { ThemeProvider } from './theme/ThemeProvider';
import { router } from './router';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
