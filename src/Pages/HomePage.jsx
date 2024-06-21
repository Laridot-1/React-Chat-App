import {
  Avatar,
  Box,
  Divider,
  Fab,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
  colors,
  useMediaQuery,
} from "@mui/material"
import Header from "../Components/Header/Header"
import ChatList from "../Components/ChatList/ChatList"
import { Add, Chat, Search } from "@mui/icons-material"
import { useThemeContext } from "../BaseTheme"
import { useState } from "react"
import MessageWrapper from "../Components/Message/MessageWrapper"
import Media from "../Components/Media/Media"

const HomePage = () => {
  const { mode } = useThemeContext()
  const [open, setOpen] = useState(false)
  const isSm = useMediaQuery("(max-width: 899px)")
  const [isMediaOpen, setIsMediaOpen] = useState(false)
  const [isMessageOpen, setIsMessageOpen] = useState(false)

  const modalStyle = {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -20%)",
    width: "90%",
    maxWidth: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
    pb: 4,
  }

  return (
    <Box display="flex" height="100%">
      {isMessageOpen && isSm ? (
        isMediaOpen ? (
          <Media setIsMediaOpen={setIsMediaOpen} />
        ) : (
          <MessageWrapper
            close={setIsMessageOpen}
            setIsMediaOpen={setIsMediaOpen}
          />
        )
      ) : (
        <Stack
          height="100svh"
          overflow="hidden"
          position="relative"
          sx={{
            borderRight: {
              xs: "none",
              md: `1px solid ${
                mode === "dark" ? colors.grey[800] : colors.grey[300]
              }`,
            },
            maxWidth: {
              xs: "100%",
              md: "400px",
            },
            flex: {
              xs: 1,
              md: "auto",
            },
          }}
        >
          <Header />
          <ChatList />
          <Fab
            sx={{
              bottom: "4rem",
              right: "1rem",
              position: "absolute",
              color: colors.grey[800],
            }}
            onClick={() => setOpen(true)}
          >
            <Add />
          </Fab>
          <Modal open={open} onClose={() => setOpen(false)}>
            <Stack sx={modalStyle} gap={2}>
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
                InputProps={{
                  endAdornment: (
                    <IconButton
                      edge="end"
                      sx={{
                        "&.MuiIconButton-root": {
                          px: 2,
                          borderLeft: `1px solid ${colors.grey[500]}`,
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          transform: "translateX(1px)",
                          borderTopRightRadius: "100vmax",
                          borderBottomRightRadius: "100vmax",
                        },
                      }}
                    >
                      <Search />
                    </IconButton>
                  ),
                }}
                size="small"
                placeholder="Search"
              />
              <Divider />
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar>L</Avatar>
                <Typography
                  fontWeight="bold"
                  fontSize="0.825rem"
                  variant="body2"
                  flex={1}
                >
                  larry1
                </Typography>
                <IconButton>
                  <Chat />
                </IconButton>
              </Box>
            </Stack>
          </Modal>
        </Stack>
      )}
      <Box display={{ xs: "none", md: "flex" }} flex={1}>
        {isMediaOpen ? (
          <Media setIsMediaOpen={setIsMediaOpen} />
        ) : (
          <MessageWrapper
            close={setIsMessageOpen}
            setIsMediaOpen={setIsMediaOpen}
          />
        )}
      </Box>
    </Box>
  )
}

export default HomePage
