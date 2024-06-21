import { ArrowBack } from "@mui/icons-material"
import { Box, IconButton, Stack, Typography, colors } from "@mui/material"
import { useThemeContext } from "../../BaseTheme"
import Image from "./Image"

const Media = ({ setIsMediaOpen }) => {
  const { mode } = useThemeContext()

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
        <IconButton onClick={() => setIsMediaOpen(false)}>
          <ArrowBack />
        </IconButton>
        <Typography fontSize="0.825rem" fontWeight={600}>
          username
        </Typography>
      </Box>
      <Box
        px={1}
        pt={1}
        sx={{
          overflowY: "auto",
          display: "grid",
          gap: 1,
          gridTemplateColumns: "repeat(auto-fill, 60px)",
        }}
      >
        {Array(7)
          .fill(" ")
          .map((_, i) => {
            return <Image i={i} key={i} />
          })}
      </Box>
    </Stack>
  )
}

export default Media
