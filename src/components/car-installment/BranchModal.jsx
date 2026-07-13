import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { api } from "@/utils/api";
import { useI18n } from "@/i18n/I18nProvider";

const ORANGE = "#F18222";
const NAVY = "#212564";

export default function BranchModal({ open, onClose, onSelect }) {
  const { t, locale } = useI18n();
  const ci = t.car_installment;
  const isRtl = locale !== "en";

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setBranches([]);
    setSearch("");

    api
      .get("/general/branches")
      .then((res) => {
        const data = res?.data;
        const list = Array.isArray(data)
          ? data.map((item, i) => ({
              id: i + 1,
              title: (item.title || "").trim(),
              address: item.address || "",
            }))
          : [];
        setBranches(list);
      })
      .catch(() => setBranches([]))
      .finally(() => setLoading(false));
  }, [open]);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? branches.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q)
      )
    : branches;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          direction: isRtl ? "rtl" : "ltr",
          m: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.5,
          borderBottom: "1px solid #EBEBED",
        }}
      >
        <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: "16px" }}>
          {ci.branch_modal_title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#777" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={ci.branch_search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputProps={{ style: { textAlign: isRtl ? "right" : "left" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderColor: "#D0D0D0" },
                "&:hover fieldset": { borderColor: ORANGE },
                "&.Mui-focused fieldset": { borderColor: ORANGE },
              },
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress sx={{ color: ORANGE }} size={32} />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography
            sx={{ textAlign: "center", py: 5, color: "#888", fontSize: "14px" }}
          >
            {ci.branch_no_results}
          </Typography>
        ) : (
          <List sx={{ py: 0, maxHeight: 380, overflow: "auto" }}>
            {filtered.map((branch) => (
              <ListItem key={branch.id} disablePadding divider>
                <ListItemButton
                  onClick={() => {
                    onSelect(branch);
                    onClose();
                  }}
                  sx={{ py: 1.5, px: 2, "&:hover": { bgcolor: "#FFF8F2" } }}
                >
                  <LocationOnOutlinedIcon
                    sx={{
                      color: ORANGE,
                      fontSize: 20,
                      mr: isRtl ? 0 : 1.5,
                      ml: isRtl ? 1.5 : 0,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ textAlign: isRtl ? "right" : "left" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "14px", color: NAVY }}>
                      {branch.title}
                    </Typography>
                    {branch.address && (
                      <Typography sx={{ fontSize: "12px", color: "#777", mt: 0.2 }}>
                        {branch.address}
                      </Typography>
                    )}
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
