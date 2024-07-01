import { ArrowBack, Delete, MoreVertRounded } from "@mui/icons-material"
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  colors,
} from "@mui/material"
import { useThemeContext } from "../../BaseTheme"
import { useEffect, useState } from "react"
import { useAppContext } from "../../Context"
import { arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, storage } from "../../firebase"
import Error from "../Error/Error"
import { deleteObject, ref } from "firebase/storage"

const MessageHeader = ({
  setIsMediaOpen,
  selected,
  setIsChecked,
  setSelected,
  isChecked,
  setIsMessageOpen,
  isBlocked,
  setIsBlocked,
}) => {
  const { mode } = useThemeContext()
  const { chat, setMessages, messages, user } = useAppContext()

  const [anchorEl, setAnchorEl] = useState(null)

  const [isBlockedialogOpen, setIsBlockedDialogOpen] = useState(false)
  const [isDeleteMessagesDialogOpen, setIsDeleteMessagesDialogOpen] =
    useState(false)

  return (
    <Stack
      direction="row"
      gap={{ xs: 1, sm: 2 }}
      px={1}
      py={1}
      borderBottom={`1px solid ${
        mode === "dark" ? colors.grey[800] : colors.grey[300]
      }`}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton
          disableTouchRipple
          sx={{
            p: { xs: 0.35, sm: 1 },
            "& svg": { fontSize: { xs: "1.2rem", sm: "1.5rem" } },
          }}
          onClick={() => {
            setIsMessageOpen(false)
            setMessages([])
          }}
        >
          <ArrowBack />
        </IconButton>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            sx={{
              width: { xs: 30, sm: 40 },
              height: { xs: 30, sm: 40 },
              fontSize: { xs: 15, sm: 20 },
            }}
            src={chat?.photoUrl}
          />
          <Typography variant="body2" fontWeight="600" fontSize="0.825rem">
            {chat?.username}
          </Typography>
        </Box>
      </Box>
      <Box>
        {isChecked && (
          <Button
            size="small"
            sx={{
              textTransform: "capitalize",
              minWidth: 0,
              padding: { xs: "3px 4px", sm: "4px 5px" },
            }}
            disableTouchRipple
            onClick={() => {
              setIsChecked(false)
              setSelected([])
            }}
          >
            cancel
          </Button>
        )}
        {selected.length > 0 && (
          <IconButton
            disableTouchRipple
            sx={{
              p: { xs: 0.35, sm: 1 },
              "& svg": { fontSize: { xs: "1.2rem", sm: "1.5rem" } },
            }}
            onClick={() => setIsDeleteMessagesDialogOpen(true)}
          >
            <Delete />
          </IconButton>
        )}
        <IconButton
          disableTouchRipple
          sx={{
            p: { xs: 0.35, sm: 1 },
            "& svg": { fontSize: { xs: "1.2rem", sm: "1.5rem" } },
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <MoreVertRounded />
        </IconButton>
      </Box>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setIsMediaOpen(true)}>Media</MenuItem>
        <Divider />
        {isBlocked ? (
          <MenuItem>Blocked</MenuItem>
        ) : (
          <MenuItem onClick={() => setIsBlockedDialogOpen(true)}>
            Block User
          </MenuItem>
        )}
      </Menu>

      <BlockUserDialog
        setIsBlocked={setIsBlocked}
        open={isBlockedialogOpen}
        setOpen={setIsBlockedDialogOpen}
      />

      <DeleteMessagesDialog
        selected={selected}
        setSelected={setSelected}
        setIsChecked={setIsChecked}
        chat={chat}
        messages={messages}
        open={isDeleteMessagesDialogOpen}
        setOpen={setIsDeleteMessagesDialogOpen}
      />
    </Stack>
  )
}

export default MessageHeader

function BlockUserDialog({ open, setOpen, setIsBlocked }) {
  const { user, setUser, chat } = useAppContext()
  const [err, setErr] = useState("")
  const [isBlocking, setIsBlocking] = useState(false)

  const handleBlock = async () => {
    if (isBlocking) return

    setIsBlocking(true)

    try {
      await updateDoc(doc(db, "users", user.uid), {
        blockedUsers: arrayUnion(chat.senderId),
      })
      setUser({ ...user, blockedUsers: [...user.blockedUsers, chat.senderId] })
      setIsBlocked(true)
      setOpen(false)
    } catch (err) {
      setErr(err.code)
    } finally {
      setIsBlocking(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to block this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleBlock} disabled={isBlocking}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Error err={err} setErr={setErr} />
    </>
  )
}

function DeleteMessagesDialog({
  open,
  setOpen,
  selected,
  chat,
  setSelected,
  setIsChecked,
  messages,
}) {
  const [isDeletingMessages, setIsDeletingMessages] = useState(false)
  const [err, setErr] = useState("")

  const handleDeleteMessages = async () => {
    if (isDeletingMessages) return

    setIsDeletingMessages(true)

    try {
      const deletedMessages = selected.map((message) => {
        return deleteDoc(
          doc(db, "chatList", chat.docId, "messages", message.messageId)
        )
      })
      Promise.all(deletedMessages)

      const imagesToDelete = selected.filter(
        (message) => message.messageType === "image"
      )

      const deletedImages = imagesToDelete.map((message) => {
        return deleteObject(ref(storage, `messages/${message.messageId}`))
      })
      Promise.all(deletedImages)

      setSelected([])
      setIsChecked(false)

      const lastMessage = messages[messages.length - 2]
      await updateDoc(doc(db, "chatList", chat.docId), {
        lastMessage: lastMessage?.message || "",
        senderId: lastMessage?.senderId || "",
        time: lastMessage?.time || "",
        isSeen: true,
        messageType: lastMessage?.messageType || "text",
      })

      setOpen(false)
    } catch (err) {
      setErr(err.code)
    } finally {
      setIsDeletingMessages(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogContentText>
            {selected.length > 1
              ? "Are you sure you want to delete these messages"
              : "Are you sure you want to delete this message"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isDeletingMessages} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isDeletingMessages} onClick={handleDeleteMessages}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Error err={err} setErr={setErr} />
    </>
  )
}
