import { Box, Button, Modal, colors } from "@mui/material"
import { useState } from "react"

const Image = ({ i }) => {
  const [open, setOpen] = useState(false)

  return (
    <Box>
      <Box
        sx={{ cursor: "pointer" }}
        height={60}
        borderRadius={1.5}
        bgcolor={colors.blueGrey[300]}
        onClick={() => setOpen(true)}
      ></Box>
      <ImageModal open={open} setOpen={setOpen} />
    </Box>
  )
}

export default Image

function ImageModal({ open, setOpen }) {
  const modalStyle = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -30%)",
    width: "80%",
    aspectRatio: "3 / 2",
    maxWidth: 450,
    p: 4,
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box borderRadius={1} bgcolor={colors.amber[900]} sx={modalStyle}></Box>
    </Modal>
  )
}
