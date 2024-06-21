import { Avatar, Box, Stack, Typography, colors } from "@mui/material"
import { useThemeContext } from "../../BaseTheme"

const Chat = ({ user }) => {
  const { mode } = useThemeContext()

  return (
    <Box
      p={1}
      display="grid"
      gridTemplateColumns="auto 1fr auto"
      justifyContent="space-between"
      alignItems="center"
      gap={1.5}
      borderRadius={1.5}
      sx={{
        "&:hover": {
          bgcolor: mode === "dark" ? colors.grey[900] : colors.grey[100],
        },
        cursor: "pointer",
      }}
    >
      <Avatar>{user.initial}</Avatar>
      <Stack maxWidth="100%" overflow="hidden">
        <Typography variant="body1" fontWeight="bold">
          {user.username}
        </Typography>
        <Typography variant="body2" noWrap>
          {user.lastMessage}
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        fontSize="0.825rem"
        color={colors.grey[500]}
        alignSelf="end"
      >
        {user.time}
      </Typography>
    </Box>
  )
}

export default Chat
