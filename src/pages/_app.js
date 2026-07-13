import { useMemo, useEffect } from "react";
import { CacheProvider } from "@emotion/react";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { createEmotionCacheRtl } from "@/utils/createEmotionCache";

// Only Arabic (RTL) needs a dedicated cache with the rtl stylis plugin.
// English keeps emotion's own default cache untouched.
const rtlCache = createEmotionCacheRtl();

export default function App({ Component, pageProps }) {
  const { locale } = useRouter();
  const isRtl = locale !== "en";
  const appFontFamily = isRtl
  ? '"GE SS Two", Arial, sans-serif'
  : '"Fontfabric Nexa", Arial, sans-serif';

  const direction = isRtl ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [locale, direction, isRtl]);

  const theme = useMemo(
    () =>
      createTheme({
        direction: isRtl ? "rtl" : "ltr",
        typography: { fontFamily: appFontFamily },
        // components: {
        //   MuiSelect: {
        //     styleOverrides: {
        //       select: {
        //         textAlign: "start",
        //         direction: "inherit",
        //       },
        //     },
        //   },
        //   MuiButton: {
        //     styleOverrides: {
        //       root: { textTransform: "capitalize", fontWeight: "600 !important" },
        //     },
        //   },
        // },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "capitalize",
                fontWeight: "600 !important",
              },
            },
          },

          MuiSelect: {
            styleOverrides: {
              select: {
                textAlign: "start",
                direction: "inherit",
                fontFamily: appFontFamily,
              },
            },

            defaultProps: {
              MenuProps: {
                PaperProps: {
                  dir: direction,
                  sx: {
                    direction,
                    fontFamily: appFontFamily,
                  },
                },

                MenuListProps: {
                  dir: direction,
                  sx: {
                    // direction,
                    textAlign: "start",
                    fontFamily: appFontFamily,
                  },
                },
              },
            },
          },

          MuiMenuItem: {
            styleOverrides: {
              root: {
                direction: "inherit",
                textAlign: "start",
                justifyContent: "flex-start",
                fontFamily: appFontFamily,
                width: "100%",
              },
            },
          },
        },
      }),
  [isRtl, appFontFamily]
  );

  const content = (
    <ThemeProvider theme={theme}>
      <I18nProvider>
        <Box id="app-root" dir={isRtl ? "rtl" : "ltr"}>
          <LanguageSwitcher />
          <Component {...pageProps} />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            rtl={isRtl}
            pauseOnHover
            transition={Slide}
            theme="colored"
          />
        </Box>
      </I18nProvider>
    </ThemeProvider>
  );

  return isRtl ? <CacheProvider value={rtlCache}>{content}</CacheProvider> : content;
}
