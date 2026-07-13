import { colors } from "../const";

const NAVY = "#212564";
const ORANGE = colors.orange;

export const ciStyles = {
  pageWrapper: {
    bgcolor: colors.bg_grey,
    minHeight: "100vh",
  },

  pageBanner: {
    bgcolor: NAVY,
    py: { xs: 2.5, md: 4 },
    px: { xs: 2, md: "148px" },
    display: "flex",
    alignItems: "center",
  },

  bannerTitle: {
    color: colors.white,
    fontSize: { xs: "20px", md: "28px" },
    fontWeight: "700",
  },

  formWrapper: {
    maxWidth: "900px",
    mx: "auto",
    px: { xs: 2, md: 4 },
    py: { xs: 3, md: 5 },
  },

  formCard: {
    bgcolor: colors.white,
    borderRadius: "12px",
    p: { xs: 2, md: 4 },
    boxShadow: "0px 2px 12px rgba(0,0,0,0.07)",
  },

  sectionDivider: {
    borderColor: "#EBEBED",
    my: 3,
  },

  sectionTitle: {
    fontSize: { xs: "15px", md: "17px" },
    fontWeight: "700",
    color: NAVY,
    textAlign: "start",
    mb: 2,
  },

  fieldLabel: {
    fontSize: { xs: "13px", md: "14px" },
    fontWeight: "600",
    color: "#545A62",
    mb: 0.5,
    display: "block",
    textAlign: "start",
  },

  selectField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      bgcolor: colors.white,
      "& fieldset": { borderColor: "#D0D0D0" },
      "&:hover fieldset": { borderColor: ORANGE },
      "&.Mui-focused fieldset": { borderColor: ORANGE, borderWidth: "1.5px" },
    },
    "& .MuiSelect-select": { textAlign: "end" },
  },

  textField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      bgcolor: colors.white,
      "& fieldset": { borderColor: "#D0D0D0" },
      "&:hover fieldset": { borderColor: ORANGE },
      "&.Mui-focused fieldset": { borderColor: ORANGE, borderWidth: "1.5px" },
    },
    "& input": { textAlign: "end" },
  },

  // Upload boxes — gray dashed border per Figma
  uploadBox: {
    border: "1.5px dashed #D0D0D0",
    borderRadius: "8px",
    p: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    bgcolor: colors.white,
    minHeight: { xs: "140px", md: "160px" },
    width: "100%",
    "&:hover": { bgcolor: "#FAFAFA", borderColor: "#bbb" },
    transition: "background-color 0.2s, border-color 0.2s",
  },

  uploadBoxLabel: {
    fontSize: "13px",
    color: NAVY,
    fontWeight: "600",
    textAlign: "center",
    mb: 0.5,
  },

  uploadBoxHint: {
    fontSize: "11px",
    color: "#999",
    textAlign: "center",
    mb: 0.5,
    px: 1,
  },

  chooseImageLink: {
    color: ORANGE,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    mt: 0.5,
    textAlign: "center",
    display: "block",
  },

  changeImageLink: {
    color: ORANGE,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    mt: 1,
    textAlign: "center",
    display: "block",
  },

  uploadIcon: {
    width: 40,
    height: 40,
    color: "#bbb",
    mb: 1,
  },

  // Branch select (before selection)
  branchSelectBox: {
    border: "1px solid #D0D0D0",
    borderRadius: "8px",
    px: 1.5,
    height: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    bgcolor: colors.white,
    cursor: "pointer",
    width: "100%",
    "&:hover": { borderColor: ORANGE },
    transition: "border-color 0.2s",
  },

  branchSubtitle: {
    fontSize: "12px",
    color: "#888",
    mb: 0.75,
    textAlign: "start",
  },

  // Branch card (after selection)
  branchCard: {
    border: `1.5px solid ${ORANGE}`,
    borderRadius: "8px",
    p: { xs: 1.5, md: 2 },
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    bgcolor: colors.white,
    gap: 1,
  },

  branchInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    flex: 1,
  },

  branchName: {
    fontSize: { xs: "14px", md: "15px" },
    fontWeight: "700",
    color: NAVY,
  },

  branchAddress: {
    fontSize: "12px",
    color: "#666",
    mt: 0.25,
    textAlign: "end",
  },

  changeBtn: {
    bgcolor: ORANGE,
    color: colors.white,
    borderRadius: "8px",
    px: 2,
    py: 0.6,
    fontSize: "13px",
    fontWeight: "700",
    minWidth: "60px",
    flexShrink: 0,
    "&:hover": { bgcolor: "#d97019", opacity: 1 },
  },

  // Phone input wrapper
  phoneInputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #D0D0D0",
    borderRadius: "8px",
    overflow: "hidden",
    bgcolor: colors.white,
    height: "46px",
    "&:focus-within": { borderColor: ORANGE, borderWidth: "1.5px" },
    transition: "border-color 0.2s",
    direction: "ltr",
  },

  flagBox: {
    display: "flex",
    alignItems: "center",
    px: 1.5,
    gap: 0.5,
    borderLeft: "1px solid #E0E0E0",
    height: "100%",
    flexShrink: 0,
    cursor: "pointer",
  },

  phoneInputInner: {
    border: "none",
    outline: "none",
    flex: 1,
    height: "100%",
    px: 1.5,
    fontSize: "14px",
    bgcolor: "transparent",
    fontFamily: "inherit",
  },

  // Consent checkbox
  consentRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 1,
    my: 2,
    cursor: "pointer",
  },

  consentText: {
    fontSize: { xs: "13px", md: "14px" },
    color: "#404456",
    fontWeight: "500",
  },

  // Buttons
  primaryBtn: {
    bgcolor: NAVY,
    color: colors.white,
    borderRadius: "8px",
    py: 1.5,
    fontSize: { xs: "14px", md: "16px" },
    fontWeight: "700",
    width: "100%",
    "&:hover": { bgcolor: "#1a1c4d" },
    "&.Mui-disabled": { bgcolor: "#9e9e9e", color: colors.white },
  },

  secondaryBtn: {
    bgcolor: colors.white,
    color: NAVY,
    border: `2px solid ${NAVY}`,
    borderRadius: "8px",
    py: 1.4,
    fontSize: { xs: "14px", md: "16px" },
    fontWeight: "700",
    width: "100%",
    "&:hover": { bgcolor: "#f0f0f0" },
  },

  buttonRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
    mt: 3,
  },

  // Step 2 — Installment cards
  installmentCard: (selected) => ({
    border: selected ? `2px solid ${ORANGE}` : "1.5px solid #D0D0D0",
    borderRadius: "8px",
    p: { xs: 1.5, md: 2 },
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    cursor: "pointer",
    bgcolor: selected ? "#FFF8F2" : colors.white,
    mb: 1.5,
    transition: "all 0.15s",
    "&:hover": { borderColor: ORANGE },
    userSelect: "none",
  }),

  installmentMonths: {
    fontSize: { xs: "15px", md: "17px" },
    fontWeight: "700",
    color: NAVY,
  },

  installmentAmount: {
    fontSize: { xs: "13px", md: "14px" },
    color: "#666",
    mt: 0.25,
  },

  infoNote: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    bgcolor: "#FFF8F2",
    border: `1px solid ${ORANGE}`,
    borderRadius: "8px",
    p: 1.5,
    mt: 2,
    mb: 3,
  },

  infoNoteText: {
    fontSize: "12px",
    color: "#555",
    textAlign: "start",
    flex: 1,
  },

  // Step 3 — Car condition buttons
  conditionBtnGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
    mb: 3,
  },

  conditionBtn: (active) => ({
    py: 1.5,
    fontWeight: "700",
    fontSize: { xs: "14px", md: "15px" },
    border: `2px solid ${active ? ORANGE : "#D0D0D0"}`,
    bgcolor: colors.white,
    color: active ? ORANGE : "#888",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s",
    "&:hover": {
      bgcolor: "#f5f5f5",
      borderColor: active ? ORANGE : "#bbb",
    },
  }),

  // Step 3 — Car decision cards
  carDecisionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
    mb: 3,
  },

  carDecisionCard: (selected) => ({
    border: selected ? `2px solid ${ORANGE}` : "1.5px solid #D0D0D0",
    borderRadius: "8px",
    p: { xs: 1.5, md: 2 },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    bgcolor: selected ? "#FFF8F2" : colors.white,
    transition: "all 0.15s",
    "&:hover": { borderColor: ORANGE },
    textAlign: "center",
    minHeight: { xs: "120px", md: "140px" },
  }),

  carDecisionLabel: {
    fontSize: { xs: "14px", md: "16px" },
    fontWeight: "700",
    color: NAVY,
    mt: 1,
  },

  carDecisionSub: {
    fontSize: "12px",
    color: "#666",
    mt: 0.25,
  },
};
