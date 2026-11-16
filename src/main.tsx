import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { applyTheme } from './config/theme';
import App from './App';

applyTheme();
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
