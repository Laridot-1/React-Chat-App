import { Box, List, Skeleton } from "@mui/material"
import Message from "./Message"
import { useEffect, useRef, useState } from "react"
import { useAppContext } from "../../Context"
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase"
import Error from "../Error/Error"

const Messages = ({
  isChecked,
  setIsChecked,
  selected,
  setSelected,
  editId,
  setEditId,
  setVal,
  setIsEditing,
  isEditing,
  setEditVal,
}) => {
  const lastRef = useRef(null)
  const { chat, setMessages, messages } = useAppContext()
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [err, setErr] = useState("")

  useEffect(() => {
    setMessages([])
    setIsLoadingMessages(true)

    const unsub = onSnapshot(
      collection(db, "chatList", chat.docId, "messages"),
      (querySnapshot) => {
        const messages = []
        querySnapshot.forEach((doc) => {
          messages.push(doc.data())
        })
        messages.sort((a, b) => a.time.toDate() - b.time.toDate())
        setMessages(messages)
        setIsLoadingMessages(false)
      }
    )

    return unsub
  }, [])

  useEffect(() => {
    if (lastRef) {
      lastRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length])

  return (
    <List
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        px: 1.5,
        py: 1,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        gap: 1,
      }}
      key={chat.docId}
    >
      {isLoadingMessages && messages.length < 1 ? (
        Array(5)
          .fill(" ")
          .map((_, i) => {
            return (
              <Box
                key={i}
                width="100%"
                display="flex"
                justifyContent={i % 2 === 0 ? "end" : "start"}
              >
                <Skeleton variant="rounded" width="40%" height={60} />
              </Box>
            )
          })
      ) : !isLoadingMessages && messages.length < 1 ? (
        <></>
      ) : (
        messages.map((message, i) => {
          return (
            <Message
              key={i}
              message={message}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              selected={selected}
              setSelected={setSelected}
              editId={editId}
              setEditId={setEditId}
              setVal={setVal}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setEditVal={setEditVal}
            />
          )
        })
      )}
      <div ref={lastRef}></div>
      <Error err={err} setErr={setErr} />
    </List>
  )
}

export default Messages
