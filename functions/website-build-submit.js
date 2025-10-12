// /functions/website-build-submit.js
// Cloudflare Pages Function — Website Build Request (POST)
// Env required: RESEND_API_KEY
// Optional: RESEND_TO (default contact@dragonbonesandwizardshats.com), TURNSTILE_SECRET

export const onRequestPost = async (context) => {
  const { request, env } = context;

  try {
    const form = await request.formData();

    // Basic fields
    const name   = get(form, "name");
    const email  = get(form, "email");
    const company = get(form, "company");
    const domain_current = get(form, "domain_current");
    const domain_needed  = get(form, "domain_needed");
    const pages_estimate = get(form, "pages_estimate");
    const budget = get(form, "budget");
    const timeline = get(form, "timeline");
    const content_status = get(form, "content_status");
    const images_status  = get(form, "images_status");
    const message = get(form, "message");
    const agree_contact = get(form, "agree_contact");
    const honeypot = get(form, "website"); // should be empty

    // Multi-selects
    const site_types = form.getAll("site_type").map(v => String(v));
    const site_type_other = get(form, "site_type_other");
    const features = form.getAll("feature").map(v => String(v));
    const features_other_text = get(form, "features_other_text");

    const token = get(form, "cf-turnstile-response");
    const clientIP = request.headers.get("CF-Connecting-IP") || "";

    // Spam & validation
    if (honeypot) return badRequest("Spam detected.");
    if (!name || !email || !message || !agree_contact) {
      return badRequest("Name, email, message and consent are required.");
    }

    // Turnstile
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

    // Build email
    const to = (env.RESEND_TO || "contact@dragonbonesandwizardshats.com").trim();
    const from = "Dragon Bones & Wizards Hats <contact@dragonbonesandwizardshats.com>";
    const subject = `Website build request — ${name}${company ? " / " + company : ""}`;

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.55;color:#0B0F12;">
        <h2 style="margin:0 0 .5rem;color:#00BFA5;">New website build request</h2>

        <table style="border-collapse:collapse">
          ${row("Name", name)}
          ${row("Email", email)}
          ${company ? row("Company", company) : ""}
          ${domain_current ? row("Current Domain", domain_current) : ""}
          ${domain_needed ? row("Needs Domain", domain_needed) : ""}

          ${site_types.length ? row("Site Type(s)", site_types.join(", ")) : ""}
          ${site_type_other ? row("Site Type (other)", site_type_other) : ""}

          ${row("Pages (estimate)", pages_estimate || "—")}
          ${features.length ? row("Features", features.join(", ")) : ""}
          ${features_other_text ? row("Features (other)", features_other_text) : ""}

          ${row("Content Status", content_status || "—")}
          ${row("Images Status", images_status || "—")}

          ${row("Budget", budget || "—")}
          ${row("Timeline", timeline || "—")}
        </table>

        <p style="margin:.75rem 0 .25rem"><strong>Project notes</strong></p>
        <pre style="white-space:pre-wrap;background:#0F1419;color:#D9E1E8;padding:12px;border-radius:10px;">${escapeHTML(message)}</pre>

        <p style="margin-top:1rem;color:#92A1AD;">IP: ${escapeHTML(clientIP)} · ${new Date().toISOString()}</p>
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

    return redirect("/build-a-website.html?sent=1");

  } catch (err) {
    return serverError(err?.message || "Unknown error.");
  }
};

// Helpers
const get = (form, k) => (form.get(k) || "").toString().trim();

const row = (label, value) =>
  `<tr><td style="padding:4px 10px 4px 0;color:#475360;">${escapeHTML(label)}</td><td style="padding:4px 0"><strong>${escapeHTML(value)}</strong></td></tr>`;

const redirect = (path) => new Response(null, { status: 302, headers: { Location: path } });
const badRequest = (msg) => new Response(msg, { status: 400, headers: { "Content-Type": "text/plain" } });
const serverError = (msg) => new Response(msg, { status: 500, headers: { "Content-Type": "text/plain" } });

const safeJson = async (res) => { try { return await res.json(); } catch { return { raw: await res.text() }; } };

function escapeHTML(s){
  return s.replace(/[&<>"']/g, (c)=>({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
            }
