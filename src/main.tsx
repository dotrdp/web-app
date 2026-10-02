import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import '@fontsource-variable/inter';
import '@fontsource-variable/manrope';
import 'ol/ol.css';
import './styles.css';
import App from './App';

const theme = createTheme({
  palette: { primary: { main: '#244f3e', dark: '#173d30' }, secondary: { main: '#b6d979' }, background: { default: '#f6f7f8', paper: '#ffffff' }, text: { primary: '#23332b', secondary: '#7b837f' } },
  shape: { borderRadius: 10 },
  typography: { fontFamily: 'Inter Variable, Inter, sans-serif', button: { textTransform: 'none', fontWeight: 600, fontSize: 13 } },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 8, padding: '9px 15px', gap: 5 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
    MuiTooltip: { defaultProps: { arrow: true } },
    MuiChip: { styleOverrides: { root: { fontFamily: 'Inter Variable, sans-serif' } } },
  },
});

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? <main className="fatal-error"><img src="/favicon.svg" width="48" alt=""/><h1>No pudimos abrir AgroCebada.</h1><p>Vuelve a cargar la página para recuperar tu sesión.</p><button onClick={() => window.location.reload()}>Volver a cargar</button></main> : this.props.children; }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ThemeProvider theme={theme}><CssBaseline/><ErrorBoundary><App/></ErrorBoundary></ThemeProvider></React.StrictMode>);
