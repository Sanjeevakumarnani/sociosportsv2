export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegistrationData {
    email: string;
    password?: string;
    name: string;
    role: 'ATHLETE' | 'TRAINER' | 'VENDOR' | 'ADMIN';
    phone?: string;
    [key: string]: any;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    isVerified?: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
    message?: string;
}

export interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    description: string;
    organization: string;
    postedById: string;
    createdAt: string;
    isActive: boolean;
    [key: string]: any;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    price?: number;
    capacity?: number;
    [key: string]: any;
}

export interface Vendor {
    id: string;
    businessName: string;
    category: string;
    location: string;
    contactPerson: string;
    isVerified: boolean;
    [key: string]: any;
}

export interface Athlete {
    id: string;
    name: string;
    sport: string;
    level: string;
    isVerified: boolean;
    [key: string]: any;
}

export interface Trainer {
    id: string;
    name: string;
    specialization: string;
    experience: number;
    isVerified: boolean;
    [key: string]: any;
}

export interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: string;
    createdAt: string;
}
