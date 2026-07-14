import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const ORANGE = "#F18222";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, asPath } = router;

  const nextLocale = locale === "en" ? "ar" : "en";

  const switchLanguage = () => {
    router.push(asPath, asPath, { locale: nextLocale });
  };

  return (
    <Box>
      <Button
        onClick={switchLanguage}
        size="small"
        sx={{
          minWidth: "72px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 700,
          py: 0.4,
          bgcolor: ORANGE,
          color: "#fff",
          border: `1px solid ${ORANGE}`,
          "&:hover": {
            bgcolor: ORANGE,
          },
        }}
      >
        {nextLocale === "ar" ? "العربية" : "EN"}
      </Button>
    </Box>
  );
}
