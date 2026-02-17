import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// Email service configuration
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// SMTP fallback
const smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sgp200.greengeeks.net',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // Use TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})

interface EmailOptions {
    to: string | string[]
    subject: string
    html: string
    text?: string
}

/**
 * Send email using Resend (preferred) or SMTP fallback
 */
export async function sendEmail(options: EmailOptions) {
    const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'Smart Motor <noreply@smartmotor.ae>'

    try {
        // Try Resend first (faster, more reliable)
        if (resend) {
            const { data, error } = await resend.emails.send({
                from,
                to: Array.isArray(options.to) ? options.to : [options.to],
                subject: options.subject,
                html: options.html,
                text: options.text,
            })

            if (error) {
                console.error('Resend error:', error)
                throw new Error(`Email failed: ${error.message}`)
            }

            return { success: true, messageId: data?.id }
        }

        // Fallback to SMTP
        if (process.env.SMTP_USER) {
            const info = await smtpTransporter.sendMail({
                from,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            })

            return { success: true, messageId: info.messageId }
        }

        throw new Error('No email service configured. Set RESEND_API_KEY or SMTP credentials.')
    } catch (error) {
        console.error('Email send error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Send OTP email
 */
export async function sendOTPEmail(email: string, otp: string) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #121212; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .otp-box { background: #E62329; color: white; font-size: 32px; font-weight: bold; 
                   padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; 
                   letter-spacing: 8px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Smart Motor UAE</h1>
        </div>
        <div class="content">
          <h2>Your One-Time Password</h2>
          <p>Use this code to complete your action:</p>
          <div class="otp-box">${otp}</div>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Smart Motor Performance - Abu Dhabi, UAE</p>
          <p>© 2026 Smart Motor. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

    return sendEmail({
        to: email,
        subject: 'Your Smart Motor Verification Code',
        html,
        text: `Your Smart Motor verification code is: ${otp}. Valid for 10 minutes.`,
    })
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(email: string, bookingDetails: {
    id: string
    serviceName: string
    date: string
    time: string
    customerName: string
}) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #121212; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .booking-card { background: white; border-left: 4px solid #E62329; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #121212; }
        .value { color: #666; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .button { background: #E62329; color: white; padding: 12px 24px; text-decoration: none; 
                  border-radius: 4px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Booking Confirmed</h1>
        </div>
        <div class="content">
          <p>Dear ${bookingDetails.customerName},</p>
          <p>Your service booking has been confirmed!</p>
          
          <div class="booking-card">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <span class="label">Booking ID:</span>
              <span class="value">${bookingDetails.id}</span>
            </div>
            <div class="detail-row">
              <span class="label">Service:</span>
              <span class="value">${bookingDetails.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${bookingDetails.date}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time:</span>
              <span class="value">${bookingDetails.time}</span>
            </div>
          </div>

          <p>We'll send you a reminder 24 hours before your appointment.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingDetails.id}" class="button">
            View Booking
          </a>

          <p><strong>Need to reschedule?</strong> Contact us at +971 2 555 5443</p>
        </div>
        <div class="footer">
          <p>Smart Motor Performance</p>
          <p>Musaffah M9, Abu Dhabi, UAE</p>
          <p>© 2026 Smart Motor. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

    return sendEmail({
        to: email,
        subject: `Booking Confirmed - ${bookingDetails.serviceName}`,
        html,
        text: `Your booking for ${bookingDetails.serviceName} on ${bookingDetails.date} at ${bookingDetails.time} has been confirmed. Booking ID: ${bookingDetails.id}`,
    })
}

/**
 * Send admin notification
 */
export async function sendAdminNotification(subject: string, message: string) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartmotor.ae'

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #121212;">${subject}</h2>
      <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #E62329;">
        ${message}
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This is an automated notification from Smart Motor Platform.
      </p>
    </body>
    </html>
  `

    return sendEmail({
        to: adminEmail,
        subject: `[Smart Motor Admin] ${subject}`,
        html,
        text: message,
    })
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, name: string) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #121212; color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { background: #E62329; color: white; padding: 14px 28px; text-decoration: none; 
                  border-radius: 4px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Smart Motor!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for creating an account with Smart Motor Performance!</p>
          <p>We're your trusted partner for premium automotive care in Abu Dhabi and Dubai.</p>
          
          <h3>What's Next?</h3>
          <ul>
            <li>📅 Book your first service</li>
            <li>🚗 Add your vehicles to your profile</li>
            <li>💎 Explore our service packages</li>
            <li>📱 Download our mobile app (coming soon)</li>
          </ul>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/services" class="button">
            Browse Services
          </a>

          <p>Need help? Our team is here 24/7 at <a href="tel:+97125555443">+971 2 555 5443</a></p>
        </div>
        <div class="footer">
          <p>Smart Motor Performance</p>
          <p>Musaffah M9, Abu Dhabi | Nadd Al Hamar, Dubai</p>
          <p>© 2026 Smart Motor. All rights reserved.</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `

    return sendEmail({
        to: email,
        subject: 'Welcome to Smart Motor - Let\'s Get Started!',
        html,
        text: `Hi ${name}, welcome to Smart Motor! Visit ${process.env.NEXT_PUBLIC_APP_URL} to get started.`,
    })
}

/**
 * Send newsletter welcome email — branded Smart Motor design
 */
export async function sendNewsletterWelcomeEmail(email: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartmotorlatest.vercel.app'
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to the Smart Motor Elite Club</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#121212 0%,#1a1a1a 100%);border-radius:20px 20px 0 0;padding:48px 48px 40px;text-align:center;border-bottom:2px solid #E62329;">
              <div style="display:inline-block;background:#E62329;color:white;font-size:9px;font-weight:900;letter-spacing:0.4em;text-transform:uppercase;padding:6px 16px;border-radius:100px;margin-bottom:20px;">
                Smart Motor Performance
              </div>
              <h1 style="margin:0;color:white;font-size:40px;font-weight:900;letter-spacing:-0.03em;text-transform:uppercase;font-style:italic;line-height:1;">
                Welcome to the<br/>
                <span style="color:#E62329;">Elite Club</span>
              </h1>
              <p style="margin:16px 0 0;color:rgba(255,255,255,0.5);font-size:13px;font-weight:500;">You are now part of something exceptional.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#FAFAF9;padding:48px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:11px;font-weight:900;color:#E62329;text-transform:uppercase;letter-spacing:0.3em;">Confirmed ✓</p>
              <h2 style="margin:0 0 16px;font-size:26px;font-weight:900;color:#121212;letter-spacing:-0.02em;text-transform:uppercase;font-style:italic;">
                You're In.
              </h2>
              <p style="margin:0 0 32px;font-size:15px;color:#555555;line-height:1.7;">
                Thank you for subscribing to the <strong style="color:#121212;">Smart Motor Performance</strong> newsletter.
                From this moment on, your inbox becomes a hub for exclusive automotive intelligence — crafted for those who demand the best.
              </p>

              <!-- What to expect -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#121212;border-radius:16px;padding:32px;">
                    <p style="margin:0 0 20px;font-size:10px;font-weight:900;color:#E62329;text-transform:uppercase;letter-spacing:0.4em;">What's Coming Your Way</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="color:#E62329;font-size:16px;margin-right:12px;">🔧</span>
                          <span style="color:white;font-size:13px;font-weight:700;">Exclusive Service Offers & Seasonal Packages</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="color:#E62329;font-size:16px;margin-right:12px;">💡</span>
                          <span style="color:white;font-size:13px;font-weight:700;">Pro Maintenance Tips for Luxury Vehicles</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="color:#E62329;font-size:16px;margin-right:12px;">🏎️</span>
                          <span style="color:white;font-size:13px;font-weight:700;">Early Access to New Services & Campaigns</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;">
                          <span style="color:#E62329;font-size:16px;margin-right:12px;">📍</span>
                          <span style="color:white;font-size:13px;font-weight:700;">Workshop News & Abu Dhabi Automotive Events</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/new-home" style="display:inline-block;background:#E62329;color:white;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;padding:18px 40px;border-radius:100px;box-shadow:0 8px 24px rgba(230,35,41,0.35);">
                      Explore Services →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #ECECEA;margin:32px 0;" />

              <!-- Contact info -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 6px;font-size:12px;color:#888888;">Questions? Contact us anytime.</p>
                    <a href="tel:80076278" style="font-size:18px;font-weight:900;color:#121212;text-decoration:none;letter-spacing:0.05em;">800 76278</a>
                    <p style="margin:8px 0 0;font-size:11px;color:#AAAAAA;">Toll Free • 7 Days a Week</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#121212;border-radius:0 0 20px 20px;padding:32px 48px;text-align:center;">
              <p style="margin:0 0 8px;font-size:10px;font-weight:900;color:white;text-transform:uppercase;letter-spacing:0.3em;">Smart Motor Performance</p>
              <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);">Musaffah M9, Abu Dhabi &nbsp;|&nbsp; Nadd Al Hamar, Dubai</p>
              <p style="margin:16px 0 0;font-size:10px;color:rgba(255,255,255,0.25);">
                © 2026 Smart Motor. All rights reserved. &nbsp;•&nbsp;
                <a href="${appUrl}/unsubscribe?email=${encodeURIComponent(email)}" style="color:rgba(255,255,255,0.3);text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    return sendEmail({
        to: email,
        subject: '🏎️ Welcome to the Smart Motor Elite Club',
        html,
        text: `Welcome to the Smart Motor Elite Club! You'll now receive exclusive offers, maintenance tips, and early access to campaigns. Visit ${appUrl}/new-home to explore our services. Questions? Call us toll free: 800 76278. To unsubscribe: ${appUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
    })
}
