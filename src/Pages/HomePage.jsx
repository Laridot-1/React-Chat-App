import {
  Avatar,
  Box,
  Divider,
  Fab,
  IconButton,
  LinearProgress,
  Modal,
  Skeleton,
  Stack,
  TextField,
  Typography,
  colors,
  useMediaQuery,
} from "@mui/material"
import { Add, Chat, Search } from "@mui/icons-material"

import { useThemeContext } from "../BaseTheme"
import { useAppContext } from "../Context"

import Header from "../Components/Header/Header"
import ChatList from "../Components/ChatList/ChatList"
import Media from "../Components/Media/Media"
import MessageWrapper from "../Components/Message/MessageWrapper"

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import { db } from "../firebase"

import { useState } from "react"
import Error from "../Components/Error/Error"

const HomePage = () => {
  const isSm = useMediaQuery("(max-width: 899px)")

  const { mode } = useThemeContext()
  const { chat } = useAppContext()

  const [open, setOpen] = useState(false)

  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [isMediaOpen, setIsMediaOpen] = useState(false)

  const [isOpeningChat, setIsOpeningChat] = useState(false)

  return (
    <Box display="flex" height="100%" position="relative">
      {isOpeningChat && (
        <Box width="100%" position="absolute" top={0}>
          <LinearProgress />
        </Box>
      )}
      {isMessageOpen && isSm ? (
        isMediaOpen ? (
          <Media setIsMediaOpen={setIsMediaOpen} />
        ) : (
          <MessageWrapper
            key={chat.docId}
            setIsMessageOpen={setIsMessageOpen}
            setIsMediaOpen={setIsMediaOpen}
          />
        )
      ) : (
        <Stack
          height="100%"
          overflow="hidden"
          position="relative"
          sx={{
            borderRight: {
              xs: "none",
              md: `1px solid ${
                mode === "dark" ? colors.grey[800] : colors.grey[300]
              }`,
            },
            maxWidth: {
              xs: "100%",
              md: "400px",
            },
            flex: {
              xs: 1,
              md: "auto",
            },
          }}
        >
          <Header />
          <ChatList
            setIsMessageOpen={setIsMessageOpen}
            isOpeningChat={isOpeningChat}
            setIsOpeningChat={setIsOpeningChat}
          />
          <Fab
            sx={{
              bottom: "4rem",
              right: "1rem",
              position: "absolute",
              color: colors.grey[800],
            }}
            onClick={() => setOpen(true)}
          >
            <Add />
          </Fab>

          <AddUserModal
            open={open}
            setOpen={setOpen}
            setIsMessageOpen={setIsMessageOpen}
            isOpeningChat={isOpeningChat}
            setIsOpeningChat={setIsOpeningChat}
          />
        </Stack>
      )}
      <Box display={{ xs: "none", md: "flex" }} flex={1}>
        {isMessageOpen ? (
          isMediaOpen ? (
            <Media setIsMediaOpen={setIsMediaOpen} />
          ) : (
            <MessageWrapper
              key={chat.docId}
              setIsMessageOpen={setIsMessageOpen}
              setIsMediaOpen={setIsMediaOpen}
            />
          )
        ) : (
          <Box flex={1} display="flex" justifyContent="center" pt={15}>
            <Typography variant="h4">Select a chat to start texting</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default HomePage

function AddUserModal({
  open,
  setOpen,
  setIsMessageOpen,
  setIsOpeningChat,
  isOpeningChat,
}) {
  const [val, setVal] = useState("")
  const [err, setErr] = useState("")
  const [isSearchingUser, setIsSearchingUser] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const { user, setChat, chat } = useAppContext()

  const handleSearch = async () => {
    if (isSearchingUser) return
    if (!val) return

    setUserProfile(null)
    setIsSearchingUser(true)

    try {
      const q = query(collection(db, "users"), where("username", "==", val))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((res) => {
        if (res.exists()) setUserProfile(res.data())
        else setUserProfile(null)
      })
    } catch (err) {
      setErr(err.code)
    } finally {
      setIsSearchingUser(false)
      setVal("")
    }
  }

  const handleChat = async () => {
    if (isOpeningChat) return

    setIsOpeningChat(true)

    try {
      const q = query(
        collection(db, "chatList"),
        where("participants", "in", [
          [userProfile.uid, user.uid],
          [user.uid, userProfile.uid],
        ])
      )
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        const newChat = {
          lastMessage: "",
          time: "",
          senderId: user.uid,
          isSeen: false,
          messageType: "text",
          participants: [user.uid, userProfile.uid],
        }

        const docRef = await addDoc(collection(db, "chatList"), newChat)
        await updateDoc(doc(db, "chatList", docRef.id), {
          docId: docRef.id,
        })

        const chat = {
          photoUrl: userProfile.photoUrl,
          username: userProfile.username,
          senderId: user.uid,
          docId: docRef.id,
          blockedUsers: userProfile.blockedUsers,
        }

        setChat(chat)

        setOpen(false)
        setIsMessageOpen(true)

        return
      }

      const oldChat = {}

      querySnapshot.forEach((res) => {
        oldChat.photoUrl = userProfile.photoUrl
        oldChat.username = userProfile.username
        oldChat.senderId = res.data().senderId
        oldChat.docId = res.data().docId
        oldChat.blockedUsers = userProfile.blockedUsers
      })

      setChat(oldChat)

      if (user.uid !== chat.senderId) {
        const docRef = doc(db, "chatList", oldChat.docId)
        await updateDoc(docRef, {
          isSeen: true,
        })
      }

      setOpen(false)
      setIsMessageOpen(true)
    } catch (err) {
      setErr(err.code)
    } finally {
      setIsOpeningChat(false)
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

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
          setVal("")
          setUserProfile(null)
        }}
      >
        <Stack sx={modalStyle} gap={2}>
          <TextField
            value={val}
            onChange={(e) => setVal(e.target.value)}
            sx={{
              flex: 1,
              ".MuiInputBase-root": {
                borderRadius: "100vmax",
              },
              ".MuiInputBase-input": {
                fontSize: "0.85rem",
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  disableTouchRipple
                  edge="end"
                  sx={{
                    "&.MuiIconButton-root": {
                      px: 2,
                      borderLeft: `1px solid ${colors.grey[500]}`,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      transform: "translateX(1px)",
                      borderTopRightRadius: "100vmax",
                      borderBottomRightRadius: "100vmax",
                    },
                  }}
                  onClick={handleSearch}
                >
                  <Search />
                </IconButton>
              ),
            }}
            size="small"
            placeholder="Search"
          />
          <Divider />
          <Box display="flex" alignItems="center" gap={1}>
            {isSearchingUser && !userProfile ? (
              <>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ flexShrink: 0 }}
                />
                <Skeleton variant="text" width="100%" />
              </>
            ) : !isSearchingUser && !userProfile ? (
              <Typography variant="h5" textAlign="center" width="100%">
                No user to show.
              </Typography>
            ) : (
              <>
                <Avatar src={userProfile.photoUrl} />
                <Stack flex={1}>
                  <Typography variant="body1" fontSize="0.9rem">
                    {userProfile.displayName}
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    fontSize="0.825rem"
                    variant="body2"
                  >
                    {userProfile.username}
                  </Typography>
                </Stack>
                {user.uid !== userProfile.uid && (
                  <IconButton disableTouchRipple onClick={handleChat}>
                    <Chat />
                  </IconButton>
                )}
              </>
            )}
          </Box>
        </Stack>
      </Modal>
      <Error err={err} setErr={setErr} />
    </>
  )
}
