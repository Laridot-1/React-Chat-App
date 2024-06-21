import Messages from "./Messages"
import MessageFooter from "./MessageFooter"
import MessageHeader from "./MessageHeader"
import { Stack, Typography } from "@mui/material"
import { useState } from "react"

const MessageWrapper = ({ close, setIsMediaOpen }) => {
  const [messages, setMessages] = useState(false)

  return (
    <Stack flex={1}>
      {messages ? (
        <>
          <MessageHeader close={close} setIsMediaOpen={setIsMediaOpen} />
          <Messages />
          <MessageFooter />
        </>
      ) : (
        <Typography fontSize="2rem" margin="auto">
          Select a user to start chatting
        </Typography>
      )}
    </Stack>
  )
}

export default MessageWrapper
