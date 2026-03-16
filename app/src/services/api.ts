import { toast } from 'react-hot-toast';
import type { LoginCredentials, RegistrationData, AuthResponse, User, Job, Event, Vendor, Athlete, Trainer, Inquiry } from '../types/api';
import CryptoJS from 'crypto-js';

// From .env (API_URL); fallback: relative for browser (Vite proxy), localhost for SSR
const envApiUrl = (import.meta as any).env?.API_URL;
export const API_URL =
  envApiUrl && typeof envApiUrl === 'string' && envApiUrl.trim()
    ? envApiUrl.trim().replace(/\/+$/, '')
    : typeof window !== 'undefined'
      ? '/api'
      : 'http://localhost:5000/api';

// Lightweight in-memory cache for idempotent GET-like calls (per-tab, non-persistent).
// This helps avoid unnecessary duplicate network calls when multiple components
// request the same CMS content or shared resources on first render.
const cmsCache = new Map<string, Promise<any>>();

// Helper: decrypt API responses that include `encResults` (AES-encrypted JSON)
const decryptEncResultsIfPresent = (payload: any) => {
    if (!payload || typeof payload !== 'object') return payload;

    const enc = (payload as any).encResults;
    const key = (import.meta as any).env?.API_DECRYPT_KEY;

    if (!enc || typeof enc !== 'string' || !key) return payload;

    try {
        const bytes = (CryptoJS as any).AES.decrypt(enc, key);
        const decrypted = bytes.toString((CryptoJS as any).enc.Utf8);
        if (!decrypted) return payload;

        const parsed = JSON.parse(decrypted);
        return parsed;
    } catch (error) {
        console.error('Failed to decrypt encResults payload', error);
        return payload;
    }
};

/** Normalize athlete/coach search response to { rows, count } regardless of backend shape (plain or from decrypted encResults). */
const normalizeSearchResponse = (payload: any): { rows: any[]; count: number } => {
    if (!payload || typeof payload !== 'object') {
        return { rows: [], count: 0 };
    }
    const obj = payload as Record<string, any>;
    // Already normalized
    if (Array.isArray(obj.rows) && typeof obj.count === 'number') {
        return { rows: obj.rows, count: obj.count };
    }
    // Nested under .data
    if (obj.data && typeof obj.data === 'object') {
        const inner = obj.data as Record<string, any>;
        if (Array.isArray(inner.rows) && typeof inner.count === 'number') {
            return { rows: inner.rows, count: inner.count };
        }
        if (Array.isArray(inner.rows)) {
            return { rows: inner.rows, count: inner.rows.length };
        }
        if (Array.isArray(inner)) return { rows: inner, count: inner.length };
    }
    // Common alternate keys: list, result, data (array), items
    const rows =
        Array.isArray(obj.rows) ? obj.rows
            : Array.isArray(obj.list) ? obj.list
                : Array.isArray(obj.result) ? obj.result
                    : Array.isArray(obj.data) ? obj.data
                        : Array.isArray(obj.items) ? obj.items
                            : [];
    const count =
        typeof obj.count === 'number' ? obj.count
            : typeof obj.total === 'number' ? obj.total
                : typeof obj.totalCount === 'number' ? obj.totalCount
                    : typeof obj.total_count === 'number' ? obj.total_count
                        : rows.length;
    return { rows, count };
};

export const api = {
    // Auth
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Login failed' }));
            throw new Error(error.message || 'Login failed');
        }
        return response.json();
    },

    register: async (userData: RegistrationData): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Registration failed' }));
            throw new Error(error.message || 'Registration failed');
        }
        return response.json();
    },

    googleAuth: async (data: { credential?: string, access_token?: string, password?: string }) => {
        const response = await fetch(`${API_URL}/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Google login failed' }));
            throw new Error(error.message || 'Google login failed');
        }
        return response.json();
    },

    // OTP
    otp: {
        send: async (email: string, purpose: string) => {
            const response = await fetch(`${API_URL}/otp/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose }),
            });
            if (!response.ok) throw new Error('Failed to send OTP');
            return response.json();
        },
        sendPhone: async (phone: string, purpose: string) => {
            const response = await fetch(`${API_URL}/otp/send-phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, purpose }),
            });
            if (!response.ok) throw new Error('Failed to send OTP to phone');
            return response.json();
        },
        verify: async (identifier: string, otp: string, purpose: string, type: 'email' | 'phone' = 'email') => {
            const body: any = { otp, purpose };
            if (type === 'email') body.email = identifier;
            else body.phone = identifier;

            const response = await fetch(`${API_URL}/otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) return { success: false };
            return response.json();
        }
    },

    // Registration Extras
    uploadProfile: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_URL}/upload/public`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Upload failed');
        return response.json();
    },

    finishRegistration: async (data: any) => {
        const response = await fetch(`${API_URL}/inquiries/registration-complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Final registration step failed');
        return response.json();
    },

    // User (phone login + OTP + create athlete)
    userLogin: async (phonenumber: string) => {
        const response = await fetch(`${API_URL}/User/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phonenumber }),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to send OTP');
        }
        return response.json();
    },
    userLoginWithOtp: async (phonenumber: string, otp: string) => {
        const response = await fetch(`${API_URL}/User/loginwithotp?otp=${encodeURIComponent(otp)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phonenumber }),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Invalid or expired OTP');
        }
        return response.json();
    },
    commonUpload: async (file: File, modulename: string) => {
        const form = new FormData();
        form.append('singleFile', file);
        const response = await fetch(`${API_URL}/Common/Upload?modulename=${encodeURIComponent(modulename)}`, {
            method: 'POST',
            body: form,
        });
        if (!response.ok) throw new Error('Upload failed');
        return response.json();
    },
    userCreate: async (data: {
        first_name: string;
        phonenumber: string;
        dob?: string;
        user_type?: string;
        photos?: any[];
        images?: any[];
        professional_title?: string;
        technical_overview?: string;
        weight?: string;
        [key: string]: any;
    }) => {
        const response = await fetch(`${API_URL}/User/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to create profile');
        }
        return response.json();
    },

    getProfessionalHistory: async (userId: number | string, page: number = 0, pageSize: number = 10) => {
        const params = new URLSearchParams();
        params.append('user_id', String(userId));
        params.append('page', String(page));
        params.append('page_size', String(pageSize));

        const response = await fetch(`${API_URL}/ProfessionalHistory/list?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch professional history');
        const raw = await response.json();
        return decryptEncResultsIfPresent(raw);
    },

    getEducationHistory: async (userId: number | string, page: number = 0, pageSize: number = 10) => {
        const params = new URLSearchParams();
        params.append('user_id', String(userId));
        params.append('page', String(page));
        params.append('page_size', String(pageSize));

        const response = await fetch(`${API_URL}/Education/list?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch education history');
        const raw = await response.json();
        return decryptEncResultsIfPresent(raw);
    },

    // Users
    getUsers: async (token: string) => {
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    updateUser: async (id: string, data: any, token: string) => {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
    },

    deleteUser: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return response.json();
    },

    // Events
    getEvents: async (): Promise<Event[]> => {
        const response = await fetch(`${API_URL}/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    createEvent: async (eventData: any, token: string) => {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Failed to create event' }));
            throw new Error(error.error || 'Failed to create event');
        }
        return response.json();
    },

    updateEvent: async (id: string, eventData: any, token: string) => {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Failed to update event' }));
            throw new Error(error.error || 'Failed to update event');
        }
        return response.json();
    },

    deleteEvent: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Failed to delete event' }));
            throw new Error(error.error || 'Failed to delete event');
        }
        return response.json();
    },

    // Bookings
    getBookings: async (token: string) => {
        const response = await fetch(`${API_URL}/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return response.json();
    },

    createBooking: async (bookingData: any, token?: string) => {
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers,
            body: JSON.stringify(bookingData),
        });
        if (!response.ok) throw new Error('Failed to create booking');
        return response.json();
    },

    updateBookingStatus: async (id: string, status: string, token: string) => {
        const response = await fetch(`${API_URL}/bookings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update booking');
        return response.json();
    },

    // Content (CMS)
    cms: {
        get: async (slug: string) => {
            if (cmsCache.has(slug)) {
                return cmsCache.get(slug)!;
            }

            const promise = (async () => {
                const response = await fetch(`${API_URL}/content/${slug}`);
                if (!response.ok) return null;
                return response.json();
            })();

            cmsCache.set(slug, promise);
            return promise;
        },
        update: async (slug: string, data: any, token: string) => {
            const response = await fetch(`${API_URL}/content/${slug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update content');
            return response.json();
        }
    },

    // Posts
    getPosts: async (token?: string) => {
        const headers: any = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/posts`, { headers });
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    },

    getPost: async (id: string) => {
        const response = await fetch(`${API_URL}/posts/${id}`);
        // if (!response.ok) throw new Error('Failed to fetch post'); // Optional: handle 404 in UI
        return response.json();
    },

    createPost: async (postData: any, token: string) => {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error('Failed to create post');
        return response.json();
    },

    updatePost: async (id: string, postData: any, token: string) => {
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error('Failed to update post');
        return response.json();
    },

    deletePost: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete post');
        return response.json();
    },

    // Team
    getTeam: async () => {
        const response = await fetch(`${API_URL}/team`);
        if (!response.ok) throw new Error('Failed to fetch team');
        return response.json();
    },

    createTeamMember: async (data: any, token: string) => {
        const response = await fetch(`${API_URL}/team`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create team member');
        return response.json();
    },

    updateTeamMember: async (id: string, data: any, token: string) => {
        const response = await fetch(`${API_URL}/team/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update team member');
        return response.json();
    },

    deleteTeamMember: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/team/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete team member');
        return response.json();
    },

    // Content (Alternative accessors)
    getContent: async (slug: string) => {
        const response = await fetch(`${API_URL}/content/${slug}`);
        if (!response.ok) return null;
        return response.json();
    },

    updateContent: async (slug: string, data: any, token: string) => {
        const response = await fetch(`${API_URL}/content/${slug}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update content');
        return response.json();
    },

    // Analytics
    getAnalytics: async (token: string) => {
        const response = await fetch(`${API_URL}/analytics/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return response.json();
    },

    getRecentUsers: async (token: string, limit: number = 5) => {
        const response = await fetch(`${API_URL}/analytics/recent-users?limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch recent users');
        return response.json();
    },

    getRevenueChart: async (token: string, days: number = 30) => {
        const response = await fetch(`${API_URL}/analytics/revenue-chart?days=${days}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch revenue chart');
        return response.json();
    },

    getDetailedStats: async (token: string) => {
        const response = await fetch(`${API_URL}/analytics/detailed`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch detailed stats');
        return response.json();
    },

    getBookingStats: async (token: string) => {
        const response = await fetch(`${API_URL}/analytics/booking-stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch booking stats');
        return response.json();
    },

    // Jobs
    getJobs: async (): Promise<Job[]> => {
        const response = await fetch(`${API_URL}/jobs`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        return response.json();
    },

    getAllJobsAdmin: async (token: string): Promise<Job[]> => {
        const response = await fetch(`${API_URL}/jobs/admin/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch jobs');
        return response.json();
    },

    createJob: async (jobData: any, token: string) => {
        const response = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(jobData),
        });
        if (!response.ok) throw new Error('Failed to create job');
        return response.json();
    },

    updateJob: async (id: string, jobData: any, token: string) => {
        const response = await fetch(`${API_URL}/jobs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(jobData),
        });
        if (!response.ok) throw new Error('Failed to update job');
        return response.json();
    },

    deleteJob: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/jobs/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete job');
        return response.json();
    },

    // Vendors
    getVendors: async (category?: string): Promise<Vendor[]> => {
        const url = category ? `${API_URL}/vendors?category=${category}` : `${API_URL}/vendors`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch vendors');
        return response.json();
    },

    createVendor: async (vendorData: any, token: string) => {
        const response = await fetch(`${API_URL}/vendors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(vendorData),
        });
        if (!response.ok) throw new Error('Failed to create vendor');
        return response.json();
    },

    updateVendor: async (id: string, vendorData: any, token: string) => {
        const response = await fetch(`${API_URL}/vendors/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(vendorData),
        });
        if (!response.ok) throw new Error('Failed to update vendor');
        return response.json();
    },

    deleteVendor: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/vendors/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete vendor');
        return response.json();
    },

    // Athletes
    getAthletes: async (sport?: string, level?: string): Promise<Athlete[]> => {
        let url = `${API_URL}/athletes`;
        const params = new URLSearchParams();
        if (sport) params.append('sport', sport);
        if (level) params.append('level', level);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch athletes');
        return response.json();
    },

    verifyAthlete: async (id: string, isVerified: boolean, token: string) => {
        const response = await fetch(`${API_URL}/athletes/${id}/verify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isVerified }),
        });
        if (!response.ok) throw new Error('Failed to verify athlete');
        return response.json();
    },

    // Trainers
    getTrainers: async (specialization?: string): Promise<Trainer[]> => {
        const url = specialization
            ? `${API_URL}/trainers?specialization=${specialization}`
            : `${API_URL}/trainers`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch trainers');
        return response.json();
    },

    verifyTrainer: async (id: string, isVerified: boolean, token: string) => {
        const response = await fetch(`${API_URL}/trainers/${id}/verify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isVerified }),
        });
        if (!response.ok) throw new Error('Failed to verify trainer');
        return response.json();
    },

    // Inquiries
    getInquiries: async (token: string) => {
        const response = await fetch(`${API_URL}/inquiries`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch inquiries');
        return response.json();
    },

    createInquiry: async (inquiryData: any) => {
        const response = await fetch(`${API_URL}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiryData),
        });
        if (!response.ok) throw new Error('Failed to submit inquiry');
        return response.json();
    },

    /** General enquiry: POST /api/Settings/helpsupport with fixed request_type & subject; rest from form. No Authorization. */
    submitHelpSupport: async (data: { full_name: string; email: string; phonenumber: string; description: string }) => {
        const response = await fetch(`${API_URL}/Settings/helpsupport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                request_type: 'public_help',
                subject: 'Help Request',
                full_name: data.full_name,
                email: data.email,
                phonenumber: data.phonenumber,
                description: data.description,
            }),
        });
        if (!response.ok) throw new Error('Failed to submit help request');
        return response.json();
    },

    /** Book an event: POST /api/Settings/helpsupport with request_type event_booking. No Authorization. */
    submitEventBooking: async (data: {
        request_type: 'event_booking';
        organization_name: string;
        event_type: string;
        email: string;
        phone_number: string;
        description: string;
    }) => {
        const response = await fetch(`${API_URL}/Settings/helpsupport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to submit event booking');
        return response.json();
    },

    updateInquiryStatus: async (id: string, status: string, token: string) => {
        const response = await fetch(`${API_URL}/inquiries/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update inquiry status');
        return response.json();
    },

    deleteInquiry: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/inquiries/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete inquiry');
        return response.json();
    },

    // Institutions
    getInstitutions: async (filters?: { type?: string; city?: string; state?: string; verified?: boolean; search?: string }) => {
        let url = `${API_URL}/institutions`;
        if (filters) {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.city) params.append('city', filters.city);
            if (filters.state) params.append('state', filters.state);
            if (filters.verified !== undefined) params.append('verified', filters.verified.toString());
            if (filters.search) params.append('search', filters.search);
            if (params.toString()) url += `?${params.toString()}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch institutions');
        return response.json();
    },

    getInstitution: async (id: string) => {
        const response = await fetch(`${API_URL}/institutions/${id}`);
        if (!response.ok) throw new Error('Failed to fetch institution');
        return response.json();
    },

    createInstitution: async (institutionData: any) => {
        const response = await fetch(`${API_URL}/institutions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(institutionData),
        });
        if (!response.ok) throw new Error('Failed to register institution');
        return response.json();
    },

    // Communities
    getCommunities: async (filters?: { type?: string; city?: string; sport?: string }) => {
        let url = `${API_URL}/communities`;
        if (filters) {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.city) params.append('city', filters.city);
            if (filters.sport) params.append('sport', filters.sport);
            if (params.toString()) url += `?${params.toString()}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch communities');
        return response.json();
    },

    createCommunity: async (communityData: any) => {
        const response = await fetch(`${API_URL}/communities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(communityData),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to register community' }));
            throw new Error(error.message || 'Failed to register community');
        }
        return response.json();
    },

    updateInstitution: async (id: string, institutionData: any, token: string) => {
        const response = await fetch(`${API_URL}/institutions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(institutionData),
        });
        if (!response.ok) throw new Error('Failed to update institution');
        return response.json();
    },

    verifyInstitution: async (id: string, isVerified: boolean, token: string) => {
        const response = await fetch(`${API_URL}/institutions/${id}/verify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isVerified }),
        });
        if (!response.ok) throw new Error('Failed to verify institution');
        return response.json();
    },

    deleteInstitution: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/institutions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete institution');
        return response.json();
    },

    getInstitutionStats: async (token: string) => {
        const response = await fetch(`${API_URL}/institutions/stats/overview`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch institution statistics');
        return response.json();
    },

    // Society search (public; response may be encrypted)
    searchSocieties: async (query: string, isScreenFor: string = 'verifycertificate') => {
        const params = new URLSearchParams();
        params.append('q', query.trim());
        if (isScreenFor) params.append('is_screen_for', isScreenFor);
        const response = await fetch(`${API_URL}/Society/search?${params.toString()}`, {
            headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to search societies');
        const raw = await response.json();
        const decrypted = decryptEncResultsIfPresent(raw);
        if (Array.isArray(decrypted)) return decrypted;
        if (decrypted && Array.isArray((decrypted as any).rows)) return (decrypted as any).rows;
        if (decrypted && Array.isArray((decrypted as any).data)) return (decrypted as any).data;
        return [];
    },

    // Event Certificates (public)
    getEventCertificates: async (options: { page?: number; pageSize?: number; certificateId?: string } = {}) => {
        const { page = 0, pageSize = 10, certificateId } = options;
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('page_size', String(pageSize));
        if (certificateId && certificateId.trim()) {
            params.append('certificate_id', certificateId.trim());
        }

        const response = await fetch(`${API_URL}/EventCirtificate?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch event certificates');
        const raw = await response.json();
        return normalizeSearchResponse(raw);
    },

    /** MasterInterest list for sport dropdown: GET /MasterInterest/list?category=General&title=<search> */
    masterInterest: {
        list: async (params: { category: string; title?: string }) => {
            const searchParams = new URLSearchParams();
            searchParams.append('category', params.category);
            if (params.title != null && params.title.trim() !== '') {
                searchParams.append('title', params.title.trim());
            }
            const response = await fetch(`${API_URL}/MasterInterest/list?${searchParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch sports list');
            const raw = await response.json();
            const data = decryptEncResultsIfPresent(raw);
            const rows = Array.isArray(data?.rows) ? data.rows : Array.isArray(data?.list) ? data.list : Array.isArray(data) ? data : [];
            // Backend structure example: [{ category: 'Sports', titles: [{ title: 'Cricket', id: '1' }] }]
            const flattened: { id: number; title: string }[] = [];
            for (const r of rows) {
                if (Array.isArray((r as any).titles)) {
                    for (const t of (r as any).titles) {
                        flattened.push({
                            id: Number(t.id ?? t.Id ?? 0),
                            title: String(t.title ?? t.Title ?? ''),
                        });
                    }
                } else {
                    flattened.push({
                        id: Number((r as any).id ?? (r as any).Id ?? 0),
                        title: String((r as any).title ?? (r as any).Title ?? ''),
                    });
                }
            }
            return flattened;
        },
    },

    // Sports Profiles (Public Search)
    sportsProfiles: {
        create: async (profileData: any) => {
            const response = await fetch(`${API_URL}/profiles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });
            if (!response.ok) throw new Error('Failed to create sports profile');
            return response.json();
        },
        /**
         * Public search for athletes & trainers using /User/athletes-trainers.
         * - If query is empty: uses pagination (page=0&page_size=10) to fetch recent profiles.
         * - If query is provided: uses ?keyword=<query> for keyword search.
         * Backend may return only encrypted payload in `encResults`; we decrypt and normalize to { rows, count }.
         */
        search: async (query: string, page: number = 0, pageSize: number = 10) => {
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('page_size', String(pageSize));
            if (query && query.trim().length > 0) {
                params.append('keyword', query.trim());
            }

            const response = await fetch(`${API_URL}/User/athletes-trainers?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to search profiles');
            const raw = await response.json();
            const decrypted = decryptEncResultsIfPresent(raw);
            return normalizeSearchResponse(decrypted);
        },
        getById: async (sportsId: string) => {
            const response = await fetch(`${API_URL}/profiles/${encodeURIComponent(sportsId)}`);
            if (!response.ok) throw new Error('Profile not found');
            return response.json();
        }
    },

    // Employer Verification
    employerVerification: {
        submit: async (data: any, token: string) => {
            const headers: any = { 'Content-Type': 'application/json' };
            if (token && token !== 'null' && token !== 'undefined') {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/employer-verification/submit`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Failed to submit verification' }));
                throw new Error(error.message || error.error || 'Failed to submit verification');
            }
            return response.json();
        },

        getStatus: async (token: string) => {
            const headers: any = {};
            if (token && token !== 'null' && token !== 'undefined') {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_URL}/employer-verification/status`, {
                headers
            });
            if (!response.ok) throw new Error('Failed to get status');
            return response.json();
        },

        trackByToken: async (verificationToken: string) => {
            const response = await fetch(
                `${API_URL}/employer-verification/track/${verificationToken}`
            );
            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Invalid token' }));
                throw new Error(error.error || 'Invalid token');
            }
            return response.json();
        },

        // Admin endpoints
        admin: {
            getAll: async (token: string, status?: string, page: number = 1, limit: number = 20) => {
                let url = `${API_URL}/employer-verification/admin/all?page=${page}&limit=${limit}`;
                if (status) url += `&status=${status}`;
                const headers: any = {};
                if (token && token !== 'null' && token !== 'undefined') {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(url, {
                    headers
                });
                if (!response.ok) throw new Error('Failed to fetch verifications');
                return response.json();
            },

            getById: async (id: string, token: string) => {
                const headers: any = {};
                if (token && token !== 'null' && token !== 'undefined') {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(`${API_URL}/employer-verification/admin/${id}`, {
                    headers
                });
                if (!response.ok) throw new Error('Failed to fetch verification');
                return response.json();
            },

            approve: async (id: string, token: string) => {
                const headers: any = {};
                if (token && token !== 'null' && token !== 'undefined') {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(
                    `${API_URL}/employer-verification/admin/${id}/approve`,
                    { method: 'PUT', headers }
                );
                if (!response.ok) throw new Error('Failed to approve');
                return response.json();
            },

            reject: async (id: string, remarks: string, token: string) => {
                const headers: any = { 'Content-Type': 'application/json' };
                if (token && token !== 'null' && token !== 'undefined') {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(
                    `${API_URL}/employer-verification/admin/${id}/reject`,
                    {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ remarks })
                    }
                );
                if (!response.ok) throw new Error('Failed to reject');
                return response.json();
            },

            setUnderReview: async (id: string, token: string) => {
                const headers: any = {};
                if (token && token !== 'null' && token !== 'undefined') {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(
                    `${API_URL}/employer-verification/admin/${id}/review`,
                    { method: 'PUT', headers }
                );
                if (!response.ok) throw new Error('Failed to update status');
                return response.json();
            }
        }
    }
};
