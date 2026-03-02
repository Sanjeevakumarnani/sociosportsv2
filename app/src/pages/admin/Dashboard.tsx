import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import AdminLayout from '../../layouts/AdminLayout';

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) throw new Error('No token found');

                // Parallel fetch for overview and detailed stats
                const [basicStats, detailedStats] = await Promise.all([
                    api.getAnalytics(token),
                    api.getDetailedStats(token)
                ]);

                setStats({ ...basicStats, ...detailedStats });
            } catch (err) {
                console.error('Failed to fetch dashboard stats', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[var(--accent-orange)] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500 font-medium">
                {error}
            </div>
        );
    }

    const COLORS = ['#FF4D00', '#00C49F', '#FFBB28', '#FF8042'];

    // Safe accessors for data
    const revenueData = stats?.revenueTrend || [];
    const userGrowthData = stats?.userGrowth || [];
    const bookingStatusData = stats?.bookingStatusDistribution || [];
    const roleDistributionData = stats?.roleDistribution || [];
    const recentUsers = stats?.recentUsers || [];

    return (
        <AdminLayout>
            <div className="space-y-6 pb-10">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Dashboard Overview</h1>
                    <p className="text-sm text-[var(--text-secondary)] font-medium">real-time insights and performance metrics</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Revenue"
                        value={`₹${stats?.totalRevenue?.toLocaleString() || '0'}`}
                        icon={DollarSign}
                        trend="+12.5%"
                        trendUp={true}
                    />
                    <StatsCard
                        title="Total Bookings"
                        value={stats?.totalBookings || '0'}
                        icon={Calendar}
                        trend="+8.2%"
                        trendUp={true}
                    />
                    <StatsCard
                        title="Active Users"
                        value={stats?.totalUsers || '0'}
                        icon={Users}
                        trend="+24.3%"
                        trendUp={true}
                    />
                    <StatsCard
                        title="Growth Rate"
                        value="18.2%"
                        icon={TrendingUp}
                        trend="+2.1%"
                        trendUp={true}
                    />
                </div>

                {/* Main Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Revenue Trend */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">Revenue Trend</h3>
                            <p className="text-xs font-bold text-[var(--text-secondary)]">Last 7 Days</p>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="var(--text-secondary)"
                                        tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="var(--text-secondary)"
                                        tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value: number) => `₹${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-primary)',
                                            borderColor: 'var(--border)',
                                            borderRadius: '12px',
                                            color: 'var(--text-primary)'
                                        }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                    <Bar dataKey="amount" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Growth */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">User Growth</h3>
                            <p className="text-xs font-bold text-[var(--text-secondary)]">Last 6 Months</p>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userGrowthData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00C49F" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="var(--text-secondary)"
                                        tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="var(--text-secondary)"
                                        tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-primary)',
                                            borderColor: 'var(--border)',
                                            borderRadius: '12px',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="users" stroke="#00C49F" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Secondary Charts */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Booking Status */}
                    <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6">
                        <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">Booking Status</h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bookingStatusData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="status"
                                        type="category"
                                        stroke="var(--text-secondary)"
                                        tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={80}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-primary)',
                                            borderColor: 'var(--border)',
                                            borderRadius: '12px',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#FFBB28" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Role Distribution */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6">
                        <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">User Roles</h3>
                        <div className="h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roleDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {roleDistributionData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-primary)',
                                            borderColor: 'var(--border)',
                                            borderRadius: '12px',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {roleDistributionData.map((entry: any, index: number) => (
                                    <div key={index} className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Users Table */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                        <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">Recent Users</h3>
                        <button className="text-[var(--accent-orange)] hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.length > 0 ? (
                                    recentUsers.map((user: any, i: number) => (
                                        <tr key={user.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-primary)] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center font-bold text-xs text-[var(--text-secondary)]">
                                                        {user.name?.charAt(0) || user.email.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[var(--text-primary)]">{user.name || 'Anonymous'}</p>
                                                        <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-md bg-[var(--bg-primary)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-[var(--text-secondary)]">
                                                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Active</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-secondary)] text-sm font-medium">
                                            No recent users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatsCard = ({ title, value, icon: Icon, trend, trendUp }: any) => (
    <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)]/80 transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent-orange)]/50 transition-colors">
                <Icon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-orange)] transition-colors" />
            </div>
            {trend && (
                <div className={`px-2 py-1 rounded-lg border flex items-center gap-1 ${trendUp
                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span className="text-[10px] font-black tracking-wider">{trend}</span>
                </div>
            )}
        </div>
        <div>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{value}</h3>
        </div>
    </div>
);

export default Dashboard;
