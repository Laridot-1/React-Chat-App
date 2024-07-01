import Messages from "./Messages"
import MessageFooter from "./MessageFooter"
import MessageHeader from "./MessageHeader"
import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useAppContext } from "../../Context"

const MessageWrapper = ({ setIsMediaOpen, setIsMessageOpen }) => {
  const { user, chat } = useAppContext()
  const [editId, setEditId] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [selected, setSelected] = useState([])
  const [isChecked, setIsChecked] = useState(false)
  const [val, setVal] = useState("")
  const [editVal, setEditVal] = useState("")
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const blockedStatus =
      user.blockedUsers.includes(chat.senderId) ||
      chat.blockedUsers.includes(user.uid)
    setIsBlocked(blockedStatus)
  }, [isBlocked])

  return (
    <Stack flex={1}>
      <MessageHeader
        setIsMediaOpen={setIsMediaOpen}
        setIsMessageOpen={setIsMessageOpen}
        selected={selected}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        setSelected={setSelected}
        isBlocked={isBlocked}
        setIsBlocked={setIsBlocked}
      />
      <Messages
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        selected={selected}
        setSelected={setSelected}
        editId={editId}
        setEditId={setEditId}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setVal={setVal}
        setEditVal={setEditVal}
      />
      {!isBlocked && (
        <MessageFooter
          val={val}
          setVal={setVal}
          editId={editId}
          setEditId={setEditId}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editVal={editVal}
          setEditVal={setEditVal}
        />
      )}
    </Stack>
  )
}

export default MessageWrapper
