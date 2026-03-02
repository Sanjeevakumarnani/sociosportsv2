import axios from 'axios';

/**
 * SMS Provider Interface
 * Allows for easy switching between providers (Twilio, Msg91, etc.)
 */
interface ISMSProvider {
    sendSMS(phone: string, message: string): Promise<boolean>;
}

/**
 * Twilio Implementation
 */
class TwilioProvider implements ISMSProvider {
    async sendSMS(phone: string, message: string): Promise<boolean> {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const auth = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_PHONE_NUMBER;

        if (!sid || !auth || !from) {
            console.error('[SMS] Twilio credentials missing in .env');
            return false;
        }

        try {
            const params = new URLSearchParams();
            params.append('To', phone);
            params.append('From', from);
            params.append('Body', message);

            const basicAuth = Buffer.from(`${sid}:${auth}`).toString('base64');
            await axios.post(
                `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
                params,
                { headers: { Authorization: `Basic ${basicAuth}` } }
            );
            return true;
        } catch (error: any) {
            console.error('[SMS] Twilio error:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * Msg91 Implementation
 */
class Msg91Provider implements ISMSProvider {
    async sendSMS(phone: string, message: string): Promise<boolean> {
        const authKey = process.env.MSG91_AUTH_KEY;
        const senderId = process.env.MSG91_SENDER_ID;

        if (!authKey) {
            console.error('[SMS] Msg91 auth key missing in .env');
            return false;
        }

        try {
            await axios.post('https://api.msg91.com/api/v5/otp', {
                template_id: 'your_template_id', // Need user to add this
                mobile: phone,
                authkey: authKey,
                otp: message.split(' ')[0] // Assuming message starts with OTP
            });
            return true;
        } catch (error: any) {
            console.error('[SMS] Msg91 error:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * Console/Development Provider
 */
class ConsoleProvider implements ISMSProvider {
    async sendSMS(phone: string, message: string): Promise<boolean> {
        console.log(`\n--- SMS SIMULATOR ---`);
        console.log(`To: ${phone}`);
        console.log(`Message: ${message}`);
        console.log(`--------------------\n`);
        return true;
    }
}

class SMSService {
    private provider: ISMSProvider;

    constructor() {
        const providerName = process.env.SMS_PROVIDER || 'console';

        switch (providerName.toLowerCase()) {
            case 'twilio':
                this.provider = new TwilioProvider();
                break;
            case 'msg91':
                this.provider = new Msg91Provider();
                break;
            default:
                this.provider = new ConsoleProvider();
        }
    }

    /**
     * Send an OTP to a phone number
     */
    async sendOTP(phone: string, otp: string): Promise<boolean> {
        const message = `${otp} is your verification code for SocioSports. Valid for 5 minutes.`;
        return this.provider.sendSMS(phone, message);
    }

    /**
     * Send a general notification SMS
     */
    async sendNotification(phone: string, message: string): Promise<boolean> {
        return this.provider.sendSMS(phone, message);
    }
}

export const smsService = new SMSService();
