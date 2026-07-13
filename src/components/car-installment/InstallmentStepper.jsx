import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";

const ORANGE = "#F18222";
const GRAY = "#B0B0B0";
const NAVY = "#212564";

// Order matches page step order: Car Info → Financing → Personal Info
const stepIcons = [
  <DirectionsCarOutlinedIcon key="s1" sx={{ fontSize: { xs: 18, md: 22 }, color: "inherit" }} />,
  <AccountBalanceWalletOutlinedIcon key="s2" sx={{ fontSize: { xs: 18, md: 22 }, color: "inherit" }} />,
  <AssignmentOutlinedIcon key="s3" sx={{ fontSize: { xs: 18, md: 22 }, color: "inherit" }} />,
];

export default function InstallmentStepper({ currentStep, labels }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        mb: 4,
        px: { xs: 1, md: 0 },
        position: "relative",
      }}
    >
      {labels.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isLast = index === labels.length - 1;

        const circleColor = isCompleted || isActive ? ORANGE : GRAY;

        return (
          <React.Fragment key={stepNum}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
              <Box
                sx={{
                  width: { xs: 40, md: 50 },
                  height: { xs: 40, md: 50 },
                  borderRadius: "50%",
                  bgcolor: circleColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                  boxShadow: isActive ? `0 0 0 4px ${ORANGE}30` : "none",
                  transition: "all 0.3s",
                }}
              >
                {isCompleted ? (
                  <CheckIcon sx={{ fontSize: { xs: 18, md: 22 } }} />
                ) : (
                  stepIcons[index]
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "10px", md: "13px" },
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? NAVY : GRAY,
                  mt: 0.75,
                  textAlign: "center",
                  maxWidth: { xs: 70, md: 110 },
                }}
              >
                {label}
              </Typography>
            </Box>

            {!isLast && (
              <Box
                sx={{
                  flex: 1,
                  height: "2px",
                  bgcolor: isCompleted ? ORANGE : "#E0E0E0",
                  mt: { xs: "20px", md: "25px" },
                  mx: { xs: 0.5, md: 1 },
                  transition: "background-color 0.3s",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}
