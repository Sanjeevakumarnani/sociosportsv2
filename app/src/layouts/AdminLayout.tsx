import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronDown,
    FileText,
    MessageSquare,
    Briefcase,
    Store,
    GraduationCap,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const { showWarning, timeLeft, extendSession, logout } = useSessionTimeout({
        timeout: 30 * 60 * 1000, // 30 minutes
        onTimeout: () => navigate('/admin'),
    });

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
        { icon: MessageSquare, label: 'Inquiries', path: '/admin/inquiries' },
        { icon: Calendar, label: 'Events', path: '/admin/events' },
        { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
        { icon: Store, label: 'Vendors', path: '/admin/vendors' },
        { icon: GraduationCap, label: 'Institutions', path: '/admin/institutions' },
        { icon: FileText, label: 'Content', path: '/admin/pages' },
        { icon: Users, label: 'Team', path: '/admin/team' },
        { icon: FileText, label: 'Blog', path: '/admin/blog' },

        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex">
            {/* Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--border)] z-50 transition-transform duration-300 flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-orange)] flex items-center justify-center">
                            <span className="font-black text-white text-lg">S</span>
                        </div>
                        <span className="font-black text-[var(--text-primary)] text-lg tracking-tight">ADMIN</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-[var(--bg-primary)] rounded-lg">
                        <X className="w-5 h-5 text-[var(--text-secondary)]" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <p className="px-4 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2">Main Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                                    ${isActive
                                        ? 'bg-[var(--accent-orange)] text-white shadow-lg shadow-[var(--accent-orange)]/20'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'}
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`} />
                                <span className="text-sm font-bold">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-[var(--border)]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 w-full transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] px-6 py-4">
                    <div className="flex justify-between items-center">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-[var(--bg-secondary)] rounded-lg">
                            <Menu className="w-6 h-6 text-[var(--text-primary)]" />
                        </button>

                        <div className="flex items-center gap-4 ml-auto">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] w-64"
                                />
                            </div>

                            <button className="relative p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
                                <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-primary)]"></span>
                            </button>

                            <div className="flex items-center gap-3 pl-4 border-l border-[var(--border)]">
                                <div className="w-8 h-8 rounded-full bg-[var(--accent-orange)]/10 flex items-center justify-center border border-[var(--accent-orange)]/20">
                                    <span className="text-xs font-black text-[var(--accent-orange)]">A</span>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-xs font-bold text-[var(--text-primary)]">Admin User</p>
                                    <p className="text-[10px] text-[var(--text-secondary)]">Super Admin</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] hidden md:block" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children ? children : <Outlet />}
                </main>
            </div>
            {/* Session Timeout Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Session Timeout</h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Your session will expire in <span className="text-[var(--accent-orange)] font-bold">{formatTime(timeLeft)}</span> due to inactivity.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={logout}
                                className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] font-bold transition-all"
                            >
                                Logout
                            </button>
                            <button
                                onClick={extendSession}
                                className="flex-1 px-4 py-3 rounded-xl bg-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/90 text-white font-bold transition-all"
                            >
                                Stay Logged In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
