import { ArrowBack } from "@mui/icons-material"
import { Box, IconButton, TextField } from "@mui/material"
import { useState } from "react"
import { useAppContext } from "../../Context"

const SearchBar = ({ handleBack }) => {
  const [val, setVal] = useState("")
  const { chatList, setFilter } = useAppContext()

  const handleSearch = (e) => {
    setVal(e.target.value)
    const filtered = chatList.filter((chat) =>
      chat.username.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilter(filtered)
  }

  return (
    <Box display="flex" alignItems="center" gap={2} flex={1}>
      <IconButton
        disableTouchRipple
        sx={{ display: { md: "none" } }}
        onClick={() => handleBack(false)}
      >
        <ArrowBack />
      </IconButton>
      <TextField
        sx={{
          flex: 1,
          ".MuiInputBase-root": {
            borderRadius: "100vmax",
          },
          ".MuiInputBase-input": {
            fontSize: "0.85rem",
          },
          maxWidth: "400px",
          margin: "auto",
        }}
        size="small"
        placeholder="Search"
        value={val}
        onChange={handleSearch}
      />
    </Box>
  )
}
export default SearchBar
