// Cloudflare Pages Function — contact form submit (POST)
// - No npm packages required (Resend REST API via fetch)
// - Optional Turnstile validation if TURNSTILE_SECRET is set
// - Redirects to /contact.html?sent=1 on success
// Env required: RESEND_API_KEY (Secret)
// Optional env: RESEND_TO (defaults to contact@dragonbonesandwizardshats.com), TURNSTILE_SECRET

export const onRequestPost = async (context) => {
  const { request, env } = context;

  try {
    // 1) Parse form fields
    const form = await request.formData();
    const name = (form.get("name") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const message = (form.get("message") || "").toString().trim();
    const token = (form.get("cf-turnstile-response") || "").toString().trim();
    const clientIP = request.headers.get("CF-Connecting-IP") || "";

    // 2) Optional Turnstile validation
    if (env.TURNSTILE_SECRET) {
      if (!token) return badRequest("Turnstile missing.");
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: token,
          remoteip: clientIP
        })
      });
      const verify = await verifyRes.json();
      if (!verify.success) return badRequest("Turnstile failed.");
    }

    // 3) Minimal validation
    if (!name || !email || !message) return badRequest("All fields required.");

    // 4) Compose email (Resend REST API)
    const to = (env.RESEND_TO || "contact@dragonbonesandwizardshats.com").trim();
    const from = "Dragon Bones & Wizards Hats <contact@dragonbonesandwizardshats.com>";
    const subject = `Contact Form — ${name}`;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5;color:#0B0F12;">
        <h2 style="margin:0 0 .5rem 0;color:#00BFA5;">New contact message</h2>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        <p><strong>Email:</strong> ${escapeHTML(email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;background:#0F1419;color:#D9E1E8;padding:12px;border-radius:10px;">${escapeHTML(message)}</pre>
        <p style="margin-top:1rem;color:#92A1AD;">Sent from dragonbonesandwizardshats.com · ${new Date().toISOString()}</p>
      </div>
    `.trim();

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ from, to, subject, html, reply_to: email })
    });

    if (!resendRes.ok) {
      const err = await safeJson(resendRes);
      return serverError(`Resend error: ${resendRes.status} ${JSON.stringify(err)}`);
    }

    // 5) Success → redirect with toast flag
    return redirectWithToast("/contact.html?sent=1");

  } catch (e) {
    return serverError(e?.message || "Unknown error.");
  }
};

// --- helpers ---
const redirectWithToast = (path) =>
  new Response(null, { status: 302, headers: { Location: path } });

const badRequest = (msg) =>
  new Response(msg, { status: 400, headers: { "Content-Type": "text/plain" } });

const serverError = (msg) =>
  new Response(msg, { status: 500, headers: { "Content-Type": "text/plain" } });

const safeJson = async (res) => {
  try { return await res.json(); } catch { return { raw: await res.text() }; }
};

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
    }
