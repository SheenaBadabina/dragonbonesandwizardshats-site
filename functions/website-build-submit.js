// functions/website-build-submit.js
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    try {
      const data = await request.formData()
      const token = data.get('cf-turnstile-response')
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown'

      // Verify Turnstile
      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET,
          response: token,
          remoteip: ip,
        }),
      })
      const outcome = await turnstileRes.json()
      if (!outcome.success) {
        console.error('❌ Turnstile failed:', outcome)
        return new Response('Captcha failed', { status: 400 })
      }

      // Collect form fields
      const fields = {}
      for (const [key, value] of data.entries()) fields[key] = value

      // Compose email body
      const html = `
        <h2>✨ New Website Build Request</h2>
        <p><strong>Name:</strong> ${fields.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${fields.email || 'N/A'}</p>
        <p><strong>Domain:</strong> ${fields.domain || 'N/A'}</p>
        <p><strong>Type:</strong> ${fields.siteType || 'N/A'}</p>
        <p><strong>Pages:</strong> ${fields.pages || 'N/A'}</p>
        <p><strong>Budget:</strong> ${fields.budget || 'N/A'}</p>
        <p><strong>Features:</strong> ${fields.features || 'N/A'}</p>
        <p><strong>Content:</strong> ${fields.content || 'N/A'}</p>
        <p><strong>Images:</strong> ${fields.images || 'N/A'}</p>
        <p><strong>Summary:</strong></p>
        <p>${fields.summary || 'N/A'}</p>
      `

      // Send via Resend
      await resend.emails.send({
        from: 'Dragon Bones & Wizards Hats <contact@dragonbonesandwizardshat.com>',
        to: ['contact@dragonbonesandwizardshat.com'],
        subject: 'New Website Build Request',
        html,
      })

      console.log('✅ Website request submitted successfully.')
      return Response.redirect('/build-a-website.html?sent=1', 303)

    } catch (err) {
      console.error('🔥 Submission error:', err)
      return new Response('Internal Server Error', { status: 500 })
    }
  },
}
