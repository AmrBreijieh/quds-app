import React from "react";
import { Box, Button, Typography, Modal } from "@mui/material";

const TimeUpModal = ({ open, onContinue, onFinish }) => {
  return (
    <Modal open={open} onClose={onContinue}>
      <Box
        sx={{
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          textAlign: "center",
          mx: "auto",
          mt: "20%",
          width: { xs: 300, sm: 400 },
          boxShadow: 24,
          fontFamily: "cairo",
        }}
      >
        <Typography variant="h5" gutterBottom>
          انتهى الوقت!
        </Typography>
        <Typography variant="body1" gutterBottom>
          هل ترغب في مراجعة إجاباتك أو رؤية نتيجتك؟
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={onContinue}
          >
            المتابعة
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ m: 1 }}
            onClick={onFinish}
          >
            عرض النتيجة
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TimeUpModal;
