import { ArrowBack } from "@mui/icons-material"
import { Box, IconButton, TextField } from "@mui/material"
import { useState } from "react"
import { useAppContext } from "../../Context"

const SearchBar = ({ handleBack }) => {
  const [val, setVal] = useState("")
  const { setList, data } = useAppContext()

  const handleSearch = (e) => {
    setVal(e.target.value)
    const newList = data.filter((item) =>
      item.username.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setList(newList)
  }

  return (
    <Box display="flex" alignItems="center" gap={2} flex={1}>
      <IconButton sx={{ display: { md: "none" } }} onClick={handleBack}>
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
