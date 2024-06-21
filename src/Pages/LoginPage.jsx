import {
  DarkModeOutlined,
  Google,
  LightModeOutlined,
} from "@mui/icons-material"
import { IconButton, Stack, Typography, colors } from "@mui/material"
import { useThemeContext } from "../BaseTheme"

const LoginPage = () => {
  const { mode, toggleMode } = useThemeContext()

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      gap={15}
      height="100svh"
      position="relative"
    >
      <IconButton
        sx={{ position: "absolute", top: "1.5rem", right: "2rem" }}
        onClick={toggleMode}
      >
        {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
      </IconButton>
      <Typography variant="h2">Laric Chat App</Typography>
      <Stack
        alignItems="center"
        bgcolor={colors.deepOrange[500]}
        borderRadius={1.5}
        p={1.5}
      >
        <Typography fontSize="1.15rem">Continue with Google</Typography>
        <IconButton>
          <Google />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default LoginPage
