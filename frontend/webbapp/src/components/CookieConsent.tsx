import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function CookieConsentDialog() {
  const [open, setOpen] = useState(true);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setOpen(false);
  };

  const handleDecline = () => {
    localStorage.removeItem("cookiesAccepted");
    localStorage.setItem("cookiesDeclined", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleDecline}>
      <DialogTitle>Godkänn användning av cookies</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Vi använder cookies för att förbättra din upplevelse på vår webbplats.
          Genom att fortsätta använda webbplatsen godkänner du vår användning av
          cookies.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDecline} color="primary">
          Nej, tack
        </Button>
        <Button onClick={handleAccept} color="primary" autoFocus>
          Jag accepterar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
