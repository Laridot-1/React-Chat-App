import { ArrowBack } from "@mui/icons-material"
import { Box, IconButton, Stack, Typography, colors } from "@mui/material"
import { useThemeContext } from "../../BaseTheme"
import { useAppContext } from "../../Context"
import Image from "./Image"
import { useEffect, useState } from "react"

const Media = ({ setIsMediaOpen }) => {
  const { mode } = useThemeContext()
  const { chat, messages } = useAppContext()
  const [media] = useState(() =>
    messages.filter((message) => message.messageType === "image")
  )

  return (
    <Stack flex={1}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        px={1}
        py={1}
        borderBottom={`1px solid ${
          mode === "dark" ? colors.grey[800] : colors.grey[300]
        }`}
      >
        <IconButton disableTouchRipple onClick={() => setIsMediaOpen(false)}>
          <ArrowBack />
        </IconButton>
        <Typography fontSize="0.9rem" fontWeight={550}>
          {chat?.username}
        </Typography>
      </Box>
      <Box
        px={1}
        pt={1}
        sx={{
          overflowY: "auto",
          display: "grid",
          gap: 1,
          height: "100%",
          gridTemplateColumns: "repeat(auto-fill, 5rem)",
        }}
      >
        {media.map((message) => {
          return <Image key={message.messageId} image={message.message} />
        })}
      </Box>
    </Stack>
  )
}

export default Media
