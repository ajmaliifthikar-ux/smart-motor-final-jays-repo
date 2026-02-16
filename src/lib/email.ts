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

          <p><strong>Need to reschedule?</strong> Contact us at +971 2 XXX XXXX</p>
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

          <p>Need help? Our team is here 24/7 at <a href="tel:+97126551234">+971 2 655 1234</a></p>
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
 * Send newsletter welcome email
 */
export async function sendNewsletterWelcomeEmail(email: string) {
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
          <h1>Welcome to our Newsletter!</h1>
        </div>
        <div class="content">
          <h2>Hi there,</h2>
          <p>Thank you for joining the Smart Motor Performance newsletter!</p>
          <p>You're now part of our elite club. You'll receive exclusive offers, maintenance tips, and early access to campaigns directly in your inbox.</p>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/services" class="button">
            Explore Services
          </a>

          <p>If you have any questions, feel free to reply to this email.</p>
        </div>
        <div class="footer">
          <p>Smart Motor Performance</p>
          <p>Musaffah M9, Abu Dhabi | Nadd Al Hamar, Dubai</p>
          <p>© 2026 Smart Motor. All rights reserved.</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `

    return sendEmail({
        to: email,
        subject: 'Welcome to the Smart Motor Elite Club! 🏎️',
        html,
        text: `Thank you for joining the Smart Motor Performance newsletter! Visit ${process.env.NEXT_PUBLIC_APP_URL}/services to explore our services.`,
    })
}
