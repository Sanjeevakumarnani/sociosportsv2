import { prisma } from '../index';

export type OTPPurpose =
    | 'athlete_identity'
    | 'coach_registration'
    | 'venue_listing'
    | 'tournament_registration'
    | 'service_inquiry'
    | 'job_application'
    | 'institution_registry'
    | 'vendor_registration';

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to email/phone and store in database
 */
export const createOTP = async (
    identifier: string,
    purpose: OTPPurpose,
    type: 'email' | 'phone' = 'email'
): Promise<string> => {
    // Clean up any existing unverified OTPs for this identifier and purpose
    await prisma.otpVerification.deleteMany({
        where: {
            OR: [
                { email: type === 'email' ? identifier : undefined },
                { phone: type === 'phone' ? identifier : undefined }
            ],
            purpose,
            verified: false
        }
    });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await prisma.otpVerification.create({
        data: {
            email: type === 'email' ? identifier : null,
            phone: type === 'phone' ? identifier : null,
            otp,
            purpose,
            expiresAt
        }
    });

    return otp;
};

/**
 * Verify OTP
 */
export const verifyOTP = async (
    identifier: string,
    otp: string,
    purpose: OTPPurpose,
    type: 'email' | 'phone' = 'email'
): Promise<boolean> => {
    const record = await prisma.otpVerification.findFirst({
        where: {
            OR: [
                { email: type === 'email' ? identifier : undefined },
                { phone: type === 'phone' ? identifier : undefined }
            ],
            otp,
            purpose,
            verified: false,
            expiresAt: {
                gt: new Date() // Check if not expired
            }
        }
    });

    if (!record) {
        return false;
    }

    // Mark as verified
    await prisma.otpVerification.update({
        where: { id: record.id },
        data: { verified: true }
    });

    return true;
};

/**
 * Clean up expired OTPs (can be called periodically)
 */
export const cleanupExpiredOTPs = async (): Promise<number> => {
    const result = await prisma.otpVerification.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    });

    return result.count;
};

/**
 * Check if an OTP exists and is valid (for resend logic)
 */
export const hasValidOTP = async (email: string, purpose: OTPPurpose): Promise<boolean> => {
    const record = await prisma.otpVerification.findFirst({
        where: {
            email,
            purpose,
            verified: false,
            expiresAt: {
                gt: new Date()
            }
        }
    });

    return !!record;
};
