import { useState } from "react"
import HomePage from "./Pages/HomePage"
import LoginPage from "./Pages/LoginPage"

function App() {
  const [user, setUser] = useState(false)

  return user ? <HomePage /> : <LoginPage />
}

export default App
