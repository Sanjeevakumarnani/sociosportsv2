import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/institutions - Get all institutions with optional filtering
router.get('/', async (req, res) => {
    try {
        const { type, city, state, verified, search } = req.query;

        const where: any = {};

        if (type) where.type = type;
        if (city) where.city = city;
        if (state) where.state = state;
        if (verified === 'true') where.isVerified = true;
        if (search) {
            where.OR = [
                { name: { contains: search as string } },
                { description: { contains: search as string } },
                { city: { contains: search as string } }
            ];
        }

        const institutions = await prisma.institution.findMany({
            where,
            orderBy: [
                { isVerified: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        res.json(institutions);
    } catch (error) {
        console.error('Error fetching institutions:', error);
        res.status(500).json({ error: 'Failed to fetch institutions' });
    }
});

// GET /api/institutions/:id - Get single institution
router.get('/:id', async (req, res) => {
    try {
        const institution = await prisma.institution.findUnique({
            where: { id: req.params.id }
        });

        if (!institution) {
            return res.status(404).json({ error: 'Institution not found' });
        }

        res.json(institution);
    } catch (error) {
        console.error('Error fetching institution:', error);
        res.status(500).json({ error: 'Failed to fetch institution' });
    }
});

// POST /api/institutions - Create new institution (public registration)
router.post('/', async (req, res) => {
    try {
        const {
            name,
            type,
            description,
            address,
            city,
            state,
            pincode,
            contactEmail,
            contactPhone,
            website,
            facilities,
            sports,
            capacity,
            establishedYear
        } = req.body;

        // Validate required fields
        if (!name || !type || !contactEmail || !contactPhone) {
            return res.status(400).json({
                error: 'Missing required fields: name, type, contactEmail, contactPhone'
            });
        }

        // Convert arrays to JSON strings if needed
        const facilitiesJson = Array.isArray(facilities)
            ? JSON.stringify(facilities)
            : facilities;
        const sportsJson = Array.isArray(sports)
            ? JSON.stringify(sports)
            : sports;

        const institution = await prisma.institution.create({
            data: {
                name,
                type,
                description,
                address,
                city,
                state,
                pincode,
                contactEmail,
                contactPhone,
                website,
                facilities: facilitiesJson,
                sports: sportsJson,
                capacity: capacity ? parseInt(capacity) : null,
                establishedYear: establishedYear ? parseInt(establishedYear) : null
            }
        });

        res.status(201).json(institution);
    } catch (error) {
        console.error('Error creating institution:', error);
        res.status(500).json({ error: 'Failed to create institution' });
    }
});

// PUT /api/institutions/:id - Update institution (admin only)
router.put('/:id', async (req, res) => {
    try {
        // TODO: Add admin authentication middleware
        const {
            name,
            type,
            description,
            address,
            city,
            state,
            pincode,
            contactEmail,
            contactPhone,
            website,
            logo,
            coverImage,
            facilities,
            sports,
            capacity,
            establishedYear,
            subscriptionTier,
            features
        } = req.body;

        // Convert arrays to JSON strings if needed
        const facilitiesJson = Array.isArray(facilities)
            ? JSON.stringify(facilities)
            : facilities;
        const sportsJson = Array.isArray(sports)
            ? JSON.stringify(sports)
            : sports;
        const featuresJson = Array.isArray(features)
            ? JSON.stringify(features)
            : features;

        const institution = await prisma.institution.update({
            where: { id: req.params.id },
            data: {
                name,
                type,
                description,
                address,
                city,
                state,
                pincode,
                contactEmail,
                contactPhone,
                website,
                logo,
                coverImage,
                facilities: facilitiesJson,
                sports: sportsJson,
                capacity: capacity ? parseInt(capacity) : undefined,
                establishedYear: establishedYear ? parseInt(establishedYear) : undefined,
                subscriptionTier,
                features: featuresJson
            }
        });

        res.json(institution);
    } catch (error) {
        console.error('Error updating institution:', error);
        res.status(500).json({ error: 'Failed to update institution' });
    }
});

// PUT /api/institutions/:id/verify - Verify/unverify institution (admin only)
router.put('/:id/verify', async (req, res) => {
    try {
        // TODO: Add admin authentication middleware
        const { isVerified } = req.body;

        const institution = await prisma.institution.update({
            where: { id: req.params.id },
            data: { isVerified: isVerified === true }
        });

        res.json(institution);
    } catch (error) {
        console.error('Error verifying institution:', error);
        res.status(500).json({ error: 'Failed to verify institution' });
    }
});

// DELETE /api/institutions/:id - Delete institution (admin only)
router.delete('/:id', async (req, res) => {
    try {
        // TODO: Add admin authentication middleware
        await prisma.institution.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Institution deleted successfully' });
    } catch (error) {
        console.error('Error deleting institution:', error);
        res.status(500).json({ error: 'Failed to delete institution' });
    }
});

// GET /api/institutions/stats/overview - Get institution statistics (admin only)
router.get('/stats/overview', async (req, res) => {
    try {
        // TODO: Add admin authentication middleware
        const total = await prisma.institution.count();
        const verified = await prisma.institution.count({
            where: { isVerified: true }
        });
        const byType = await prisma.institution.groupBy({
            by: ['type'],
            _count: true
        });

        res.json({
            total,
            verified,
            pending: total - verified,
            byType
        });
    } catch (error) {
        console.error('Error fetching institution stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

export default router;
