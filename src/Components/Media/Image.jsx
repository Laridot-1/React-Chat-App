import { Box, Modal, colors } from "@mui/material"
import { useState } from "react"

const Image = ({ image }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <img
        style={{
          width: "5rem",
          height: "5rem",
          objectFit: "cover",
          borderRadius: "0.25rem",
          cursor: "pointer",
        }}
        src={image}
        onClick={() => setOpen(true)}
      />
      <ImageModal open={open} setOpen={setOpen} image={image} />
    </>
  )
}

export default Image

function ImageModal({ open, setOpen, image }) {
  const modalStyle = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -30%)",
    width: "80%",
    aspectRatio: "3 / 2",
    maxWidth: 450,
    overflow: "hidden",
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box borderRadius={1} sx={modalStyle}>
        <img
          src={image}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            borderRadius: "0.25rem",
          }}
        />
      </Box>
    </Modal>
  )
}
