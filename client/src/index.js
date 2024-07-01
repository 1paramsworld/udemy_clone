import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./context/auth";
import { SearchProvider } from './context/Search';
import { CartProvider } from './context/cart';
// import 'antd/dist/reset.css'; // Ensure this import is at the top of the file


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
        <SearchProvider>
          <CartProvider>
              <App/>
          </CartProvider>
        </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
);
reportWebVitals();
