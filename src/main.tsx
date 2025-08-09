import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import App from "./app.tsx"
import { ThemeProvider } from "@/components/theme/theme-provider.tsx"
import { UserProvider } from "@/store/user-provider.tsx"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <UserProvider>
            <BrowserRouter>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </UserProvider>
    </StrictMode>
)
