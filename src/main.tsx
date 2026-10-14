import React from 'react';
import ReactDOM from 'react-dom/client';
import 'ol/ol.css';
import './index.css';
import App from './App';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? <main className="fatal-error grid min-h-svh place-content-center justify-items-center gap-3 bg-background p-6 text-center"><img src="/favicon.svg" width="40" alt=""/><h1 className="text-xl font-semibold tracking-tight">No pudimos abrir AgroCebada.</h1><p className="text-sm text-muted-foreground">Vuelve a cargar la página para recuperar tu sesión.</p><button className="mt-2 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={() => window.location.reload()}>Volver a cargar</button></main> : this.props.children; }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><App/></ErrorBoundary></React.StrictMode>);
