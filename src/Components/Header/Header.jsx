import {
  DarkModeOutlined,
  LightModeOutlined,
  Search,
} from "@mui/icons-material"
import {
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Link,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
  colors,
  useMediaQuery,
} from "@mui/material"
import { useThemeContext } from "../../BaseTheme"
import SearchBar from "./SearchBar"
import { useEffect, useRef, useState } from "react"
import { useAppContext } from "../../Context"
import Error from "../Error/Error"
import { signOut } from "firebase/auth"
import { auth, db, storage } from "../../firebase"
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadString } from "firebase/storage"

const Header = () => {
  const { user, setUser, setFilter } = useAppContext()
  const { toggleMode, mode } = useThemeContext()
  const isMd = useMediaQuery("(min-width: 900px)")
  const [isSearching, setIsSearching] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [err, setErr] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    if (!user) return

    setIsLoggingOut(true)
    setFilter([])

    try {
      await signOut(auth)
      localStorage.removeItem("user")
      setUser(null)
    } catch (err) {
      setErr(err.code)
    }
  }

  return (
    <Box
      component="header"
      display="flex"
      gap={2}
      px={2}
      py={1}
      justifyContent="space-between"
      alignItems="center"
      borderBottom={`1px solid ${
        mode === "dark" ? colors.grey[800] : colors.grey[300]
      }`}
    >
      {isSearching && !isMd ? (
        <SearchBar handleBack={setIsSearching} />
      ) : (
        <>
          <Typography variant="h6" letterSpacing={1.5} fontWeight="bold">
            Laric
          </Typography>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flex: 1,
              maxWidth: "250px",
            }}
          >
            <SearchBar />
          </Box>
          <Stack direction="row" alignItems="center">
            <IconButton onClick={toggleMode} disableTouchRipple>
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
            <IconButton
              disableTouchRipple
              sx={{ display: { md: "none" } }}
              onClick={() => setIsSearching(true)}
            >
              <Search />
            </IconButton>
            <Avatar
              sx={{
                ml: 1,
                width: "35px",
                height: "35px",
                cursor: "pointer",
                "&.MuiAvatar-root": {
                  fontSize: "1rem",
                },
              }}
              src={user?.photoUrl}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            />

            <Menu
              open={open}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  setIsEditModalOpen(true)
                  setAnchorEl(null)
                }}
              >
                Edit Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            <EditProfileModal
              open={isEditModalOpen}
              setOpen={setIsEditModalOpen}
            />

            <Error err={err} setErr={setErr} />
          </Stack>
        </>
      )}
    </Box>
  )
}

export default Header

function EditProfileModal({ open, setOpen }) {
  const { user, setUser } = useAppContext()
  const [err, setErr] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [userInfo, setUserInfo] = useState({
    photoUrl: "",
    displayName: "",
    username: "",
  })
  const fileRef = useRef(null)

  const reg = {
    displayName: /^[A-Za-z]+ [A-Za-z]+$/,
    username: /^[a-z]+[0-9]*$/,
  }

  const changePhoto = () => {
    fileRef.current.click()
  }

  const handleFilePicker = (e) => {
    let file = e.target.files[0]
    let maxFileSize = 2 * 1024 * 1024

    if (file && file.type.startsWith("image/")) {
      if (file.size > maxFileSize) {
        setErr("File must be less than 2mb")
        return
      }

      let reader = new FileReader()
      reader.onload = (e) =>
        setUserInfo({ ...userInfo, photoUrl: e.target.result })
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  }

  const handleEdit = async () => {
    if (isUpdating) return

    if (userInfo.displayName.trim() === "" || userInfo.username.trim() === "") {
      setErr("Please fill all fields.")
      return
    } else if (
      userInfo.displayName === user.displayName &&
      userInfo.username === user.username &&
      userInfo.photoUrl === user.photoUrl
    ) {
      return
    } else if (!reg.displayName.test(userInfo.displayName)) {
      setErr(
        "Only alphabetic characters separated by a single space are allowed as display nanes."
      )
      return
    } else if (!reg.username.test(userInfo.username)) {
      setErr(
        "Only lowercase letters and optional numbers at the end are allowd as usernames."
      )
      return
    }

    setIsUpdating(true)

    if (userInfo.username !== user.username) {
      let q = query(
        collection(db, "users"),
        where("username", "==", userInfo.username)
      )
      let querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        setIsUpdating(false)
        setErr("Username already exist")
        return
      }
    }

    let url = ""

    try {
      if (userInfo.photoUrl !== user.photoUrl && userInfo.photoUrl) {
        await uploadString(
          ref(storage, `profilePics/${user.uid}`),
          userInfo.photoUrl,
          "data_url"
        )
        url = await getDownloadURL(ref(storage, `profilePics/${user.uid}`))
      }

      const updatedProfile = {
        ...user,
        displayName: userInfo.displayName,
        username: userInfo.username,
        photoUrl: url,
      }
      await updateDoc(doc(db, "users", user.uid), updatedProfile)

      setUser({
        ...user,
        displayName: user.displayName,
        username: user.username,
        photoUrl: url,
      })
    } catch (err) {
      setErr(err.code)
    } finally {
      setIsUpdating(false)
    }
  }

  const modalStyle = {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -20%)",
    width: "90%",
    maxWidth: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
    pb: 4,
  }

  useEffect(() => {
    if (user) {
      setUserInfo({
        username: "" || user.username,
        photoUrl: "" || user.photoUrl,
        displayName: "" || user.displayName,
      })
    }
  }, [user, open])

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Stack sx={modalStyle} gap={2}>
          {isUpdating && (
            <Box width="100%" position="absolute" top={0} left={0}>
              <LinearProgress />
            </Box>
          )}
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Avatar sx={{ width: 90, height: 90 }} src={userInfo.photoUrl} />
            <Button
              variant="contained"
              onClick={changePhoto}
              disabled={isUpdating}
            >
              Change Photo
            </Button>
            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={handleFilePicker}
              accept="image/*"
            />
          </Stack>
          <Stack gap={2.5}>
            <TextField
              size="small"
              label={userInfo.displayName ? "" : "Display Name"}
              name="displayName"
              value={userInfo.displayName}
              onChange={handleChange}
            />
            <TextField
              size="small"
              label={userInfo.username ? "" : "Username"}
              name="username"
              value={userInfo.username}
              onChange={handleChange}
            />
          </Stack>
          <Stack direction="row" gap={1} justifyContent="center">
            <Button
              variant="contained"
              color="error"
              disableTouchRipple
              onClick={() => {
                setUserInfo({ username: "", displayName: "", photoUrl: "" })
                setOpen(false)
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableTouchRipple
              onClick={handleEdit}
              disabled={isUpdating}
            >
              Edit
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Error err={err} setErr={setErr} />
    </>
  )
}
