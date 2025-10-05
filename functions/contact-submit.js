// functions/contact-submit.js
// Handles POSTs from /contact.html and sends email via Resend.
// Requires Cloudflare Pages Functions and a Secret named RESEND_API_KEY.
import { Resend } from "resend";

export const onRequestPost = async ({ request, env }) => {
  try {
    // Parse form fields
    const form = await request.formData();
    const name = form.get("name") || "Anonymous";
    const email = form.get("email") || "";
    const message = form.get("message") || "";

    if (!email || !message) {
      return new Response("Missing required fields.", { status: 400 });
    }

    // Optional: Cloudflare Turnstile verification if you later add TURNSTILE_SECRET
    const turnstileToken = form.get("cf-turnstile-response");
    if (env.TURNSTILE_SECRET && turnstileToken) {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: turnstileToken,
        }),
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return new Response("Turnstile verification failed.", { status: 403 });
      }
    }

    // Send via Resend
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Dragon Bones & Wizards Hats <contact@dragonbonesandwizardshats.com>",
      to: "contact@dragonbonesandwizardshats.com",
      reply_to: email,
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Message:</b></p>
        <pre style="white-space:pre-wrap;font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif">
${escapeHtml(message)}
        </pre>
      `,
    });

    // Redirect back to Contact page with success toast
    return Response.redirect("/contact.html?sent=1", 303);
  } catch (err) {
    return new Response("Error: " + (err && err.message ? err.message : String(err)), { status: 500 });
  }
};

// Minimal HTML escaping to avoid injection in email body
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
