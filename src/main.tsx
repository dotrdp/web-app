import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import 'ol/ol.css';
import './theme.css';
import './shell.css';
import App from './App';

const sans = "'Geist', system-ui, sans-serif";
// Material UI keeps its accessible behaviour; the theme only maps it onto the
// AgroCebada tokens in theme.css so its controls read as one family.
const theme = createTheme({
  palette: {
    primary: { main: '#1e6b47', dark: '#17573a', contrastText: '#ffffff' },
    secondary: { main: '#24292a', contrastText: '#ffffff' },
    error: { main: '#dc2626' }, warning: { main: '#b45309' }, info: { main: '#2563eb' }, success: { main: '#3d6b13' },
    background: { default: '#f7f7f6', paper: '#ffffff' },
    text: { primary: '#1c211e', secondary: '#646a66' },
    divider: '#e3e4e2',
  },
  shape: { borderRadius: 6 },
  typography: { fontFamily: sans, fontSize: 13, button: { textTransform: 'none', fontWeight: 500, fontSize: 13, letterSpacing: 0 } },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { fontFamily: sans } } },
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiButton: {
      defaultProps: { disableElevation: true, size: 'small' },
      styleOverrides: {
        root: { borderRadius: 6, minHeight: 34, padding: '6px 14px', gap: 4, fontWeight: 500, transition: 'background-color .15s, border-color .15s, color .15s' },
        text: { color: '#1c211e', '&:hover': { backgroundColor: '#f4f4f2' } },
        outlined: { color: '#1c211e', borderColor: '#cfd2ce', backgroundColor: '#fff', boxShadow: '0 1px 2px rgb(13 18 15 / .05)', '&:hover': { backgroundColor: '#f4f4f2', borderColor: '#b9bdb8' } },
        contained: { '&:hover': { backgroundColor: '#17573a' } },
        sizeSmall: { minHeight: 30, padding: '4px 10px', fontSize: 12 },
      },
    },
    MuiIconButton: { styleOverrides: { root: { borderRadius: 6, color: '#1c211e', '&:hover': { backgroundColor: '#f4f4f2' } } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 6, backgroundColor: '#fff', fontSize: 13, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cfd2ce' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#b9bdb8' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1e6b47', borderWidth: 1, boxShadow: '0 0 0 3px rgb(30 107 71 / .14)' } },
        input: { padding: '8.5px 12px' },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' }, outlined: { borderColor: '#e6e7e4' } } },
    MuiMenu: { styleOverrides: { paper: { border: '1px solid #e6e7e4', boxShadow: '0 8px 24px -6px rgb(13 18 15 / .14)', marginTop: 4 } } },
    MuiMenuItem: { styleOverrides: { root: { fontSize: 13, borderRadius: 6, margin: '0 4px', minHeight: 32 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 10, border: '1px solid #e6e7e4', boxShadow: '0 24px 48px -12px rgb(13 18 15 / .25)' } } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgb(6 9 7 / .45)', backdropFilter: 'blur(2px)' } } },
    MuiDrawer: { styleOverrides: { paper: { borderColor: '#e6e7e4' } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 10, fontSize: 13, border: '1px solid', alignItems: 'center' }, standardInfo: { borderColor: '#d8e6f5', backgroundColor: '#f5f9fd' }, standardWarning: { borderColor: '#f6dcae', backgroundColor: '#fffaf0' }, standardError: { borderColor: '#f6caca', backgroundColor: '#fef6f6' }, standardSuccess: { borderColor: '#d6eeb0', backgroundColor: '#f6fbec' } } },
    MuiSnackbarContent: { styleOverrides: { root: { backgroundColor: '#24292a', borderRadius: 10, fontSize: 13, boxShadow: '0 12px 32px -8px rgb(13 18 15 / .4)' } } },
    MuiTooltip: { defaultProps: { arrow: false }, styleOverrides: { tooltip: { backgroundColor: '#24292a', fontSize: 12, borderRadius: 6, padding: '5px 9px' } } },
    MuiChip: { styleOverrides: { root: { fontFamily: sans, borderRadius: 999 } } },
    MuiPaginationItem: { styleOverrides: { root: { borderRadius: 6, fontSize: 12 } } },
    MuiSlider: { styleOverrides: { root: { color: '#1e6b47' }, thumb: { width: 16, height: 16, backgroundColor: '#fff', border: '2px solid #1e6b47', boxShadow: 'none', '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 6px rgb(13 18 15 / .08)' } }, rail: { backgroundColor: '#e6e7e4', opacity: 1 } } },
    MuiCheckbox: { styleOverrides: { root: { color: '#b9bdb8', '&.Mui-checked': { color: '#1e6b47' } } } },
  },
});

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? <main className="fatal-error"><img src="/favicon.svg" width="40" alt=""/><h1>No pudimos abrir AgroCebada.</h1><p>Vuelve a cargar la página para recuperar tu sesión.</p><button className="ui-btn ui-btn-primary" onClick={() => window.location.reload()}>Volver a cargar</button></main> : this.props.children; }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ThemeProvider theme={theme}><CssBaseline/><ErrorBoundary><App/></ErrorBoundary></ThemeProvider></React.StrictMode>);
