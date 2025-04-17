
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Clear any existing console
console.clear();
console.log("🚀 Application Bootstrap Starting...");

// Check environment
console.log('📊 Environment Check:', {
  MODE: import.meta.env.MODE,
  BASE_URL: import.meta.env.BASE_URL,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
});

// Check if styles are loaded
const styles = document.styleSheets;
console.log(`📝 Stylesheets loaded: ${styles.length}`);

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error("❌ Fatal: Root element not found!")
  throw new Error('Failed to find the root element')
}

try {
  console.log("1️⃣ Creating root...");
  const root = createRoot(rootElement);
  
  console.log("2️⃣ Starting render...");
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  
  console.log("3️⃣ Render completed!");
} catch (error) {
  console.error("❌ Render failed:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1 style="color: red;">Error Starting App</h1>
      <pre style="text-align: left; background: #f0f0f0; padding: 10px;">${error}</pre>
    </div>
  `;
}


