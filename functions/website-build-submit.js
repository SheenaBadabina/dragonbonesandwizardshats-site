// /functions/website-request.js
// Cloudflare Pages Function — “Have Me Build Your Website” (POST)
//
// Env required: RESEND_API_KEY (Secret)
// Optional env: RESEND_TO (defaults to contact@dragonbonesandwizardshats.com)
// Optional env: TURNSTILE_SECRET (if you enable the Turnstile widget)

export const onRequestPost = async (context) => {
  const { request, env } = context;

  try {
    const form = await request.formData();

    // Basics
    const name   = s(form.get("name"));
    const email  = s(form.get("email"));
    const domain = s(form.get("domain"));
    const haveDomain = s(form.get("haveDomain"));
    const pages  = s(form.get("pages"));
    const budget = s(form.get("budget"));
    const content = s(form.get("content"));
    const images  = s(form.get("images"));
    const siteOther = s(form.get("siteOther"));
    const featuresOther = s(form.get("featuresOther"));
    const summary = s(form.get("summary"));

    // Multi-selects
    const siteTypes = arr(form.getAll("siteType"));
    const features  = arr(form.getAll("features"));

    // Turnstile
    const token = s(form.get("cf-turnstile-response"));
    const clientIP = request.headers.get("CF-Connecting-IP") || "";

    if (!name || !email) return badRequest("Name and email required.");

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

    const to = (env.RESEND_TO || "contact@dragonbonesandwizardshats.com").trim();
    const from = "Dragon Bones & Wizards Hats <contact@dragonbonesandwizardshats.com>";
    const subjBits = [name || "New lead", domain ? `(${domain})` : "", budget ? `· ${budget}` : ""]
      .filter(Boolean).join(" ");
    const subject = `Website project request — ${subjBits}`;

    const html = renderEmailHTML({
      name, email, haveDomain, domain, siteTypes, siteOther,
      pages, budget, features, featuresOther, content, images, summary
    });

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

    // Success: bounce back to the page with a toast
    return redirectWithToast("/build-a-website.html?sent=1");

  } catch (e) {
    return serverError(e?.message || "Unknown error.");
  }
};

// ---------- helpers ----------
const redirectWithToast = (path) =>
  new Response(null, { status: 302, headers: { Location: path } });

const badRequest = (msg) =>
  new Response(msg, { status: 400, headers: { "Content-Type": "text/plain" } });

const serverError = (msg) =>
  new Response(msg, { status: 500, headers: { "Content-Type": "text/plain" } });

const safeJson = async (res) => {
  try { return await res.json(); } catch { return { raw: await res.text() }; }
};

const s = (v) => (v == null ? "" : String(v).trim()).slice(0, 4000);
const arr = (xs) => (Array.isArray(xs) ? xs.map(s).filter(Boolean) : []);

// email renderer
function renderEmailHTML(data) {
  const esc = escapeHTML;
  const li = (label, value) =>
    value ? `<p><strong>${esc(label)}:</strong> ${esc(value)}</p>` : "";

  const liList = (label, values) =>
    values && values.length
      ? `<p><strong>${esc(label)}:</strong> ${values.map(esc).join(", ")}</p>`
      : "";

  return `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.55;color:#0B0F12;">
    <h2 style="margin:0 0 .5rem;color:#00BFA5;">New website project request</h2>
    ${li("Name", data.name)}
    ${li("Email", data.email)}
    ${li("Have domain", data.haveDomain)}
    ${li("Domain", data.domain)}
    ${liList("Type of site", data.siteTypes)}
    ${li("Type — other", data.siteOther)}
    ${li("Pages", data.pages)}
    ${li("Budget", data.budget)}
    ${liList("Features", data.features)}
    ${li("Features — other", data.featuresOther)}
    ${li("Content readiness", data.content)}
    ${li("Images & artwork", data.images)}
    ${data.summary ? `
      <p><strong>Project summary:</strong></p>
      <pre style="white-space:pre-wrap;background:#0F1419;color:#D9E1E8;padding:12px;border-radius:10px;">${esc(data.summary)}</pre>
    ` : ""}
    <p style="margin-top:1rem;color:#92A1AD;">Sent from Build-a-Website · ${new Date().toISOString()}</p>
  </div>
  `.trim();
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
    }
