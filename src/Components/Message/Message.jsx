import {
  Box,
  Checkbox,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  colors,
} from "@mui/material"
import { useState } from "react"
import { useAppContext } from "../../Context"
import { formatTimeAgo } from "../../utils/timeAgo"
import { useThemeContext } from "../../BaseTheme"

const Message = ({
  message,
  isChecked,
  setIsChecked,
  selected,
  setSelected,
  editId,
  setEditId,
  setVal,
  setIsEditing,
  isEditing,
  setEditVal,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { user } = useAppContext()
  const { mode } = useThemeContext()

  const handleChange = () => {
    const currentIndex = selected.findIndex((m) => m.id === message.messageId)
    const newSelectedMessages = [...selected]

    if (currentIndex === -1) {
      newSelectedMessages.push({
        messageId: message.messageId,
        messageType: message.messageType,
      })
    } else {
      newSelectedMessages.splice(currentIndex, 1)
    }

    setSelected(newSelectedMessages)
  }

  return (
    <ListItem
      sx={{
        px: 2,
        py: 1,
        width: "auto",
        maxWidth: 500,
        display: "grid",
        bgcolor:
          message.senderId === user.uid
            ? colors.deepOrange[300]
            : colors.deepOrange[200],
        color: colors.grey[900],
        borderRadius: 1.5,
        alignSelf: message.senderId === user.uid ? "end" : "start",
        position: "relative",
        "& .MuiListItemText-root span": {
          fontSize: "0.95rem",
        },
      }}
      onDoubleClick={(e) =>
        message.senderId === user.uid && setAnchorEl(e.currentTarget)
      }
    >
      <Box display="flex" alignItems="start">
        {message.messageType === "text" ? (
          <ListItemText primary={message.message} />
        ) : (
          <img
            src={message.message}
            style={{
              width: "70%",
              maxWidth: "300px",
              marginBottom: "0.5rem",
              borderRadius: "0.35rem",
              userSelect: "none",
            }}
          />
        )}
        {isChecked && message.senderId === user.uid && (
          <Checkbox
            size="small"
            sx={{ p: 0.5 }}
            disableTouchRipple
            onChange={handleChange}
          />
        )}
      </Box>
      <Box display="flex" gap={1} width="100%" justifyContent="space-between">
        <Typography
          variant="body2"
          fontSize="0.7rem"
          display="flex"
          order={message.senderId === user.uid ? 1 : 2}
        >
          {message.time
            ? formatTimeAgo(message.time.toDate())
            : formatTimeAgo(new Date())}
        </Typography>
        {message?.isEdited && message.messageType !== "image" && (
          <Typography
            variant="body2"
            fontSize="0.7rem"
            order={message.senderId === user.uid ? 2 : 1}
          >
            edited
          </Typography>
        )}
      </Box>
      <Box
        position="absolute"
        width="1rem"
        height="1rem"
        bgcolor={
          message.senderId === user.uid
            ? colors.deepOrange[300]
            : colors.deepOrange[200]
        }
        right={message.senderId === user.uid ? "-0.5rem" : "auto"}
        left={message.senderId === user.uid ? "auto" : "-0.5rem"}
        top="50%"
        sx={{
          clipPath:
            message.senderId === user.uid
              ? "polygon(0% 0%, 100% 50%, 0% 100%)"
              : "polygon(0% 50%, 100% 0%, 100% 100%)",
          transform: "translateY(-55%)",
        }}
      ></Box>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        sx={{ "& li": { minHeight: 0 } }}
      >
        {message.messageType !== "image" && (
          <MenuItem
            onClick={() => {
              if (isEditing || editId) return
              setIsEditing(true)
              setEditId(message.messageId)
              setVal(message.message)
              setEditVal(message.message)
              setAnchorEl(null)
            }}
          >
            Edit
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            message.senderId === user.uid && setIsChecked(true)
            setAnchorEl(null)
          }}
        >
          Select
        </MenuItem>
      </Menu>
    </ListItem>
  )
}

export default Message
