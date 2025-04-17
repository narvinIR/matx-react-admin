import { useRoutes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import MatxTheme from './components/MatxTheme/MatxTheme.jsx';
import SettingsProvider from './contexts/SettingsContext';
import { AuthProvider } from './contexts/FirebaseAuthContext';
import routes from './routes';
import '../__api__';
import { useEffect } from 'react';

export default function App() {
  const content = useRoutes(routes);
  return (
    <SettingsProvider>
      <AuthProvider>
        <MatxTheme>
          <CssBaseline />
          {content}
          <div>Check console</div>
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
  );
}