import { ArrowBack, MoreVertRounded } from "@mui/icons-material"
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  colors,
} from "@mui/material"
import { useThemeContext } from "../../BaseTheme"
import { useState } from "react"

const MessageHeader = ({ close, setIsMediaOpen }) => {
  const { mode } = useThemeContext()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [isBlockedialogOpen, setIsBlockedDialogOpen] = useState(false)
  const [isDeleteChatsDialogOpen, setIsDeleteChatsDialogOpen] = useState(false)

  return (
    <Stack
      direction="row"
      gap={2}
      px={1}
      py={1}
      borderBottom={`1px solid ${
        mode === "dark" ? colors.grey[800] : colors.grey[300]
      }`}
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={() => close(false)}>
          <ArrowBack />
        </IconButton>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar>L</Avatar>
          <Typography variant="body2" fontWeight="600" fontSize="0.825rem">
            username
          </Typography>
        </Box>
      </Box>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertRounded />
      </IconButton>

      <Menu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setIsMediaOpen(true)}>Media</MenuItem>
        <Divider />
        <MenuItem onClick={() => setIsBlockedDialogOpen(true)}>
          Block User
        </MenuItem>
        <MenuItem onClick={() => setIsDeleteChatsDialogOpen(true)}>
          Clear chat
        </MenuItem>
      </Menu>

      <BlockUserDialog
        open={isBlockedialogOpen}
        setOpen={setIsBlockedDialogOpen}
      />

      <ClearChatDialog
        open={isDeleteChatsDialogOpen}
        setOpen={setIsDeleteChatsDialogOpen}
      />
    </Stack>
  )
}

export default MessageHeader

function BlockUserDialog({ open, setOpen }) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to block this user?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => setOpen(false)}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

function ClearChatDialog({ open, setOpen }) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Delete Chat?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting chats won't delete the chat on the other user's device.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => setOpen(false)}>Clear</Button>
      </DialogActions>
    </Dialog>
  )
}
