
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import PatientsProvider from "./store/PatientsProvider.tsx"
 
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <PatientsProvider>
        <App />
      </PatientsProvider>
    </ThemeProvider>
  </StrictMode>
)
 