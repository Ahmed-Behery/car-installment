import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

// Only Arabic (RTL) needs a dedicated cache with the rtl stylis plugin;
// English keeps emotion's own default cache untouched (see _app.js).
export function createEmotionCacheRtl() {
  return createCache({
    key: "css-rtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });
}
