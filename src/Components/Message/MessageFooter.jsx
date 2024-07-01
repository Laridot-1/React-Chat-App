import { Attachment, EmojiEmotionsOutlined, Send } from "@mui/icons-material"
import { Box, IconButton, Stack, TextField, colors } from "@mui/material"
import { useThemeContext } from "../../BaseTheme"
import { useEffect, useRef, useState } from "react"
import EmojiPicker from "emoji-picker-react"
import { useAppContext } from "../../Context"
import Error from "../Error/Error"
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import { db, storage } from "../../firebase"
import { getDownloadURL, ref, uploadString } from "firebase/storage"

const MessageFooter = ({
  editId,
  setEditId,
  setIsEditing,
  val,
  setVal,
  editVal,
  setEditVal,
}) => {
  const { mode } = useThemeContext()
  const [open, setOpen] = useState()
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [err, setErr] = useState("")
  const { chat, user, messages } = useAppContext()
  const [isUpdatingMessage, setIsUpdatingMessage] = useState(false)
  const fileRef = useRef(null)

  const handleSendMessage = async () => {
    if (isSendingMessage) return

    if (editId) {
      if (isUpdatingMessage) return
      if (editVal === val) return

      setIsEditing(true)
      setIsUpdatingMessage(true)

      try {
        await updateDoc(doc(db, "chatList", chat.docId, "messages", editId), {
          isEdited: true,
          message: val,
        })
        const lastMessage = messages[messages.length - 1]

        if (lastMessage.messageId === editId) {
          await updateDoc(doc(db, "chatList", chat.docId), {
            lastMessage: val,
          })
        }
        setVal("")
      } catch (err) {
        setErr(err.code)
      } finally {
        setIsEditing(false)
        setIsUpdatingMessage(false)
      }
    } else {
      if (val.trim() === "") return

      setIsSendingMessage(true)

      try {
        const docRef = await addDoc(
          collection(db, "chatList", chat.docId, "messages"),
          {
            message: val,
            time: serverTimestamp(),
            messageType: "text",
            isEdited: false,
            senderId: user.uid,
          }
        )
        await updateDoc(
          doc(db, "chatList", chat.docId, "messages", docRef.id),
          {
            messageId: docRef.id,
          }
        )
        await updateDoc(doc(db, "chatList", chat.docId), {
          lastMessage: val,
          senderId: user.uid,
          time: serverTimestamp(),
          isSeen: false,
          messageType: "text",
        })
        setVal("")
      } catch (err) {
        setErr(err.code)
      } finally {
        setIsSendingMessage(false)
      }
    }
  }

  const handleFilePicker = async (e) => {
    if (isSendingMessage) return

    setIsSendingMessage(true)

    try {
      let file = e.target.files[0]
      let maxFileSize = 2 * 1024 * 1024

      if (file && file.type.startsWith("image/")) {
        if (file.size > maxFileSize) {
          setErr("File must be less than 2mb")
          setFile("")
          return
        }

        let url = ""
        let reader = new FileReader()

        reader.onload = (e) => (url = e.target.result)
        reader.readAsDataURL(file)

        const newMessage = {
          isEdited: false,
          messageType: "image",
          senderId: user.uid,
          time: serverTimestamp(),
        }

        const docRef = await addDoc(
          collection(db, "chatList", chat.docId, "messages"),
          newMessage
        )

        const storageRef = ref(storage, `messages/${docRef.id}`)
        await uploadString(storageRef, url, "data_url")
        const imageUrl = await getDownloadURL(storageRef)

        await updateDoc(
          doc(db, "chatList", chat.docId, "messages", docRef.id),
          {
            messageId: docRef.id,
            message: imageUrl,
          }
        )

        await updateDoc(doc(db, "chatList", chat.docId), {
          time: serverTimestamp(),
          senderId: user.uid,
          isSeen: false,
          lastMessage: imageUrl,
          messageType: "image",
        })
      } else {
        setErr("Please select an image")
      }
    } catch (err) {
      setErr(err.code)
    } finally {
      setIsSendingMessage(false)
    }
  }

  useEffect(() => {
    if (!val) {
      setEditId("")
      setEditVal("")
      setIsEditing(false)
    }
  }, [val])

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        py={1.5}
        px={1.2}
        borderTop={`1px solid ${
          mode === "dark" ? colors.grey[800] : colors.grey[300]
        }`}
      >
        <IconButton
          disableTouchRipple
          sx={{
            p: { xs: 0.35, sm: 1 },
            "& svg": { fontSize: { xs: "1.5rem" } },
          }}
          onClick={() => fileRef.current?.click()}
        >
          <Attachment />
        </IconButton>
        <input
          type="file"
          hidden
          ref={fileRef}
          onChange={handleFilePicker}
          accept="image/*"
        />
        <Box position="relative">
          <IconButton
            disableTouchRipple
            sx={{
              p: { xs: 0.35, sm: 1 },
              "& svg": { fontSize: { xs: "1.5rem" } },
            }}
            onClick={() => setOpen(!open)}
          >
            <EmojiEmotionsOutlined />
          </IconButton>
          <Box position="absolute" bottom="3.7rem" left="-3.3rem">
            <EmojiPicker
              open={open}
              theme={mode}
              width="100%"
              onEmojiClick={(e) => {
                setVal((prev) => prev + e.emoji)
                setOpen(false)
              }}
            />
          </Box>
        </Box>
        <Box flex={1} display="flex" gap={1}>
          <TextField
            sx={{
              flex: 1,
              ".MuiInputBase-root": {
                borderRadius: "100vmax",
              },
              ".MuiInputBase-input": {
                fontSize: "0.85rem",
              },
            }}
            size="small"
            placeholder="Message"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
          <IconButton
            disableTouchRipple
            sx={{
              flexShrink: 0,
              p: { xs: 0.35, sm: 1 },
              "& svg": { fontSize: { xs: "1.5rem" } },
            }}
            onClick={handleSendMessage}
            disabled={isSendingMessage || isUpdatingMessage}
          >
            <Send />
          </IconButton>
        </Box>
      </Stack>
      <Error err={err} setErr={setErr} />
    </>
  )
}

export default MessageFooter
