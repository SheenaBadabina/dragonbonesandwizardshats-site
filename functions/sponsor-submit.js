// functions/sponsor-submit.js
import { Resend } from "resend";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    const resend = new Resend(env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: "Dragon Bones & Wizards Hats <contact@dragonbonesandwizardshats.com>",
        to: "contact@dragonbonesandwizardshats.com",
        subject: `New Sponsorship Request from ${data.company || data.name}`,
        html: `
          <h2>New Sponsorship or Inquiry</h2>
          <p><b>Company:</b> ${data.company || "N/A"}</p>
          <p><b>Contact:</b> ${data.contact || "N/A"}</p>
          <p><b>Email:</b> ${data.email}</p>
          <p><b>Website:</b> ${data.website || "N/A"}</p>
          <p><b>Product/Service:</b> ${data.product || "N/A"}</p>
          <p><b>Message:</b></p>
          <p>${data.message || data.fit || "No message provided."}</p>
          <p><b>Budget:</b> ${data.budget || "N/A"}</p>
          <p><b>Timeline:</b> ${data.timeline || "N/A"}</p>
          <p><b>Deliverables:</b> ${formData.getAll("deliverables").join(", ") || "N/A"}</p>
        `
      });

      return Response.redirect("/work-with-me.html?sent=1", 303);
    } catch (err) {
      return new Response("Error sending email: " + err.message, { status: 500 });
    }
  }
};
