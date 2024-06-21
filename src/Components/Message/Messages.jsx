import { Stack } from "@mui/material"
import Message from "./Message"
import { useEffect, useRef } from "react"

const Messages = () => {
  const lastRef = useRef(null)

  useEffect(() => {
    if (lastRef) {
      lastRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return (
    <Stack
      flex={1}
      gap={1}
      sx={{ overflowY: "auto", overflowX: "hidden", px: 1.5, py: 1 }}
    >
      {Array(10)
        .fill(" ")
        .map((_, i) => {
          return <Message key={i} own={i % 2 === 0 ? true : false} />
        })}
      <div ref={lastRef}></div>
    </Stack>
  )
}
export default Messages
