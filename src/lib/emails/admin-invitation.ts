/**
 * Admin Invitation Email Template
 * Professional invitation for new admin setup
 */

export function generateAdminInvitationEmail(
    adminName: string,
    adminEmail: string,
    setupLink: string,
    companyName: string = 'Smart Motor Performance',
    senderName: string = 'Admin Team'
): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Account Setup - ${companyName}</title>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%);font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%);padding:40px 0;">
        <tr>
            <td align="center">
                <table width="700" cellpadding="0" cellspacing="0" style="max-width:700px;width:100%;background:#FAFAF9;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">

                    <!-- HEADER BANNER -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#121212 0%,#1a1a1a 100%);border-radius:24px 24px 0 0;padding:60px 48px;border-bottom:3px solid #E62329;">
                            <div style="text-align:center;">
                                <div style="display:inline-block;background:#E62329;color:white;font-size:10px;font-weight:900;letter-spacing:0.4em;text-transform:uppercase;padding:8px 20px;border-radius:100px;margin-bottom:24px;">
                                    🔐 Admin Invite
                                </div>
                                <h1 style="margin:0;color:white;font-size:40px;font-weight:900;letter-spacing:-0.03em;line-height:1.2;">
                                    ${companyName}
                                </h1>
                                <p style="margin:16px 0 0;color:rgba(255,255,255,0.7);font-size:13px;font-weight:500;">Complete Your Admin Setup</p>
                            </div>
                        </td>
                    </tr>

                    <!-- MAIN CONTENT -->
                    <tr>
                        <td style="padding:48px;background:#FAFAF9;">
                            <p style="margin:0 0 8px;font-size:11px;font-weight:900;color:#E62329;text-transform:uppercase;letter-spacing:0.3em;">Admin Setup</p>
                            <h2 style="margin:0 0 24px;font-size:28px;font-weight:900;color:#121212;letter-spacing:-0.02em;">
                                Welcome, ${adminName}
                            </h2>

                            <p style="margin:0 0 24px;font-size:14px;color:#555555;line-height:1.8;">
                                You've been invited to join the ${companyName} admin panel. This is your exclusive access to the platform's management dashboard.
                            </p>

                            <!-- WHAT YOU GET -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;border-collapse:collapse;">
                                <tr>
                                    <td style="background:#121212;border-radius:12px;padding:24px;">
                                        <p style="margin:0 0 16px;font-size:11px;font-weight:900;color:#E62329;text-transform:uppercase;letter-spacing:0.3em;">Admin Features</p>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                                                    <span style="color:#E62329;font-size:14px;margin-right:12px;">🔐</span>
                                                    <span style="color:white;font-size:12px;font-weight:700;">Enterprise-Grade 2FA Security</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                                                    <span style="color:#E62329;font-size:14px;margin-right:12px;">📊</span>
                                                    <span style="color:white;font-size:12px;font-weight:700;">Real-Time Dashboard & Analytics</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                                                    <span style="color:#E62329;font-size:14px;margin-right:12px;">🤖</span>
                                                    <span style="color:white;font-size:12px;font-weight:700;">AI-Powered Content Generation</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                                                    <span style="color:#E62329;font-size:14px;margin-right:12px;">📱</span>
                                                    <span style="color:white;font-size:12px;font-weight:700;">Mobile-Optimized Interface</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;">
                                                    <span style="color:#E62329;font-size:14px;margin-right:12px;">👥</span>
                                                    <span style="color:white;font-size:12px;font-weight:700;">Team Management & Permissions</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- SETUP INSTRUCTIONS -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;border-collapse:collapse;background:#F0F0F0;border-radius:12px;padding:24px;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 16px;font-size:12px;font-weight:900;color:#121212;text-transform:uppercase;letter-spacing:0.2em;">3-Step Setup Process</p>

                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:12px;background:#E62329;border-radius:8px;color:white;font-weight:900;font-size:18px;width:60px;text-align:center;">1</td>
                                                <td style="padding:12px 20px;color:#555555;font-size:12px;font-weight:700;">Click the setup link below</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="height:8px;"></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px;background:#E62329;border-radius:8px;color:white;font-weight:900;font-size:18px;width:60px;text-align:center;">2</td>
                                                <td style="padding:12px 20px;color:#555555;font-size:12px;font-weight:700;">Create your secure password</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="height:8px;"></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px;background:#E62329;border-radius:8px;color:white;font-weight:900;font-size:18px;width:60px;text-align:center;">3</td>
                                                <td style="padding:12px 20px;color:#555555;font-size:12px;font-weight:700;">Enable 2FA with authenticator app</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA BUTTON -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${setupLink}" style="display:inline-block;background:linear-gradient(135deg,#E62329 0%,#d41d1d 100%);color:white;text-decoration:none;font-size:12px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;padding:18px 48px;border-radius:100px;box-shadow:0 8px 24px rgba(230,35,41,0.35);">
                                            Complete Setup Now →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- IMPORTANT NOTES -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;background:#FFF3CD;border-radius:12px;padding:20px;border-left:4px solid #FFC107;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 8px;font-size:11px;font-weight:900;color:#856404;text-transform:uppercase;letter-spacing:0.2em;">⏰ Important</p>
                                        <p style="margin:0;font-size:12px;color:#856404;line-height:1.6;">
                                            This invitation link expires in <strong>24 hours</strong>. Click the button above to complete your setup. You'll need to enable 2FA for security reasons.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- TROUBLESHOOTING -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                                <tr>
                                    <td style="font-size:11px;color:#888888;line-height:1.8;">
                                        <p style="margin:0 0 8px;"><strong style="color:#121212;">Didn't expect this email?</strong></p>
                                        <p style="margin:0;">If you believe this was sent in error, please contact the admin team. Do not share your setup link with anyone.</p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- DIVIDER -->
                    <tr>
                        <td style="padding:0 48px;">
                            <hr style="border:none;border-top:1px solid #E0E0E0;margin:32px 0;" />
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="background:#121212;border-radius:0 0 24px 24px;padding:40px 48px;text-align:center;">
                            <p style="margin:0 0 12px;font-size:11px;font-weight:900;color:white;text-transform:uppercase;letter-spacing:0.3em;">${companyName}</p>
                            <p style="margin:0 0 4px;font-size:10px;color:rgba(255,255,255,0.5);">Business Intelligence - Marketing Division</p>
                            <p style="margin:0 0 16px;font-size:10px;color:rgba(255,255,255,0.4);">Musaffah M9, Abu Dhabi | Nadd Al Hamar, Dubai</p>
                            <p style="margin:0 0 8px;font-size:10px;color:rgba(255,255,255,0.4);">📞 +971 2 555 5443 | 🌐 smartmotor.ae</p>
                            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0;" />
                            <p style="margin:0;font-size:9px;color:rgba(255,255,255,0.25);">
                                © 2026 ${companyName}. All rights reserved.<br/>
                                This is an automated invitation. Do not reply to this email.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}
