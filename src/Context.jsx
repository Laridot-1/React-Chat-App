import { onAuthStateChanged } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "./firebase"
import { doc, getDoc } from "firebase/firestore"

const AppContext = createContext(null)

const useAppContext = () => useContext(AppContext)

const Context = ({ children }) => {
  const [user, setUser] = useState(null)
  const [chatList, setChatList] = useState([])
  const [filter, setFilter] = useState([])
  const [messages, setMessages] = useState([])
  const [chat, setChat] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getDoc(doc(db, "users", user.uid))
        setUser(userProfile.data())
      }
    })
    return unsubscribe
  }, [])

  const val = {
    user,
    setUser,
    chatList,
    setChatList,
    filter,
    setFilter,
    messages,
    setMessages,
    chat,
    setChat,
  }

  return <AppContext.Provider value={val}>{children}</AppContext.Provider>
}

export { Context, useAppContext }
