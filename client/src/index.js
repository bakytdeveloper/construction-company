import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                            fontFamily: 'Inter, sans-serif'
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#4caf50',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#f44336',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
);