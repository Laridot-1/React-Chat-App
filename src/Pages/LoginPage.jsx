import {
  DarkModeOutlined,
  Google,
  LightModeOutlined,
} from "@mui/icons-material"
import {
  IconButton,
  LinearProgress,
  Stack,
  Typography,
  colors,
} from "@mui/material"
import { useAppContext } from "../Context"
import { useThemeContext } from "../BaseTheme"
import { useState } from "react"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { generateFromEmail } from "unique-username-generator"
import Error from "../Components/Error/Error"

const LoginPage = () => {
  const { mode, toggleMode } = useThemeContext()
  const [err, setErr] = useState("")
  const [isLoadingHomePage, setIsLoadingHomePage] = useState(false)
  const { setUser } = useAppContext()

  const handleSignin = async () => {
    if (isLoadingHomePage) return

    setIsLoadingHomePage(true)

    try {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      const existingUser = await getDoc(doc(db, "users", user.uid))

      if (existingUser.exists()) {
        localStorage.setItem("user", JSON.stringify(existingUser.data()))
        setUser(existingUser.data())
        return
      }

      let username = generateFromEmail(user.email)
      const newUser = {
        displayName: user.displayName,
        photoUrl: user.photoURL,
        email: user.email,
        uid: user.uid,
        username,
        blockedUsers: [],
      }
      await setDoc(doc(db, "users", user.uid), newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
    } catch (err) {
      setErr(err.code)
    } finally {
      setIsLoadingHomePage(false)
    }
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      gap={15}
      height="100%"
      position="relative"
    >
      {isLoadingHomePage && (
        <LinearProgress
          sx={{ width: "100%", position: "absolute", top: "0" }}
        />
      )}
      <IconButton
        sx={{ position: "absolute", top: "1.5rem", right: "2rem" }}
        onClick={toggleMode}
        disableTouchRipple
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
        <Typography fontSize="1.15rem" color={colors.common.white}>
          Continue with Google
        </Typography>
        <IconButton disableTouchRipple onClick={handleSignin}>
          <Google sx={{ fill: colors.common.white }} />
        </IconButton>
      </Stack>
      <Error err={err} setErr={setErr} />
    </Stack>
  )
}

export default LoginPage
