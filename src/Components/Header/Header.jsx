import {
  DarkModeOutlined,
  LightModeOutlined,
  Search,
} from "@mui/icons-material"
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
  colors,
  useMediaQuery,
} from "@mui/material"
import { useThemeContext } from "../../BaseTheme"
import SearchBar from "./SearchBar"
import { useState } from "react"
import { useAppContext } from "../../Context"

const Header = () => {
  const { data, setList } = useAppContext()
  const { toggleMode, mode } = useThemeContext()
  const isMd = useMediaQuery("(min-width: 900px)")
  const [isSearching, setIsSearching] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleBack = () => {
    setIsSearching(false)
    setList(data)
  }

  return (
    <Box
      component="header"
      display="flex"
      gap={2}
      px={2}
      py={1}
      justifyContent="space-between"
      alignItems="center"
      borderBottom={`1px solid ${
        mode === "dark" ? colors.grey[800] : colors.grey[300]
      }`}
    >
      {isSearching && !isMd ? (
        <SearchBar handleBack={handleBack} />
      ) : (
        <>
          <Typography variant="h6" letterSpacing={1.5} fontWeight="bold">
            Laric
          </Typography>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flex: 1,
              maxWidth: "250px",
            }}
          >
            <SearchBar />
          </Box>
          <Stack direction="row" alignItems="center">
            <IconButton onClick={toggleMode}>
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
            <IconButton
              sx={{ display: { md: "none" } }}
              onClick={() => setIsSearching(true)}
            >
              <Search />
            </IconButton>
            <Avatar
              sx={{
                ml: 1,
                width: "35px",
                height: "35px",
                cursor: "pointer",
                bgcolor: "#00887A",
                "&.MuiAvatar-root": {
                  fontSize: "1rem",
                },
              }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              B
            </Avatar>

            <Menu
              open={open}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setIsEditModalOpen(true)}>
                Edit Profile
              </MenuItem>
              <MenuItem>Logout</MenuItem>
            </Menu>

            <EditProfileModal
              open={isEditModalOpen}
              setOpen={setIsEditModalOpen}
            />
          </Stack>
        </>
      )}
    </Box>
  )
}

export default Header

function EditProfileModal({ open, setOpen }) {
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
    <Modal open={open} onClose={() => setOpen(false)}>
      <Stack sx={modalStyle} gap={2}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Avatar sx={{ width: 90, height: 90 }} />
          <Button variant="contained">Change Photo</Button>
        </Stack>
        <Stack gap={1}>
          <TextField size="small" value="firstName" />
          <TextField size="small" value="lastName" />
          <TextField size="small" value="username" />
        </Stack>
        <Stack direction="row" gap={1} justifyContent="center">
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="contained">Edit</Button>
        </Stack>
      </Stack>
    </Modal>
  )
}
