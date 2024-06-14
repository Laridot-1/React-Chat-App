import { Container, Typography } from "@mui/material"

function App() {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: "100svh",
        overflow: "hidden",
      }}
    >
      <Typography variant="h3">Chat App</Typography>
    </Container>
  )
}

export default App
