import { Alert, Snackbar } from "@mui/material"

const Error = ({ err, setErr }) => {
  return (
    <Snackbar
      open={Boolean(err)}
      autoHideDuration={5000}
      onClose={() => setErr("")}
    >
      <Alert onClose={() => setErr("")} severity="error">
        {err}
      </Alert>
    </Snackbar>
  )
}

export default Error
