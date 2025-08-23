import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/gloss.css'

// Import setup utility for database initialization
import './utils/setup-database.ts';

createRoot(document.getElementById("root")!).render(<App />);
