import { Zap, Calendar, UserCheck, Users } from 'lucide-react';

export const cardsData = [
    {
        id: 1,
        title: "VERIFIED FACILITIES",
        description: "Access to certified sports venues and training centers",
        icon: Zap, // Using Zap for "Verified/Fast" or maybe ShieldCheck would be better? User said Zap/Checkmark.
        // Let's stick to user's "Verified" theme -> UserCheck or BadgeCheck? User said "Facility building icon".
        // I will use Zap for now as placeholder or maybe a Building/MapPin. 
        // Actually, let's use Lucide icons that match best.
        // Verified -> ShieldCheck
        // Events -> Calendar
        // Coaches -> UserCheck (Expert)
        // Community -> Users
        gradient: "linear-gradient(135deg, #FF5722 0%, #FF7043 100%)",
        bgPattern: "grid",
        color: "#FF5722"
    },
    {
        id: 2,
        title: "DAILY EVENTS",
        description: "Join live sports activities and tournaments every day",
        icon: Calendar,
        gradient: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
        bgPattern: "dots",
        color: "#4CAF50"
    },
    {
        id: 3,
        title: "EXPERT COACHES",
        description: "Learn from professional trainers and sports experts",
        icon: UserCheck, // Expert
        gradient: "linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)",
        bgPattern: "stripes",
        color: "#2196F3"
    },
    {
        id: 4,
        title: "GROWING COMMUNITY",
        description: "Connect with thousands of sports enthusiasts nationwide",
        icon: Users,
        gradient: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
        bgPattern: "network",
        color: "#FFC107"
    }
];
