import { Request, Response } from 'express';
import { prisma } from '../index';

// Get dashboard analytics
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Get total users count
        const totalUsers = await prisma.user.count();

        // Get total events count
        const totalEvents = await prisma.event.count();

        // Get total bookings and calculate revenue
        const bookings = await prisma.booking.findMany({
            include: {
                event: { select: { price: true } }
            }
        });

        // Calculate total revenue from event bookings
        const totalRevenue = bookings.reduce((sum, booking) => {
            return sum + (booking.event?.price || 0);
        }, 0);

        // Get confirmed bookings count for engagement calculation
        const confirmedBookings = await prisma.booking.count({
            where: { status: 'CONFIRMED' }
        });

        // Calculate engagement rate (confirmed bookings / total bookings)
        const engagementRate = bookings.length > 0
            ? Math.round((confirmedBookings / bookings.length) * 100)
            : 0;

        // Get published posts count
        const totalPosts = await prisma.post.count({
            where: { status: 'PUBLISHED' }
        });

        res.json({
            totalUsers,
            totalEvents,
            totalRevenue,
            engagementRate,
            totalBookings: bookings.length,
            totalPosts
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};

// Get recent users (last 5-10 registrations)
export const getRecentUsers = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 5;

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        res.json(users);
    } catch (error) {
        console.error('Recent users error:', error);
        res.status(500).json({ error: 'Failed to fetch recent users' });
    }
};

// Get revenue chart data (last 30 days, grouped by day)
export const getRevenueChart = async (req: Request, res: Response) => {
    try {
        const days = parseInt(req.query.days as string) || 30;

        // Get bookings from last N days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const bookings = await prisma.booking.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            include: {
                event: { select: { price: true } }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by date and calculate daily revenue
        const revenueByDate: { [key: string]: number } = {};

        bookings.forEach(booking => {
            const date = booking.createdAt.toISOString().split('T')[0];
            const revenue = booking.event?.price || 0;
            revenueByDate[date] = (revenueByDate[date] || 0) + revenue;
        });

        // Convert to array format for charts
        const chartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
            date,
            revenue
        }));

        res.json(chartData);
    } catch (error) {
        console.error('Revenue chart error:', error);
        res.status(500).json({ error: 'Failed to fetch revenue chart data' });
    }
};

// Get booking stats (pending, confirmed, cancelled counts)
export const getBookingStats = async (req: Request, res: Response) => {
    try {
        const pending = await prisma.booking.count({ where: { status: 'PENDING' } });
        const confirmed = await prisma.booking.count({ where: { status: 'CONFIRMED' } });
        const cancelled = await prisma.booking.count({ where: { status: 'CANCELLED' } });

        res.json({
            pending,
            confirmed,
            cancelled,
            total: pending + confirmed + cancelled
        });
    } catch (error) {
        console.error('Booking stats error:', error);
        res.status(500).json({ error: 'Failed to fetch booking statistics' });
    }
};

// Get detailed analytics for charts
export const getDetailedStats = async (req: Request, res: Response) => {
    try {
        // 1. User Growth (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const users = await prisma.user.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true }
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const growthData: { [key: string]: number } = {};

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            growthData[`${months[d.getMonth()]} ${d.getFullYear()}`] = 0;
        }

        users.forEach(user => {
            const date = new Date(user.createdAt);
            const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
            if (growthData[key] !== undefined) {
                growthData[key]++;
            }
        });

        const userGrowth = Object.entries(growthData).map(([name, count]) => ({ name, users: count }));

        // 2. User Role Distribution
        const roles = await prisma.user.groupBy({
            by: ['role'],
            _count: { _all: true }
        });

        const roleDistribution = roles.map(r => ({
            name: r.role,
            value: r._count._all
        }));

        // 3. Booking Status Trends
        const bookings = await prisma.booking.groupBy({
            by: ['status'],
            _count: { _all: true }
        });

        const bookingTrends = bookings.map(b => ({
            name: b.status,
            count: b._count._all
        }));

        // 4. Revenue Trend (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentBookings = await prisma.booking.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            include: { event: { select: { price: true } } }
        });

        const revenueData: { [key: string]: number } = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            revenueData[d.toISOString().split('T')[0]] = 0;
        }

        recentBookings.forEach(b => {
            const date = b.createdAt.toISOString().split('T')[0];
            if (revenueData[date] !== undefined) {
                revenueData[date] += b.event?.price || 0;
            }
        });

        const revenueTrend = Object.entries(revenueData).map(([date, amount]) => ({
            date: date.split('-').slice(1).join('/'),
            amount
        }));

        res.json({
            userGrowth,
            roleDistribution,
            bookingTrends,
            revenueTrend
        });
    } catch (error) {
        console.error('Detailed stats error:', error);
        res.status(500).json({ error: 'Failed to fetch detailed statistics' });
    }
};
