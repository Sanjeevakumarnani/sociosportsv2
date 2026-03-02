import nodemailer from 'nodemailer';
import path from 'path';

// Configure transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Assets Path
const ASSETS_PATH = path.join(__dirname, '../../assets/emails');

// Brand Colors
const COLORS = {
    primary: '#FF4D00', // SocioSports Orange (Vibrant)
    secondary: '#0F172A', // Dark Slate
    accent: '#3B82F6', // Modern Blue
    bg: '#F8FAFC',
    text: '#1E293B',
    white: '#FFFFFF',
    border: '#E2E8F0'
};

// Common Email Template Wrapper
const wrapEmail = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: ${COLORS.bg}; color: ${COLORS.text}; }
        .wrapper { width: 100%; table-layout: fixed; background-color: ${COLORS.bg}; padding-bottom: 40px; }
        .main { width: 100%; max-width: 600px; margin: 0 auto; background-color: ${COLORS.white}; border-radius: 24px; overflow: hidden; margin-top: 40px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
        .header { background-color: ${COLORS.secondary}; padding: 0; text-align: center; }
        .header-img { width: 100%; max-width: 600px; display: block; }
        .banner { background-color: ${COLORS.primary}; height: 4px; width: 100%; }
        .content { padding: 48px 40px; }
        .footer { background-color: #f1f5f9; padding: 40px 20px; text-align: center; color: #64748B; font-size: 13px; line-height: 1.5; }
        .footer-img { width: 100%; max-width: 400px; margin-bottom: 20px; border-radius: 12px; }
        .social-link { color: ${COLORS.secondary}; text-decoration: none; margin: 0 10px; font-weight: 600; }
        .btn { display: inline-block; padding: 16px 32px; background-color: ${COLORS.primary}; color: white !important; text-decoration: none; border-radius: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 24px 0; }
        .otp-box { background-color: #FFF7ED; border: 2px solid #FFEDD5; padding: 24px; text-align: center; font-size: 36px; font-weight: 900; letter-spacing: 8px; margin: 32px 0; color: ${COLORS.primary}; border-radius: 20px; font-family: monospace; }
        .info-card { background-color: ${COLORS.bg}; border: 1px solid ${COLORS.border}; padding: 24px; border-radius: 20px; margin: 24px 0; }
        .info-item { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid ${COLORS.border}; padding-bottom: 12px; }
        .info-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { color: #64748B; font-weight: 600; font-size: 12px; text-transform: uppercase; }
        .value { color: ${COLORS.secondary}; font-weight: 700; }
        h1 { margin: 0 0 16px; font-size: 28px; font-weight: 800; color: ${COLORS.secondary}; letter-spacing: -0.5px; }
        h2 { font-size: 20px; font-weight: 800; color: ${COLORS.secondary}; margin: 0 0 12px; }
        p { margin: 0 0 16px; font-size: 16px; line-height: 1.6; }
        .highlight { color: ${COLORS.primary}; font-weight: 700; }
        ul { padding: 0; margin: 24px 0; list-style: none; }
        li { margin-bottom: 12px; padding-left: 28px; position: relative; font-weight: 500; }
        li::before { content: '✓'; position: absolute; left: 0; color: ${COLORS.primary}; font-weight: 900; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="main">
            <div class="header">
                <img src="cid:header_image" alt="SocioSports" class="header-img">
            </div>
            <div class="banner"></div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <img src="cid:footer_image" alt="Your Sports Journey Starts Here" class="footer-img">
                <div style="margin-bottom: 24px;">
                    <a href="https://sociosports.co.in" class="social-link">Website</a>
                    <a href="#" class="social-link">Instagram</a>
                    <a href="#" class="social-link">Twitter</a>
                    <a href="#" class="social-link">LinkedIn</a>
                </div>
                <p>&copy; ${new Date().getFullYear()} SocioSports India. All rights reserved.</p>
                <p>Ground Floor, Sports Hub, Hitech City, Hyderabad, India.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

const getCommonAttachments = () => [
    {
        filename: 'header.png',
        path: path.join(ASSETS_PATH, 'header.png'),
        cid: 'header_image'
    },
    {
        filename: 'footer.png',
        path: path.join(ASSETS_PATH, 'footer.png'),
        cid: 'footer_image'
    }
];

export const sendEmail = async (to: string, subject: string, html: string, extraAttachments: any[] = []) => {
    try {
        const info = await transporter.sendMail({
            from: '"SocioSports" <no-reply@sociosports.co.in>',
            to,
            subject,
            html,
            attachments: [...getCommonAttachments(), ...extraAttachments]
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        if (process.env.NODE_ENV === 'development') {
            console.warn("⚠️ Email failed to send, but proceeding anyway because NODE_ENV is development.");
            return null;
        }
        throw error; // Re-throw in production
    }
};

export const sendOTP = async (email: string, otp: string, purpose: string) => {
    const purposeTextMap: { [key: string]: string } = {
        'athlete_identity': 'verify your Athlete Identity',
        'coach_registration': 'confirm your Coach Registration',
        'venue_listing': 'verify your Venue Listing',
        'tournament_registration': 'confirm your Tournament Registration',
        'service_inquiry': 'verify your Service Inquiry',
        'job_application': 'verify your Job Application',
        'institution_registry': 'verify your Institutional Registry Request',
        'vendor_registration': 'verify your Vendor Stall Registration'
    };

    const actionText = purposeTextMap[purpose] || 'verify your account';

    const content = `
        <h1>Verify Your Identity</h1>
        <p>Hello,</p>
        <p>To <span class="highlight">${actionText}</span> on SocioSports, please use the secure verification code below.</p>
        
        <div class="otp-box">${otp}</div>
        
        <p>This code is valid for <strong>5 minutes</strong>. For security reasons, please do not share this code with anyone.</p>
        <p>If you didn't request this code, you can safely disregard this message.</p>
        
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid ${COLORS.border};">
            <p style="font-size: 14px; color: #64748B;">Welcome to the next generation of sports networking. <br>Secure. Fast. Professional.</p>
        </div>
    `;

    await sendEmail(email, `${otp} is your verification code`, wrapEmail(content, 'SECURE VERIFICATION'));
};

export const sendWelcomeEmail = async (userEmail: string, name: string) => {
    const welcomeBannerCid = 'welcome_banner';
    const content = `
        <img src="cid:${welcomeBannerCid}" alt="Welcome Aboard" style="width:100%; border-radius:16px; margin-bottom:32px;">
        <h1>Welcome to the Arena, ${name}! 🏆</h1>
        <p>We're absolutely stoked to have you join our elite community. Your Athlete Identity is now officially verified and live.</p>
        
        <div class="info-card">
            <h2>Your Journey Starts Here</h2>
            <ul>
                <li><strong>Compete:</strong> Join sanctioned tournaments across India.</li>
                <li><strong>Train:</strong> Connect with high-performance coaches.</li>
                <li><strong>Analyze:</strong> Build your digital stats and sports resume.</li>
                <li><strong>Network:</strong> Engage with scouts and professional organizations.</li>
            </ul>
        </div>
        
        <center>
            <a href="https://sociosports.co.in/athlete-identity" class="btn">View Your Profile</a>
        </center>
        
        <div style="margin-top: 40px; text-align: center; background: #f8fafc; padding: 30px; border-radius: 20px;">
            <p style="font-weight: 800; color: ${COLORS.secondary}; margin-bottom: 8px;">GET THE GATEWAY APP</p>
            <p style="font-size: 14px; color: #64748B; margin-bottom: 24px;">Track stats, get real-time tournament alerts and scouting updates.</p>
            <div style="margin-top: 20px;">
                <span style="display: inline-block; background: #000; color: white; padding: 12px 24px; border-radius: 10px; font-weight: bold; margin: 5px; font-size: 14px;">App Store</span>
                <span style="display: inline-block; background: #000; color: white; padding: 12px 24px; border-radius: 10px; font-weight: bold; margin: 5px; font-size: 14px;">Google Play</span>
            </div>
        </div>
    `;

    const welcomeAttachment = [
        {
            filename: 'welcome.png',
            path: path.join(ASSETS_PATH, 'welcome.png'),
            cid: welcomeBannerCid
        }
    ];

    await sendEmail(userEmail, 'Welcome to SocioSports - Your Identity is Ready', wrapEmail(content, 'WELCOME ABOARD'), welcomeAttachment);
};

export const sendBookingConfirmation = async (userEmail: string, bookingDetails: any) => {
    const content = `
        <h1>Booking Confirmed! ✅</h1>
        <p>Great news! Your spot for <span class="highlight">${bookingDetails.eventTitle}</span> has been successfully reserved.</p>
        
        <div class="info-card">
            <div class="info-item">
                <span class="label">Event</span>
                <span class="value">${bookingDetails.eventTitle}</span>
            </div>
            <div class="info-item">
                <span class="label">Date & Time</span>
                <span class="value">${bookingDetails.date}</span>
            </div>
            <div class="info-item">
                <span class="label">Venue</span>
                <span class="value">${bookingDetails.location}</span>
            </div>
            <div class="info-item">
                <span class="label">Booking ID</span>
                <span class="value">#${bookingDetails.id?.substring(0, 8).toUpperCase() || 'REF-N/A'}</span>
            </div>
        </div>
        
        <p><strong>Next Steps:</strong> Please arrive at the venue at least 30 minutes prior to the start time. Keep your Booking ID handy for entry. Our organizers look forward to seeing you!</p>
        
        <center>
            <a href="https://sociosports.co.in/dashboard/bookings" class="btn">Manage Booking</a>
        </center>
    `;
    await sendEmail(userEmail, `Confirmed: ${bookingDetails.eventTitle}`, wrapEmail(content, 'BOOKING SUCCESS'));
};

export const sendSportsIdConfirmation = async (email: string, name: string, sportsId: string, role: string) => {
    const content = `
        <h1>Official National Sports Identity ✅</h1>
        <p>Hello ${name},</p>
        <p>Congratulations! Your registration is successful. You have been assigned an Official National Sports ID.</p>
        
        <div class="info-card">
            <div class="info-item">
                <span class="label">Member Name</span>
                <span class="value">${name}</span>
            </div>
            <div class="info-item">
                <span class="label">Sports ID</span>
                <span class="value" style="color: ${COLORS.primary}; font-size: 24px;">${sportsId}</span>
            </div>
            <div class="info-item">
                <span class="label">Identity Role</span>
                <span class="value">${role}</span>
            </div>
        </div>
        
        <center>
            <div style="margin: 32px 0; padding: 24px; background-color: #f8fafc; border-radius: 20px; border: 1px dashed ${COLORS.border};">
                <p style="font-weight: 800; color: ${COLORS.secondary}; margin-bottom: 8px; text-transform: uppercase; font-size: 14px;">Complete Your Profile</p>
                <p style="font-size: 14px; color: #64748B; margin-bottom: 20px;">Download our mobile app to complete your profile, track stats, and get real-time scouting updates.</p>
                <a href="https://play.google.com/store/apps/details?id=com.sociobeats&pcampaignid=web_share" style="display: inline-block; background: #000; color: white !important; padding: 14px 28px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 16px;">Download for Android</a>
            </div>
            
            <a href="https://sociosports.co.in/login" class="btn">Login to Platform</a>
        </center>
    `;
    await sendEmail(email, `Your Official National Sports ID: ${sportsId}`, wrapEmail(content, 'IDENTITY CONFIRMED'));
};

// ============================================
// EMPLOYER VERIFICATION EMAILS
// ============================================

export const sendVerificationSubmittedEmail = async (
    email: string,
    name: string,
    token: string
) => {
    const content = `
        <h1>Verification Submitted!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for submitting your employer verification request. Our team will review your documents within 2-3 business days.</p>
        
        <div class="info-card">
            <div class="info-item">
                <span class="label">Tracking Token</span>
                <span class="value" style="font-family: monospace; font-size: 18px;">${token}</span>
            </div>
            <div class="info-item">
                <span class="label">Status</span>
                <span class="value" style="color: #F59E0B;">⏳ PENDING</span>
            </div>
        </div>
        
        <p>You can track your verification status anytime using your tracking token on the Jobs page.</p>
        <center>
            <a href="https://sociosports.co.in/jobs" class="btn">Track Status</a>
        </center>
        
        <p style="font-size: 14px; color: #64748B; margin-top: 24px;">Keep your tracking token safe: <strong style="font-family: monospace;">${token}</strong></p>
    `;
    await sendEmail(email, 'Verification Request Submitted - SocioSports', wrapEmail(content, 'VERIFICATION PENDING'));
};

export const sendVerificationApprovedEmail = async (
    email: string,
    name: string
) => {
    const content = `
        <h1>🎉 You're Verified!</h1>
        <p>Congratulations ${name},</p>
        <p>Your employer verification has been <span class="highlight">approved</span>. You can now post jobs and hire athletes and coaches on SocioSports.</p>
        
        <div class="info-card" style="background-color: #ECFDF5; border-color: #A7F3D0;">
            <h2 style="color: #059669; margin: 0;">✓ Verification Complete</h2>
            <p style="margin: 12px 0 0; color: #047857;">Your organization is now verified and trusted on our platform.</p>
        </div>
        
        <center>
            <a href="https://sociosports.co.in/jobs" class="btn">Post Your First Job</a>
        </center>
        
        <p style="margin-top: 24px;">Start finding the perfect sports talent for your organization today!</p>
        
        <div style="margin-top: 32px; padding: 24px; background: #f8fafc; border-radius: 16px;">
            <h3 style="margin: 0 0 12px; color: ${COLORS.secondary};">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Post job listings for athletes and coaches</li>
                <li style="margin-bottom: 8px;">Receive applications from verified sports professionals</li>
                <li style="margin-bottom: 8px;">Build your sports organization team</li>
            </ul>
        </div>
    `;
    await sendEmail(email, '✅ Employer Verification Approved - SocioSports', wrapEmail(content, 'VERIFIED EMPLOYER'));
};

export const sendVerificationRejectedEmail = async (
    email: string,
    name: string,
    reason: string
) => {
    const content = `
        <h1>Verification Update</h1>
        <p>Hi ${name},</p>
        <p>Unfortunately, your employer verification request could not be approved at this time.</p>
        
        <div class="info-card" style="background-color: #FEF2F2; border-color: #FECACA;">
            <h2 style="color: #DC2626; margin: 0;">✗ Verification Declined</h2>
            <p style="margin: 12px 0 0; color: #B91C1C;"><strong>Reason:</strong> ${reason}</p>
        </div>
        
        <p style="margin-top: 24px;">You can address the issues mentioned above and resubmit your verification request.</p>
        
        <center>
            <a href="https://sociosports.co.in/jobs" class="btn">Resubmit Verification</a>
        </center>
        
        <p style="font-size: 14px; color: #64748B; margin-top: 24px;">If you believe this is an error, please contact our support team at support@sociosports.co.in</p>
    `;
    await sendEmail(email, 'Verification Update - SocioSports', wrapEmail(content, 'ACTION REQUIRED'));
};
