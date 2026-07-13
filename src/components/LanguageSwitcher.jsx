import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const ORANGE = "#F18222";
const NAVY = "#212564";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, asPath } = router;

  const switchTo = (nextLocale) => {
    if (nextLocale === locale) return;
    router.push(asPath, asPath, { locale: nextLocale });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1,
        py: 1.5,
      }}
    >
      {[
        { code: "ar", label: "العربية" },
        { code: "en", label: "English" },
      ].map((lng) => {
        const active = locale === lng.code;
        return (
          <Button
            key={lng.code}
            onClick={() => switchTo(lng.code)}
            size="small"
            sx={{
              minWidth: "72px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
              py: 0.4,
              bgcolor: active ? ORANGE : "transparent",
              color: active ? "#fff" : NAVY,
              border: `1px solid ${active ? ORANGE : "#D0D0D0"}`,
              "&:hover": { bgcolor: active ? ORANGE : "#f5f5f5" },
            }}
          >
            {lng.label}
          </Button>
        );
      })}
    </Box>
  );
}
