import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';


const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.login({ email, password });
            if (response.token) {
                localStorage.setItem('adminToken', response.token);
                localStorage.setItem('token', response.token); // Store for general API use
                localStorage.setItem('adminUser', JSON.stringify(response.user));
                // Check if user is admin - usually backend handles this or returns role
                if (response.user.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    setError('Access denied. Admin privileges required.');
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-orange)]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-8 relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] mb-4">
                        <Lock className="w-6 h-6 text-[var(--accent-orange)]" />
                    </div>
                    <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">Admin Portal</h1>
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Secure access for administrators</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-red-500">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[var(--accent-orange)] transition-all placeholder:text-[var(--text-secondary)]/50"
                                placeholder="name@sociosports.in"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[var(--accent-orange)] transition-all placeholder:text-[var(--text-secondary)]/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/90 text-white font-bold uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-[var(--accent-orange)]/20 mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Access Dashboard
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider">
                        Return to Website
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
