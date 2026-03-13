import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    role: 'bot' | 'user';
    text: string;
    timestamp: Date;
    chips?: string[];
    isTyping?: boolean;
}

interface FlowStep {
    key: string;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'tel' | 'select';
    options?: string[];
}

interface ActiveFlow {
    name: string;
    steps: FlowStep[];
    currentStep: number;
    data: Record<string, string>;
}

// ─── Platform Knowledge Base ──────────────────────────────────────────────────
const PLATFORM_KNOWLEDGE: Record<string, { response: string; chips?: string[] }> = {
    greeting: {
        response: `Hi 👋 I'm **SocioMate**, your Sports Growth Partner on the SocioSports platform!\n\nI can help you with everything — from creating your SocioSports ID to booking events, applying for jobs, hosting tournaments, and much more.\n\nWhat would you like to do today?`,
        chips: [
            'Create SocioSports ID',
            'Book an Event',
            'What is Sports on Wheels?',
            'Post a Job',
            'Apply for a Job',
            'Host a Tournament',
            'Complete Profile',
            'Track Verification Status',
            'Membership Plans',
            'Talk to Support',
        ],
    },
    'create sociосports id': {
        response: `🆔 **Creating Your SocioSports ID**\n\nYour SocioSports ID is your unique digital sports identity. Here's how to create it:\n\n**Step 1 — Register:**\n• Enter your mobile number\n• Verify via OTP\n\n**Step 2 — Choose Your Identity:**\n• 🏃 Athlete\n• 🧑‍🏫 Coach / Trainer\n• 🏟️ Organizer\n• 🧑 General Citizen / Enthusiast\n\n**Step 3 — Fill Basic Details:**\n• Full Name, DOB, Gender\n• City, State, Sports Interest\n\n**Step 4 — Upload Profile Photo**\n\n**Step 5 — Get Your ID!**\n• Unique SocioSports ID generated\n• Digital ID Card issued\n• QR Code for instant sharing\n\nWould you like me to start the registration process now?`,
        chips: ['Start Registration Now', 'View Sample ID Card', 'What is QR Code Feature?', 'Back to Menu'],
    },
    'book an event': {
        response: `📅 **Booking an Event on SocioSports**\n\nHere's a step-by-step guide to book any sports event:\n\n**Step 1:** Browse events by:\n• 🏙️ City / Location\n• 🏅 Sport Type\n• 📆 Date Range\n• 💰 Price Range\n\n**Step 2:** Select your preferred event\n\n**Step 3:** Choose slots / seats\n\n**Step 4:** Enter participant details\n\n**Step 5:** Make payment\n• Razorpay / UPI / Card\n• Instant confirmation\n• Token ID issued for tracking\n\n**Step 6:** Receive ticket via email & SMS\n\n💡 *Tip: Save your Token ID to track booking status anytime!*\n\nWant me to show you upcoming events?`,
        chips: ['Show Upcoming Events', 'Track My Booking', 'Event Cancellation Policy', 'Back to Menu'],
    },
    'what is sports on wheels?': {
        response: `🚐 **Sports on Wheels — SocioSports' Mobile Sports Service**\n\n*"We bring the sports to you!"*\n\n**What is it?**\nSports on Wheels is our flagship doorstep sports delivery service. We bring professional sports equipment, trainers, and activities directly to:\n• 🏫 Schools\n• 🏢 Corporate offices\n• 🏘️ Residential Societies\n• 🏕️ Open grounds / Parks\n\n**Activities We Offer:**\n• ⚽ Football\n• 🏏 Cricket\n• 🏸 Badminton\n• 🥊 Boxing\n• 🧘 Yoga & Fitness\n• 🎾 Tennis\n• 🏊 Swimming (portable pools)\n\n**How to Book:**\n1. Select your location\n2. Choose activity + duration\n3. Pick a date/time slot\n4. Confirm & pay\n5. Our team arrives at your door!\n\n**Starting at just ₹999 per session**\n\nWant to book a Sports on Wheels session?`,
        chips: ['Book Sports on Wheels', 'See All Activities', 'Corporate Packages', 'Back to Menu'],
    },
    'post a job': {
        response: `💼 **Posting a Job on SocioSports**\n\nConnect with India's top sports talent! Here's how:\n\n**Requirements before posting:**\n✅ Verified Employer Account\n✅ Company/Organization Details\n✅ Valid GST/Registration Number\n\n**Step 1 — Complete Employer Verification:**\n• Upload company documents\n• Admin reviews within 24–48 hours\n\n**Step 2 — Create Job Listing:**\n• Job Title, Role, Department\n• Location (On-site / Remote)\n• Salary Range\n• Required Qualifications\n• Sports-specific skills\n• Application Deadline\n\n**Step 3 — Publish**\n• Job goes live immediately\n• Visible to all 50,000+ sports professionals\n\n**Step 4 — Manage Applications**\n• Review applicant profiles\n• Download resumes\n• Schedule interviews\n\n💡 Verified employers get priority listing & badge!\n\nAre you already a verified employer?`,
        chips: ['Start Verification', 'View Job Templates', 'Pricing for Job Posts', 'Back to Menu'],
    },
    'apply for a job': {
        response: `🏆 **Applying for Jobs on SocioSports**\n\nFind your dream sports career here!\n\n**Step 1 — Complete Your Profile:**\n• Upload Resume/CV\n• Add sports certifications\n• Include achievements & stats\n\n**Step 2 — Browse Jobs:**\n• Filter by sport, role, location, salary\n• Categories: Coaching, Management, Sports Science, Fitness, Media\n\n**Step 3 — Apply:**\n• One-click apply with your SocioSports profile\n• Add a cover letter (optional)\n• Submit documents if required\n\n**Step 4 — Track Application:**\n• View status: Applied → Under Review → Shortlisted → Interview → Offered\n• Get notifications at each stage\n\n**Step 5 — Interview & Join!**\n\n📌 *Need help with your sports profile? I can guide you through profile completion!*\n\nWant to browse current openings?`,
        chips: ['Browse Job Openings', 'Complete My Profile', 'Upload Resume', 'Back to Menu'],
    },
    'host a tournament': {
        response: `🏆 **Host a Tournament on SocioSports**\n\nOrganize professional sports tournaments with ease!\n\n**Who Can Host?**\n• Verified Organizers\n• Sports Academies\n• Schools & Colleges\n• Corporate Entities\n\n**Step 1 — Organizer Verification:**\n• Submit organization documents\n• Pay organizer fee\n• Get verified badge\n\n**Step 2 — Create Tournament:**\n• Tournament Name, Sport, Format\n• Date, Venue, City\n• Entry Fee, Prize Pool\n• Age Categories, Team Size\n• Registration Deadline\n\n**Step 3 — Publish & Promote:**\n• Listed on SocioSports Events\n• Shared across community\n• Social media promotion\n\n**Step 4 — Manage Registrations:**\n• Approve/reject participants\n• Generate brackets automatically\n• Collect payments\n\n**Step 5 — Run Tournament:**\n• Live score updates\n• Certificate generation\n• Winners announced on platform\n\nReady to host your first tournament?`,
        chips: ['Start Organizer Verification', 'Tournament Pricing', 'View Sample Tournament', 'Back to Menu'],
    },
    'complete profile': {
        response: `✏️ **Completing Your SocioSports Profile**\n\nA complete profile gets you 5× more opportunities!\n\n**Profile Sections:**\n\n**🔹 Basic Info** (Required)\n• Name, DOB, Gender, City\n• Contact: Email, Mobile\n• Profile Photo\n\n**🔹 Sports Identity**\n• Primary Sport(s)\n• Position/Specialty\n• Experience Level\n• Achievements & Records\n\n**🔹 Education & Certifications**\n• Sports qualifications\n• Coaching certifications (NIS, NSCA, etc.)\n• Academic background\n\n**🔹 Documents** (for Verification)\n• Government ID (Aadhaar/Passport)\n• Sports certificates\n• Achievement letters\n\n**🔹 Social Links**\n• Instagram, LinkedIn, YouTube\n\n**Profile Completion Score:**\n• 0–40% — Basic\n• 41–70% — Intermediate  \n• 71–100% — ⭐ Verified Pro\n\nWant me to guide you through each section?`,
        chips: ['Update Basic Info', 'Add Certifications', 'Upload Documents', 'Back to Menu'],
    },
    'track verification status': {
        response: `🔍 **Tracking Your Verification Status**\n\nUse your **Token ID** to track the status of:\n• Document Verification\n• Event Booking\n• Job Application\n• Tournament Registration\n• Sports on Wheels Booking\n\n**How to Track:**\n1. Find your Token ID in:\n   • Confirmation email/SMS\n   • Your profile dashboard\n   • Chat with SocioMate\n\n2. Enter Token ID below\n\n3. Get real-time status:\n   • ⏳ **Pending** — Under review\n   • 🔄 **In Progress** — Being processed\n   • ✅ **Approved** — Verified!\n   • ❌ **Rejected** — See reason\n   • 🔁 **Resubmit** — Corrections needed\n\n**Verification Timelines:**\n• Athlete Profile: 24–48 hours\n• Coach/Trainer: 48–72 hours\n• Employer: 24–48 hours\n• Event Booking: Instant\n\nDo you have a Token ID to track?`,
        chips: ['Enter Token ID', 'Resubmit Documents', 'Contact Verification Team', 'Back to Menu'],
    },
    'membership plans': {
        response: `💎 **SocioSports Membership Plans**\n\nChoose the plan that fits your sports journey:\n\n**🆓 Free — Starter**\n• SocioSports ID\n• Basic profile\n• Browse events & jobs\n• Community access\n\n**⚡ Silver — ₹299/month**\n• Everything in Free\n• Priority event booking\n• Resume visibility boost\n• 2 job applications/month\n• Basic analytics\n\n**🥇 Gold — ₹599/month**\n• Everything in Silver\n• Verified Pro badge\n• Unlimited job applications\n• Tournament priority registration\n• Sports on Wheels discount (10%)\n• Advanced profile analytics\n• Direct messaging with coaches\n\n**🏆 Platinum — ₹999/month**\n• Everything in Gold\n• Featured athlete/coach listing\n• 1:1 career consultation\n• Exclusive events access\n• Sports on Wheels discount (20%)\n• AI-powered performance tracking\n• Priority support\n\n*All plans include GST. Cancel anytime.*\n\nWhich plan interests you?`,
        chips: ['Subscribe to Silver', 'Subscribe to Gold', 'Subscribe to Platinum', 'Compare Plans', 'Back to Menu'],
    },
    'talk to support': {
        response: `🤝 **SocioSports Support Center**\n\nWe're here to help! Choose how you'd like to connect:\n\n**💬 Live Chat** (Available now)\n• Response time: < 2 minutes\n• Available: 9 AM – 9 PM IST\n\n**📧 Email Support**\n• support@sociosports.in\n• Response within 24 hours\n\n**📞 Phone Support**\n• +91-XXXX-XXXXX\n• Mon–Sat: 10 AM – 6 PM IST\n\n**📋 Raise a Ticket**\n• Track your support request\n• Get Token ID for follow-up\n\n**Common Issues I Can Solve:**\n• Password reset\n• Booking cancellation\n• Verification status check\n• Payment issues\n• Profile update help\n\nWould you like me to connect you to a human agent?`,
        chips: ['Connect to Human Agent', 'Raise a Support Ticket', 'FAQ', 'Back to Menu'],
    },
    'start registration now': {
        response: `🚀 **Let's create your SocioSports ID!**\n\nI'll guide you through the process step by step.\n\nFirst, tell me — what type of sports identity best describes you?`,
        chips: ['🏃 I\'m an Athlete', '🧑‍🏫 I\'m a Coach/Trainer', '🏟️ I\'m an Organizer', '🧑 Sports Enthusiast'],
    },
    'i\'m an athlete': {
        response: `🏃 **Athlete Registration**\n\nExcellent! Let's set you up as a verified athlete on SocioSports.\n\n**Here's what you'll need:**\n✅ Mobile Number (for OTP)\n✅ Valid Government ID (Aadhaar/Passport)\n✅ Sports Achievement Certificate (optional)\n✅ Profile Photo\n\n**Your athlete profile will include:**\n• Unique Athlete ID (e.g., SS-ATH-2026-XXXXX)\n• Digital Sports Passport\n• QR Code for tournaments\n• Performance stats tracking\n• Talent visibility to 500+ coaches\n\nShall I begin collecting your details now?`,
        chips: ['Yes, Let\'s Start!', 'What Documents Are Needed?', 'Back to Menu'],
    },
    'i\'m a coach/trainer': {
        response: `🧑‍🏫 **Coach / Trainer Registration**\n\nWelcome, Coach! SocioSports connects you with thousands of athletes.\n\n**Verification Requirements:**\n✅ Coaching Certification (NIS / NSCA / ACSM etc.)\n✅ Experience proof (letters/certificates)\n✅ Government ID\n✅ Profile Photo\n\n**Benefits of being a Verified Coach:**\n• 🎯 Listed in Coach Directory\n• 📞 Athletes can contact you directly\n• 🏆 Host coaching sessions\n• 💰 Get paid through the platform\n• ⭐ Verified Coach badge\n\nLet's start your coach profile!`,
        chips: ['Start Coach Profile', 'Upload Certifications', 'Coaching Plans & Pricing', 'Back to Menu'],
    },
    'i\'m an organizer': {
        response: `🏟️ **Organizer / Event Host Registration**\n\nReady to host epic sports events? Let's get you verified!\n\n**Organization Types:**\n• Sports Federation / Association\n• School / College\n• Corporate / Private Organization\n• Municipal / Government Body\n\n**Documents Required:**\n✅ Organization Registration Certificate\n✅ GST Number (if applicable)\n✅ PAN Card\n✅ Authorized Person ID\n✅ Bank Account Details\n\n**After Verification, You Can:**\n• Host unlimited tournaments\n• Sell tickets online\n• Manage registrations\n• Live-stream events\n• Generate revenue\n\nShall I start the organizer verification process?`,
        chips: ['Start Organizer Verification', 'Organizer Pricing', 'Back to Menu'],
    },
    'sports enthusiast': {
        response: `🧑 **General Citizen / Sports Enthusiast**\n\nWelcome to SocioSports! No professional background needed.\n\n**As a Sports Enthusiast, you can:**\n• 🎟️ Book event tickets\n• 🏆 Participate in open tournaments\n• 🚐 Book Sports on Wheels for your area\n• 📰 Read sports news & blogs\n• 💬 Join sports communities\n• 🏅 Track your personal fitness\n• 🤝 Connect with athletes & coaches\n\n**Quick Registration (2 minutes!):**\n1. Mobile OTP verification\n2. Basic details (Name, City, Sport interest)\n3. Profile photo\n4. Done! ✅\n\nLet's create your free account!`,
        chips: ['Create Free Account', 'Browse Events Near Me', 'Join a Community', 'Back to Menu'],
    },
    'track my booking': {
        response: `🔎 **Track Your Booking**\n\nPlease share your **Token ID** and I'll look it up for you!\n\nYour Token ID looks like: **SS-TKN-2026-XXXXX**\n\nYou can find it in:\n• 📧 Your booking confirmation email\n• 📱 SMS from SocioSports\n• 🖥️ Your profile > My Bookings\n\n*Type your Token ID below:*`,
        chips: ['I don\'t have a Token ID', 'Contact Support', 'Back to Menu'],
    },
    'faq': {
        response: `❓ **Frequently Asked Questions**\n\n**Q: Is SocioSports free to join?**\nA: Yes! Basic membership is completely free.\n\n**Q: How long does verification take?**\nA: Athlete: 24–48 hrs | Coach: 48–72 hrs | Organizer: 2–5 days\n\n**Q: Can I cancel an event booking?**\nA: Yes, within 48 hours of booking for a full refund.\n\n**Q: Is my data safe?**\nA: Yes, we use bank-grade encryption and are GDPR compliant.\n\n**Q: How do I get the Verified badge?**\nA: Upload required documents and complete your profile 100%.\n\n**Q: Can I use SocioSports on mobile?**\nA: Yes! Our app is available on iOS & Android.\n\n**Q: How does Sports on Wheels work?**\nA: We deliver sports activities to your doorstep — schools, offices, societies.\n\nNeed more help?`,
        chips: ['Contact Support', 'Create SocioSports ID', 'Back to Menu'],
    },
    'back to menu': {
        response: `🏠 **Back to Main Menu**\n\nWhat would you like to do next?`,
        chips: [
            'Create SocioSports ID',
            'Book an Event',
            'What is Sports on Wheels?',
            'Post a Job',
            'Apply for a Job',
            'Host a Tournament',
            'Complete Profile',
            'Track Verification Status',
            'Membership Plans',
            'Talk to Support',
        ],
    },
};

// ─── Registration Flow ────────────────────────────────────────────────────────
const REGISTRATION_FLOW: FlowStep[] = [
    { key: 'mobile', label: 'Mobile Number', placeholder: 'Enter 10-digit mobile number', type: 'tel' },
    { key: 'otp', label: 'OTP Verification', placeholder: 'Enter 6-digit OTP', type: 'text' },
    { key: 'name', label: 'Full Name', placeholder: 'Enter your full name', type: 'text' },
    { key: 'city', label: 'City', placeholder: 'Enter your city', type: 'text' },
    { key: 'sport', label: 'Primary Sport', placeholder: 'e.g., Cricket, Football, Tennis', type: 'text' },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
const makeId = () => Math.random().toString(36).slice(2, 10);

const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

function formatMarkdown(text: string) {
    return text
        .split('\n')
        .map((line) => {
            line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
            if (line.startsWith('• ') || line.startsWith('✅ ') || line.startsWith('🔹 ')) {
                return `<div class="sm-bullet">${line}</div>`;
            }
            if (/^\d+\./.test(line)) {
                return `<div class="sm-numbered">${line}</div>`;
            }
            return `<span>${line}</span>`;
        })
        .join('<br/>');
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SocioMateBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showFloatingLauncher, setShowFloatingLauncher] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeFlow, setActiveFlow] = useState<ActiveFlow | null>(null);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    }, []);

    const addBotMessage = useCallback(
        (text: string, chips?: string[], delay = 800) => {
            // Show typing indicator
            const typingId = makeId();
            setIsTyping(true);
            setMessages((prev) => [
                ...prev,
                { id: typingId, role: 'bot', text: '', timestamp: new Date(), isTyping: true },
            ]);
            scrollToBottom();

            setTimeout(() => {
                setIsTyping(false);
                setMessages((prev) =>
                    prev
                        .filter((m) => m.id !== typingId)
                        .concat({ id: makeId(), role: 'bot', text, timestamp: new Date(), chips })
                );
                scrollToBottom();
            }, delay);
        },
        [scrollToBottom]
    );

    // Open/close panel
    const togglePanel = () => {
        if (!isOpen) {
            setIsOpen(true);
            setIsAnimatingIn(true);
            setTimeout(() => setIsAnimatingIn(false), 400);
            if (!hasGreeted) {
                setHasGreeted(true);
                setTimeout(() => {
                    addBotMessage(
                        PLATFORM_KNOWLEDGE['greeting'].response,
                        PLATFORM_KNOWLEDGE['greeting'].chips,
                        600
                    );
                }, 300);
            }
        } else {
            setIsOpen(false);
        }
    };

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 500);
        }
    }, [isOpen]);

    // After initial 5s, hide big floating button and show slim docked bar instead
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFloatingLauncher(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleChipClick = (chip: string) => {
        handleQuery(chip);
    };

    const handleSend = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        setInputValue('');
        handleQuery(trimmed);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    const handleQuery = (query: string) => {
        // Add user message
        setMessages((prev) => [
            ...prev,
            { id: makeId(), role: 'user', text: query, timestamp: new Date() },
        ]);
        scrollToBottom();

        // Handle active flow
        if (activeFlow) {
            handleFlowStep(query);
            return;
        }

        // Lookup in knowledge base (normalize query)
        const normalizedQuery = query.toLowerCase().trim();
        const found = Object.keys(PLATFORM_KNOWLEDGE).find(
            (key) => normalizedQuery === key || normalizedQuery.includes(key) || key.includes(normalizedQuery)
        );

        if (found) {
            const entry = PLATFORM_KNOWLEDGE[found];
            addBotMessage(entry.response, entry.chips);
        } else if (normalizedQuery.includes('token') || normalizedQuery.startsWith('ss-')) {
            addBotMessage(
                `🔍 **Tracking Token: ${query.toUpperCase()}**\n\n⏳ Looking up your token...\n\n✅ **Status: Under Review**\nYour request is currently being processed by our verification team.\n\n📌 **Estimated Time:** 24–48 hours\n\nYou'll receive an SMS and email notification once it's updated.\n\nAnything else I can help with?`,
                ['Track Another Token', 'Contact Support', 'Back to Menu']
            );
        } else if (normalizedQuery.includes('pay') || normalizedQuery.includes('payment')) {
            addBotMessage(
                `💳 **Payment Options on SocioSports**\n\n**Accepted Methods:**\n• 📱 UPI (GPay, PhonePe, Paytm)\n• 💳 Debit / Credit Card\n• 🏦 Net Banking\n• 💵 Cash (Sports on Wheels only)\n\n**Payment Gateway:** Razorpay (256-bit encrypted)\n\n**Refund Policy:**\n• Event bookings: 48-hour cancellation for full refund\n• Membership: Pro-rated refund\n• Sports on Wheels: 24-hour cancellation\n\nNeed help with a specific payment issue?`,
                ['Report Payment Issue', 'Request Refund', 'Contact Support', 'Back to Menu']
            );
        } else if (normalizedQuery.includes('academy') || normalizedQuery.includes('enroll')) {
            addBotMessage(
                `🏫 **Academy Enrollment on SocioSports**\n\nJoin top sports academies near you!\n\n**How to Enroll:**\n1. Browse academies by sport & city\n2. View curriculum, fees, coaches\n3. Book a trial session\n4. Pay enrollment fee\n5. Get confirmed!\n\n**Sports Available:**\nCricket 🏏 | Football ⚽ | Tennis 🎾 | Athletics 🏃 | Swimming 🏊 | Badminton 🏸 | Kabaddi | Wrestling\n\n**Benefits:**\n• Certified coaching\n• Progress tracking\n• Tournament eligibility\n• Certificate on completion`,
                ['Find Academies Near Me', 'Filter by Sport', 'Back to Menu']
            );
        } else if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi') || normalizedQuery === 'hey') {
            addBotMessage(
                `Hey there! 👋 Great to see you!\n\nI'm **SocioMate** — your Sports Growth Partner. I'm here to help you with everything on the SocioSports platform.\n\nWhat can I help you with today?`,
                PLATFORM_KNOWLEDGE['greeting'].chips
            );
        } else {
            addBotMessage(
                `🤔 I didn't quite catch that, but I'm here to help!\n\nHere are the most popular things I can assist with:\n\n• **Create SocioSports ID** — Your digital sports identity\n• **Book Events** — Find & book sports events near you\n• **Sports on Wheels** — Doorstep sports delivery\n• **Jobs** — Post or apply for sports jobs\n• **Tournaments** — Host or participate\n• **Membership Plans** — Premium features\n\nOr type your question and I'll do my best to answer!`,
                ['Create SocioSports ID', 'Book an Event', 'Membership Plans', 'Talk to Support']
            );
        }
    };

    const handleFlowStep = (value: string) => {
        if (!activeFlow) return;
        const step = activeFlow.steps[activeFlow.currentStep];
        const updatedData = { ...activeFlow.data, [step.key]: value };

        if (activeFlow.currentStep < activeFlow.steps.length - 1) {
            const nextStep = activeFlow.steps[activeFlow.currentStep + 1];
            setActiveFlow({ ...activeFlow, currentStep: activeFlow.currentStep + 1, data: updatedData });
            addBotMessage(`✅ Got it!\n\n**Step ${activeFlow.currentStep + 2} of ${activeFlow.steps.length}:**\n${nextStep.label}`, undefined, 500);
        } else {
            // Flow complete
            setActiveFlow(null);
            addBotMessage(
                `🎉 **All done!**\n\nHere's a summary of your submission:\n${Object.entries(updatedData)
                    .map(([k, v]) => `• **${k.charAt(0).toUpperCase() + k.slice(1)}:** ${v}`)
                    .join('\n')}\n\n✅ Your information has been submitted successfully!\nYou'll receive a confirmation SMS & email shortly with your **Token ID** for tracking.\n\nIs there anything else I can help you with?`,
                ['Back to Menu', 'Track Verification Status', 'Talk to Support']
            );
        }
    };

    const startFlow = (flowName: string, steps: FlowStep[]) => {
        setActiveFlow({ name: flowName, steps, currentStep: 0, data: {} });
        addBotMessage(
            `📝 **${flowName}**\n\nI'll guide you step by step.\n\n**Step 1 of ${steps.length}:**\n${steps[0].label}`,
            undefined,
            600
        );
    };

    // Inline: quick-start registration if chip is "Yes, Let's Start!"
    useEffect(() => {
        // Listen for specific chip triggers that need flows
    }, []);

    return (
        <>
            {/* ── Floating Button (only before auto-dock) ───────────────────────── */}
            {!isOpen && showFloatingLauncher && (
                <button
                    id="sociomatebot-open-btn"
                    onClick={togglePanel}
                    aria-label="Open SocioMate AI Assistant"
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        zIndex: 9999,
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, #00C756 0%, #0076FF 100%)',
                        boxShadow: '0 8px 32px rgba(0, 199, 86, 0.45), 0 2px 8px rgba(0,0,0,0.3)',
                        padding: 0,
                        overflow: 'hidden',
                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
                        transform: isOpen ? 'scale(0.9) rotate(10deg)' : 'scale(1)',
                        animation: !isOpen ? 'sm-bounce 3s ease-in-out infinite' : 'none',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.12)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                            '0 12px 40px rgba(0, 199, 86, 0.65), 0 4px 12px rgba(0,0,0,0.35)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = isOpen ? 'scale(0.9)' : 'scale(1)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                            '0 8px 32px rgba(0, 199, 86, 0.45), 0 2px 8px rgba(0,0,0,0.3)';
                    }}
                >
                    {isOpen ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ display: 'block', margin: 'auto' }}>
                            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <img
                            src="/SocioMate_Bot_icon.png"
                            alt="SocioMate"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            onError={(e) => {
                                // Fallback if image not found
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                (e.currentTarget.parentElement as HTMLButtonElement).innerHTML = `
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="display:block;margin:auto">
                  <circle cx="12" cy="8" r="4" fill="white"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="white" opacity="0.8"/>
                  <circle cx="17" cy="6" r="3" fill="#FFD700"/>
                  <path d="M15 6l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>`;
                            }}
                        />
                    )}
                    {/* Pulse ring */}
                    {!isOpen && (
                        <span
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: '2px solid rgba(0, 199, 86, 0.6)',
                                animation: 'sm-pulse-ring 2s ease-out infinite',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </button>
            )}

            {/* Docked tab (minimal, attached to right edge) */}
            {!showFloatingLauncher && !isOpen && (
                <button
                    type="button"
                    onClick={togglePanel}
                    aria-label="Open SocioMate chat"
                    style={{
                        position: 'fixed',
                        bottom: '32px',
                        right: 0,
                        zIndex: 9999,
                        padding: '10px 8px',
                        borderRadius: '999px 0 0 999px',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, #00C756 0%, #0076FF 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '-4px 6px 20px rgba(0,0,0,0.4)',
                        fontSize: '16px',
                    }}
                >
                    <span style={{ fontSize: '20px' }}>💬</span>
                </button>
            )}

            {/* Tooltip (only while floating button is visible) */}
            {!isOpen && showFloatingLauncher && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '96px',
                        right: '16px',
                        zIndex: 9998,
                        background: 'linear-gradient(135deg, #0B1A2E, #0F2540)',
                        color: 'white',
                        padding: '8px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        whiteSpace: 'nowrap',
                        animation: 'sm-pulse-fade 4s ease-in-out infinite',
                        pointerEvents: 'none',
                    }}
                >
                    💬 Chat with SocioMate
                </div>
            )}

            {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
            <div
                id="sociomatebot-panel"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '380px',
                    maxWidth: '100vw',
                    zIndex: 9998,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 100%)',
                    boxShadow: '-8px 0 60px rgba(0,0,0,0.6)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(110%)',
                    transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    borderLeft: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #003D1A 0%, #004C89 50%, #00A64A 100%)',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexShrink: 0,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header shimmer */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
                            animation: 'sm-shimmer 3s linear infinite',
                            pointerEvents: 'none',
                        }}
                    />
                    {/* Bot avatar */}
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '2px solid rgba(255,255,255,0.3)',
                            flexShrink: 0,
                            background: 'linear-gradient(135deg, #00C756, #0076FF)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src="/SocioMate_Bot_icon.png"
                            alt="SocioMate"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    color: '#fff',
                                    letterSpacing: '-0.3px',
                                    fontFamily: 'Montserrat, Inter, sans-serif',
                                }}
                            >
                                SocioMate
                            </span>
                            <span
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    padding: '2px 7px',
                                    borderRadius: '20px',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                AI
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                            <span
                                style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    background: '#4ADE80',
                                    display: 'inline-block',
                                    animation: 'sm-online-blink 2s ease-in-out infinite',
                                }}
                            />
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                                Online · Sports Growth Partner
                            </span>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close SocioMate"
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: 'none',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            flexShrink: 0,
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.28)')
                        }
                        onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)')
                        }
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Platform badges */}
                <div
                    style={{
                        display: 'flex',
                        gap: 6,
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        overflowX: 'auto',
                        flexShrink: 0,
                    }}
                >
                    {['🏅 Events', '💼 Jobs', '🚐 Sports on Wheels', '🏆 Tournaments', '🆔 ID'].map((badge) => (
                        <span
                            key={badge}
                            style={{
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.6)',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '3px 9px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                whiteSpace: 'nowrap',
                                fontWeight: 500,
                            }}
                        >
                            {badge}
                        </span>
                    ))}
                </div>

                {/* Active flow progress */}
                {activeFlow && (
                    <div
                        style={{
                            padding: '10px 16px',
                            background: 'rgba(0, 199, 86, 0.08)',
                            borderBottom: '1px solid rgba(0,199,86,0.15)',
                            flexShrink: 0,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: '12px', color: '#4ADE80', fontWeight: 600 }}>
                                📝 {activeFlow.name}
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                                Step {activeFlow.currentStep + 1}/{activeFlow.steps.length}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {activeFlow.steps.map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: 3,
                                        borderRadius: 4,
                                        background:
                                            i <= activeFlow.currentStep
                                                ? 'linear-gradient(90deg, #00C756, #0076FF)'
                                                : 'rgba(255,255,255,0.1)',
                                        transition: 'background 0.3s',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages area */}
                <div
                    ref={chatBodyRef}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.1) transparent',
                    }}
                >
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚽</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                                SocioMate is ready to help!
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    alignItems: 'flex-end',
                                    gap: '8px',
                                }}
                            >
                                {/* Bot avatar */}
                                {msg.role === 'bot' && (
                                    <div
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #00C756, #0076FF)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            fontSize: '14px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src="/SocioMate_Bot_icon.png"
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                (e.currentTarget.parentElement as HTMLElement).textContent = '🤖';
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Bubble */}
                                <div
                                    style={{
                                        maxWidth: '82%',
                                        padding: msg.isTyping ? '12px 16px' : '11px 14px',
                                        borderRadius:
                                            msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                                        background:
                                            msg.role === 'user'
                                                ? 'linear-gradient(135deg, #0076FF, #00C756)'
                                                : 'rgba(255,255,255,0.07)',
                                        border:
                                            msg.role === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                                        color: 'white',
                                        fontSize: '13.5px',
                                        lineHeight: '1.6',
                                        wordBreak: 'break-word',
                                        animation: 'sm-pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        boxShadow:
                                            msg.role === 'user'
                                                ? '0 4px 16px rgba(0,118,255,0.3)'
                                                : '0 2px 8px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    {msg.isTyping ? (
                                        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                                            {[0, 1, 2].map((i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        width: 7,
                                                        height: 7,
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #00C756, #0076FF)',
                                                        display: 'inline-block',
                                                        animation: `sm-typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}
                                            className="sm-message-content"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Timestamp */}
                            {!msg.isTyping && (
                                <div
                                    style={{
                                        textAlign: msg.role === 'user' ? 'right' : 'left',
                                        paddingLeft: msg.role === 'bot' ? '36px' : 0,
                                        paddingRight: msg.role === 'user' ? '4px' : 0,
                                    }}
                                >
                                    <span
                                        style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
                                    >
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </div>
                            )}

                            {/* Quick reply chips */}
                            {msg.role === 'bot' && !msg.isTyping && msg.chips && msg.chips.length > 0 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '6px',
                                        paddingLeft: '36px',
                                        marginTop: '4px',
                                    }}
                                >
                                    {msg.chips.map((chip) => (
                                        <button
                                            key={chip}
                                            onClick={() => handleChipClick(chip)}
                                            style={{
                                                background: 'rgba(0,199,86,0.1)',
                                                border: '1px solid rgba(0,199,86,0.35)',
                                                color: '#4ADE80',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                padding: '5px 12px',
                                                borderRadius: '20px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                fontFamily: 'Inter, sans-serif',
                                                whiteSpace: 'nowrap',
                                            }}
                                            onMouseEnter={(e) => {
                                                const el = e.currentTarget as HTMLButtonElement;
                                                el.style.background = 'rgba(0,199,86,0.25)';
                                                el.style.transform = 'translateY(-1px)';
                                                el.style.boxShadow = '0 4px 12px rgba(0,199,86,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                const el = e.currentTarget as HTMLButtonElement;
                                                el.style.background = 'rgba(0,199,86,0.1)';
                                                el.style.transform = 'translateY(0)';
                                                el.style.boxShadow = 'none';
                                            }}
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div
                    style={{
                        padding: '12px 16px 16px',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        background: 'rgba(0,0,0,0.2)',
                        flexShrink: 0,
                    }}
                >
                    {activeFlow && (
                        <div style={{ marginBottom: '8px' }}>
                            <span
                                style={{
                                    fontSize: '12px',
                                    color: 'rgba(255,255,255,0.5)',
                                    fontStyle: 'italic',
                                }}
                            >
                                → {activeFlow.steps[activeFlow.currentStep].label}
                            </span>
                        </div>
                    )}
                    <div
                        style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: '24px',
                            padding: '6px 6px 6px 16px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={() => { }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                activeFlow
                                    ? activeFlow.steps[activeFlow.currentStep].placeholder || 'Type your answer...'
                                    : 'Ask anything about SocioSports...'
                            }
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'white',
                                fontSize: '13.5px',
                                fontFamily: 'Inter, sans-serif',
                                lineHeight: 1.5,
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isTyping}
                            aria-label="Send message"
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: '50%',
                                border: 'none',
                                background:
                                    inputValue.trim() && !isTyping
                                        ? 'linear-gradient(135deg, #00C756, #0076FF)'
                                        : 'rgba(255,255,255,0.1)',
                                cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.2s',
                                transform:
                                    inputValue.trim() && !isTyping ? 'scale(1)' : 'scale(0.9)',
                                boxShadow:
                                    inputValue.trim() && !isTyping
                                        ? '0 4px 12px rgba(0,199,86,0.4)'
                                        : 'none',
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                        </button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                            Powered by SocioSports AI · Your data is secure 🔒
                        </span>
                    </div>
                </div>
            </div>

            {/* Backdrop (mobile) */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 9997,
                        backdropFilter: 'blur(2px)',
                        display: 'none',
                    }}
                    className="sm-backdrop"
                />
            )}

            {/* ── Global Styles ────────────────────────────────────────────────────── */}
            <style>{`
        @keyframes sm-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.03); }
        }
        @keyframes sm-pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes sm-pulse-fade {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0.5; }
        }
        @keyframes sm-typing-dot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes sm-pop-in {
          0% { transform: scale(0.85) translateY(6px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes sm-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes sm-online-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .sm-message-content strong { font-weight: 700; color: #fff; }
        .sm-message-content em { font-style: italic; color: rgba(255,255,255,0.85); }
        .sm-bullet { padding-left: 0; }
        .sm-numbered { padding-left: 0; }
        #sociomatebot-panel ::-webkit-scrollbar { width: 4px; }
        #sociomatebot-panel ::-webkit-scrollbar-track { background: transparent; }
        #sociomatebot-panel ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        #sociomatebot-panel ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
        #sociomatebot-panel input::placeholder { color: rgba(255,255,255,0.35) !important; }

        @media (max-width: 480px) {
          #sociomatebot-panel {
            width: 100vw !important;
            border-left: none !important;
          }
          .sm-backdrop {
            display: block !important;
          }
          #sociomatebot-open-btn {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
        </>
    );
}
