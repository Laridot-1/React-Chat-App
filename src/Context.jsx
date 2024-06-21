import { createContext, useContext, useState } from "react"

const AppContext = createContext(null)

const useAppContext = () => useContext(AppContext)

const Context = ({ children }) => {
  const data = [
    {
      username: "larry1",
      lastMessage: "Hey, just checking up on you.",
      time: "1hr ago",
      initial: "L",
      id: 1,
    },
    {
      username: "ben7",
      lastMessage: "How're you???",
      time: "1m ago",
      initial: "B",
      id: 2,
    },
    {
      username: "laridot",
      lastMessage: "I thought you weren't the one, sorry...",
      time: "25m ago",
      initial: "L",
      id: 3,
    },
    {
      username: "benjamin",
      lastMessage: "Why???",
      time: "35s ago",
      initial: "B",
      id: 4,
    },
  ]
  const [list, setList] = useState(data)

  const val = { list, setList, data }

  return <AppContext.Provider value={val}>{children}</AppContext.Provider>
}

export { Context, useAppContext }
