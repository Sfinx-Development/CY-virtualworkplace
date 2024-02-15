import { AlertProps } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

export default function AlertComponent(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
