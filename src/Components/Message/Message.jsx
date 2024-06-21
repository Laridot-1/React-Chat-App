import { Stack, colors } from "@mui/material"

const Message = ({ own }) => {
  return (
    <Stack
      flexShrink={0}
      maxWidth={500}
      p={2}
      color={colors.grey[900]}
      bgcolor={own ? colors.deepOrange[300] : colors.deepOrange[100]}
      borderRadius={1.5}
      alignSelf={own ? "end" : "start"}
    >
      Lorem ipsum dolor sit amet
    </Stack>
  )
}

export default Message
