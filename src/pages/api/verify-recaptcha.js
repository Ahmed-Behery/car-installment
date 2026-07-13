// Server-side reCAPTCHA verification. Runs as a Next.js API route so the
// secret key never reaches the browser.
//
// Defaults to Google's public test keypair (always verifies successfully,
// documented at https://developers.google.com/recaptcha/docs/faq) so the
// form works out of the box. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY and
// RECAPTCHA_SECRET_KEY to your own registered keys for production use.

const TEST_SECRET_KEY = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ success: false, error: "Missing token" });
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY || TEST_SECRET_KEY;

  try {
    const googleRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });

    const data = await googleRes.json();
    return res.status(200).json({ success: !!data.success });
  } catch {
    return res.status(502).json({ success: false, error: "Verification request failed" });
  }
}
