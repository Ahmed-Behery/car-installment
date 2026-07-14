import Box from "@mui/material/Box";
import ar from "locales/ar";
import en from "locales/en";
import { useRouter } from "next/router";
import LanguageSwitcher from "./LanguageSwitcher";

const ORANGE = "#F18222";

export default function NavBar() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ar" ? ar : en;

  return (
    <Box sx={{ px: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          py: 1.5,
        }}
      >
        <Box
          component="img"
          src={t.logo}
          alt="logo"
          width="77px"
          height="22px"
          loading="lazy"
          decoding="async"
        />
        <LanguageSwitcher />
      </Box>
    </Box>
  );
}
