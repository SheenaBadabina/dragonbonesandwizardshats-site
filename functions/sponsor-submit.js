// Cloudflare Pages Function — sponsorship/Work With Me form (POST)
// Same architecture as contact-submit.js
// Env required: RESEND_API_KEY (Secret)
// Optional env: RESEND_TO (defaults to contact@dragonbonesandwizardshats.com), TURNSTILE_SECRET

export const onRequestPost = async (context) => {
  const { request, env } = context;

  try {
    const form = await request.formData();
    const name = (form.get("name") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const brand = (form.get("brand") || "").toString().trim();
    const budget = (form.get("budget") || "").toString().trim();
    const notes = (form.get("message") || "").toString().trim();
    const token = (form.get("cf-turnstile-response") || "").toString().trim();
    const clientIP = request.headers.get("CF-Connecting-IP") || "";

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

    if (!name || !email) return badRequest("Name and email required.");

    const to = (env.RESEND_TO || "contact@dragonbonesandwizardshats.com").trim();
    const from = "Dragon Bones & Wizards Hats <contact@dragonbonesandwizardshats.com>";
    const subject = `Sponsorship inquiry — ${name}${brand ? " / " + brand : ""}`;

    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5;color:#0B0F12;">
        <h2 style="margin:0 0 .5rem 0;color:#00BFA5;">New sponsorship inquiry</h2>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        <p><strong>Email:</strong> ${escapeHTML(email)}</p>
        ${brand ? `<p><strong>Brand:</strong> ${escapeHTML(brand)}</p>` : ""}
        ${budget ? `<p><strong>Budget:</strong> ${escapeHTML(budget)}</p>` : ""}
        ${notes ? `<p><strong>Notes:</strong></p>
        <pre style="white-space:pre-wrap;background:#0F1419;color:#D9E1E8;padding:12px;border-radius:10px;">${escapeHTML(notes)}</pre>` : ""}
        <p style="margin-top:1rem;color:#92A1AD;">Sent from Work With Me · ${new Date().toISOString()}</p>
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

    return redirectWithToast("/work-with-me.html?sent=1");

  } catch (e) {
    return serverError(e?.message || "Unknown error.");
  }
};

// --- helpers (same as contact) ---
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
