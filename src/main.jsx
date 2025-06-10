// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// import 'antd/dist/reset.css';
import '@ant-design/v5-patch-for-react-19'
import { Provider } from 'react-redux';
import store from './redux/store';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);