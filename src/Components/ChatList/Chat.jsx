import { Avatar, Box, Stack, Typography, colors } from "@mui/material"
import { useThemeContext } from "../../BaseTheme"
import { useAppContext } from "../../Context"
import { formatTimeAgo } from "../../utils/timeAgo"
import { useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase"
import Error from "../Error/Error"
import { Image } from "@mui/icons-material"

const Chat = ({ chat, setIsMessageOpen, isOpeningChat, setIsOpeningChat }) => {
  const { mode } = useThemeContext()
  const { user, setChat } = useAppContext()
  const [err, setErr] = useState("")

  const handleOpenChat = async () => {
    if (isOpeningChat) return

    setIsOpeningChat(true)

    try {
      const obj = {
        username: chat.username,
        senderId: chat.senderId,
        photoUrl: chat.photoUrl,
        docId: chat.docId,
        blockedUsers: chat.blockedUsers,
      }
      setChat(obj)

      if (user.uid !== chat.senderId) {
        const docRef = doc(db, "chatList", chat.docId)
        await updateDoc(docRef, {
          isSeen: true,
        })
      }

      setIsMessageOpen(true)
    } catch (err) {
      setErr(err.code)
    } finally {
      setIsOpeningChat(false)
    }
  }

  return (
    <>
      <Box
        p={1}
        display="grid"
        position="relative"
        gridTemplateColumns="auto 1fr auto"
        justifyContent="space-between"
        alignItems="center"
        gap={1.5}
        borderRadius={1.5}
        sx={{
          "&:hover": {
            bgcolor: mode === "dark" ? colors.grey[900] : colors.grey[100],
          },
          cursor: "pointer",
        }}
        onClick={handleOpenChat}
      >
        <Avatar src={chat?.photoUrl} />
        <Stack maxWidth="100%" overflow="hidden">
          <Typography
            variant="body1"
            fontWeight="550"
            color={mode === "light" ? colors.grey[800] : colors.common.white}
          >
            {chat?.username}
          </Typography>
          {chat.messageType === "text" ? (
            <Typography
              variant="body2"
              noWrap
              color={mode === "light" ? colors.grey[800] : colors.common.white}
            >
              {chat?.lastMessage}
            </Typography>
          ) : (
            <Stack direction="row" gap={0.35} alignItems="center">
              <Image
                sx={{
                  fontSize: "1.2rem",
                  color:
                    mode === "light" ? colors.grey[800] : colors.common.white,
                }}
              />
              <Typography variant="body2">Image</Typography>
            </Stack>
          )}
        </Stack>
        <Typography
          variant="body2"
          fontSize="0.825rem"
          color={colors.grey[500]}
          alignSelf="end"
        >
          {chat?.time ? formatTimeAgo(chat?.time?.toDate()) : ""}
        </Typography>
        {user.uid !== chat.senderId && !chat?.isSeen && (
          <Box
            component="span"
            sx={{
              position: "absolute",
              width: "0.7rem",
              aspectRatio: "1 / 1",
              bgcolor: colors.deepOrange[300],
              top: 10,
              right: 10,
              borderRadius: "50%",
            }}
          ></Box>
        )}
      </Box>
      <Error err={err} setErr={setErr} />
    </>
  )
}

export default Chat
