import { Attachment, EmojiEmotionsOutlined } from "@mui/icons-material"
import { Box, IconButton, Stack, TextField, colors } from "@mui/material"
import { useThemeContext } from "../../BaseTheme"
import { useState } from "react"
import EmojiPicker from "emoji-picker-react"

const MessageFooter = () => {
  const { mode } = useThemeContext()
  const [open, setOpen] = useState()
  const [val, setVal] = useState("")

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      py={1.5}
      px={1}
      borderTop={`1px solid ${
        mode === "dark" ? colors.grey[800] : colors.grey[300]
      }`}
    >
      <IconButton>
        <Attachment />
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
        }}
        size="small"
        placeholder="Message"
        value={val}
        onChange={(e) => setVal((prev) => e.target.value)}
      />
      <Box position="relative">
        <IconButton onClick={() => setOpen(!open)}>
          <EmojiEmotionsOutlined />
        </IconButton>
        <Box position="absolute" bottom="4rem" right={{ xs: 0, sm: 15 }}>
          <EmojiPicker
            open={open}
            theme={mode}
            width="100%"
            onEmojiClick={(e) => {
              setVal((prev) => prev + e.emoji)
              setOpen(false)
            }}
          />
        </Box>
      </Box>
    </Stack>
  )
}

export default MessageFooter
