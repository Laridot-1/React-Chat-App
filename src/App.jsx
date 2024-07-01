import HomePage from "./Pages/HomePage"
import LoginPage from "./Pages/LoginPage"
import { Container } from "@mui/material"
import { useAppContext } from "./Context"

function App() {
  const { user } = useAppContext()
  const localData = JSON.parse(localStorage.getItem("user"))

  const canVisitHomePage = user || localData

  return (
    <Container maxWidth={false} disableGutters sx={{ height: "100svh" }}>
      {canVisitHomePage ? <HomePage /> : <LoginPage />}
    </Container>
  )
}

export default App
