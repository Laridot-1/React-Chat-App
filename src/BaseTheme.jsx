import { ThemeProvider, createTheme, useMediaQuery } from "@mui/material"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const ThemeContext = createContext(null)

const useThemeContext = () => useContext(ThemeContext)

const BaseTheme = ({ children }) => {
  let prefersDarkColor = useMediaQuery("(prefers-color-scheme: dark)")

  const [mode, setMode] = useState(() => {
    let savedMode = localStorage.getItem("mode")
    return savedMode ? savedMode : prefersDarkColor ? "dark" : "light"
  })

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  )

  useEffect(() => {
    localStorage.setItem("mode", mode)
  }, [mode])

  return (
    <ThemeContext.Provider value={{ toggleMode, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

export { BaseTheme, useThemeContext }
