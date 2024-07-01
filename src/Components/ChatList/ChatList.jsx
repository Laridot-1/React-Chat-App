import { Skeleton, Stack } from "@mui/material"
import Chat from "./Chat"
import { useAppContext } from "../../Context"
import { useEffect, useState } from "react"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import { db } from "../../firebase"
import Error from "../Error/Error"

const ChatList = ({ setIsMessageOpen, isOpeningChat, setIsOpeningChat }) => {
  const { user, chat, setChatList, filter, setFilter } = useAppContext()
  const [err, setErr] = useState("")
  const [isLoadingChat, setIsLoadingChat] = useState(true)

  useEffect(() => {
    if (!user) return

    const getChats = async () => {
      setIsLoadingChat(true)

      try {
        const q = query(
          collection(db, "chatList"),
          where("participants", "array-contains", user.uid)
        )
        const querySnapshot = await getDocs(q)

        const dataPromises = querySnapshot.docs.map(async (res) => {
          const { participants } = res.data()
          const otherUserId = participants.filter((id) => id !== user.uid)[0]
          const profileDoc = await getDoc(doc(db, "users", otherUserId))
          return {
            photoUrl: profileDoc.data().photoUrl,
            username: profileDoc.data().username,
            lastMessage: res.data().lastMessage,
            messageType: res.data().messageType,
            time: res.data().time,
            isSeen: res.data().isSeen,
            senderId: res.data().senderId,
            docId: res.data().docId,
            blockedUsers: profileDoc.data().blockedUsers,
          }
        })

        const data = await Promise.all(dataPromises)
        const users = data
          .filter(
            (chat) =>
              !user.blockedUsers.includes(chat.senderId) &&
              !chat.blockedUsers.includes(user.uid)
          )
          .sort((a, b) => {
            if (a.time === "" && b.time === "") return 0
            if (a.time === "") return -1
            if (b.time === "") return 1

            return b.time.toDate() - a.time.toDate()
          })

        setChatList(users)
        setFilter(users)
      } catch (err) {
        setErr(err.code)
      } finally {
        setIsLoadingChat(false)
      }
    }
    getChats()
  }, [user, chat])

  if (!user) {
    return (
      <Stack
        sx={{ overflowY: "auto", overflowX: "hidden", flex: 1, pt: 2, px: 1 }}
      >
        {Array(5)
          .fill(" ")
          .map((_, i) => {
            return (
              <Stack
                direction="row"
                gap={1.5}
                alignItems="center"
                key={i}
                paddingBottom={2}
              >
                <Skeleton
                  variant="circular"
                  width={45}
                  height={45}
                  sx={{ flexShrink: 0 }}
                />
                <Stack gap={0.5} flex={1}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="30%" />
                </Stack>
              </Stack>
            )
          })}
      </Stack>
    )
  }

  return (
    <>
      <Stack
        sx={{ overflowY: "auto", overflowX: "hidden", flex: 1, pt: 2, px: 1 }}
      >
        {isLoadingChat && filter.length === 0 ? (
          Array(5)
            .fill(" ")
            .map((_, i) => {
              return (
                <Stack
                  direction="row"
                  gap={1.5}
                  alignItems="center"
                  key={i}
                  paddingBottom={2}
                >
                  <Skeleton
                    variant="circular"
                    width={45}
                    height={45}
                    sx={{ flexShrink: 0 }}
                  />
                  <Stack gap={0.5} flex={1}>
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="30%" />
                  </Stack>
                </Stack>
              )
            })
        ) : !isLoadingChat && filter.length === 0 ? (
          <></>
        ) : (
          filter.map((chat) => {
            return (
              <Chat
                chat={chat}
                key={chat.docId}
                isOpeningChat={isOpeningChat}
                setIsOpeningChat={setIsOpeningChat}
                setIsMessageOpen={setIsMessageOpen}
              />
            )
          })
        )}
      </Stack>
      <Error err={err} setErr={setErr} />
    </>
  )
}

export default ChatList
