import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from "./context/auth/AuthContext.tsx";
import { NotificationProvider } from "./context/notification/NotificationContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <NotificationProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </NotificationProvider>
    </StrictMode>,
)