import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { CssBaseline } from "@mui/material"
import { BaseTheme } from "./BaseTheme.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BaseTheme>
    <CssBaseline enableColorScheme />
    <App />
  </BaseTheme>
)
