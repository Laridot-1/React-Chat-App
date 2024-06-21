import { Stack } from "@mui/material"
import Chat from "./Chat"
import { useAppContext } from "../../Context"

const ChatList = () => {
  const { list } = useAppContext()

  return (
    <Stack
      sx={{ overflowY: "auto", overflowX: "hidden", flex: 1, pt: 2, px: 1 }}
    >
      {list.map((user) => {
        return <Chat user={user} key={user.id} />
      })}
    </Stack>
  )
}
export default ChatList
