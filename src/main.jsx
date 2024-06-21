import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { CssBaseline } from "@mui/material"
import { BaseTheme } from "./BaseTheme.jsx"
import { Context } from "./Context.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <Context>
    <BaseTheme>
      <CssBaseline enableColorScheme />
      <App />
    </BaseTheme>
  </Context>
)
