// components/ConfirmExitDialog.js
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

export default function ConfirmExitDialog({ open, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel} sx={{ fontFamily: "cairo" }}>
      <DialogTitle>هل تريد الخروج من التطبيق؟</DialogTitle>
      <DialogContent>
        <DialogContentText>
          هل أنت متاكد من أنك تريد الخروج من التطبيق ؟
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} sx={{ fontWeight: 700 }}>
          لا
        </Button>
        <Button onClick={onConfirm} sx={{ fontWeight: 700 }}>
          نعم
        </Button>
      </DialogActions>
    </Dialog>
  );
}
