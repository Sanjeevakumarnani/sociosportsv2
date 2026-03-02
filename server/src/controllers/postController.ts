import { Request, Response } from 'express';
import { prisma } from '../index';
import { deleteFile } from '../utils/fileHelper';

// Get all posts
export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            include: { author: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// Get single post
export const getPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: String(id) },
            include: { author: { select: { name: true } } }
        });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

// Create a post (Admin)
export const createPost = async (req: Request, res: Response) => {
    const { title, content, category, image, audio, video, gallery, status } = req.body;
    const authorId = (req as any).user?.userId;

    if (!authorId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const postData: any = {
            title: String(title),
            content: String(content),
            category: String(category),
            authorId: String(authorId),
            status: status ? String(status) : 'PUBLISHED'
        };

        if (image) postData.image = String(image);
        if (audio) postData.audio = String(audio);
        if (video) postData.video = String(video);
        if (gallery) postData.gallery = String(gallery);

        const post = await prisma.post.create({ data: postData });
        res.status(201).json(post);
    } catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// Update a post (Admin)
export const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, category, status, image, audio, video, gallery } = req.body;
    try {
        const updateData: any = {};
        if (title !== undefined) updateData.title = String(title);
        if (content !== undefined) updateData.content = String(content);
        if (category !== undefined) updateData.category = String(category);
        if (status !== undefined) updateData.status = String(status);
        if (image !== undefined) updateData.image = image ? String(image) : null;
        if (audio !== undefined) updateData.audio = audio ? String(audio) : null;
        if (video !== undefined) updateData.video = video ? String(video) : null;
        if (gallery !== undefined) updateData.gallery = gallery ? String(gallery) : null;

        const post = await prisma.post.update({
            where: { id: String(id) },
            data: updateData
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

// Delete a post (Admin)
export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: String(id) }
        });

        if (post && post.image) {
            deleteFile(post.image);
        }

        await prisma.post.delete({ where: { id: String(id) } });
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};
