import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from 'ui/react/App';
import { initGame } from 'ui/engine/initGame';

Sentry.init({
  dsn: 'https://349f5174f58c6bcd4b3b5fb5fb738ff3@o4509070478147584.ingest.de.sentry.io/4509070482210896', // Replace with your Sentry DSN
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

const queryClient = new QueryClient();

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('phaser-game-container');
  if (gameContainer) {
    initGame(gameContainer);
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
