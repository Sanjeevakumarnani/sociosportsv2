import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Calendar,
    User,
    Tag,
    Image as ImageIcon
} from 'lucide-react';
import { api } from '../../../services/api';
import PostForm from './PostForm';
import Pagination from '../../../components/admin/Pagination';
import ExportButton from '../../../components/admin/ExportButton';
import Skeleton from '../../../components/Skeleton';
import AdminLayout from '../../../layouts/AdminLayout';
import toast from 'react-hot-toast';

const BlogList = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'form'>('list');
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            if (token) {
                const data = await api.getPosts();
                // Normalize data to ensure author and category are strings (handling populated fields)
                const normalizedData = data.map((post: any) => ({
                    ...post,
                    author: typeof post.author === 'object' ? post.author?.name || 'Unknown' : post.author,
                    category: typeof post.category === 'object' ? post.category?.name || 'General' : post.category
                }));
                setPosts(normalizedData);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to load blog posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const token = localStorage.getItem('adminToken');
                if (token) {
                    await api.deletePost(id, token);
                    toast.success('Post deleted successfully');
                    fetchPosts();
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                toast.error('Failed to delete post');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} posts?`)) {
            try {
                const token = localStorage.getItem('adminToken');
                if (token) {
                    await Promise.all(selectedItems.map(id => api.deletePost(id, token)));
                    toast.success('Selected posts deleted successfully');
                    setSelectedItems([]);
                    fetchPosts();
                }
            } catch (error) {
                console.error('Error deleting posts:', error);
                toast.error('Failed to delete selected posts');
            }
        }
    };

    const handleEdit = (post: any) => {
        setSelectedPost(post);
        setView('form');
    };

    const handleCreate = () => {
        setSelectedPost(null);
        setView('form');
    };

    const handleFormClose = () => {
        setView('list');
        setSelectedPost(null);
        fetchPosts();
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === paginatedPosts.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(paginatedPosts.map(p => p.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Filter logic
    const filteredPosts = posts.filter(post => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'ALL' || post.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    // Pagination logic
    const totalItems = filteredPosts.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Columns for export
    const exportColumns = [
        { key: 'title', header: 'Title' },
        { key: 'author', header: 'Author' },
        { key: 'category', header: 'Category' },
        { key: 'status', header: 'Status' },
        { key: 'views', header: 'Views' },
        { key: 'createdAt', header: 'Published Date' }
    ];

    if (view === 'form') {
        return <PostForm post={selectedPost} onClose={handleFormClose} onSave={handleFormClose} />;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight uppercase">Blog Posts</h1>
                        <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage articles and content updates</p>
                    </div>
                    <div className="flex gap-3">
                        <ExportButton
                            data={filteredPosts}
                            filename="blog_posts_export"
                            columns={exportColumns}
                        />
                        {selectedItems.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
                            >
                                <Trash2 className="w-5 h-5" />
                                Delete Selected ({selectedItems.length})
                            </button>
                        )}
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 bg-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/90 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[var(--accent-orange)]/20"
                        >
                            <Plus className="w-5 h-5" />
                            Create Post
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                        >
                            <option value="ALL">All Categories</option>
                            <option value="News">News</option>
                            <option value="Events">Events</option>
                            <option value="Stories">Stories</option>
                            <option value="Tips">Tips</option>
                        </select>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="space-y-4">
                    {!loading && paginatedPosts.length > 0 && (
                        <div className="flex items-center gap-3 px-6 py-2">
                            <input
                                type="checkbox"
                                checked={selectedItems.length === paginatedPosts.length && paginatedPosts.length > 0}
                                onChange={toggleSelectAll}
                                className="w-5 h-5 rounded border-[var(--border)] bg-[var(--bg-primary)] text-[var(--accent-orange)] focus:ring-[var(--accent-orange)]"
                            />
                            <span className="text-sm font-bold text-[var(--text-secondary)]">Select All on Page</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 space-y-4">
                                    <Skeleton key={i} className="rounded-xl h-[200px]" />
                                    <Skeleton className="h-4 w-[80%]" />
                                    <Skeleton className="h-4 w-[40%]" />
                                </div>
                            ))}
                        </div>
                    ) : paginatedPosts.length === 0 ? (
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-12 text-center">
                            <ImageIcon className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No posts found</h3>
                            <p className="text-[var(--text-secondary)] font-medium">
                                Create your first blog post to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedPosts.map((post) => (
                                <div key={post.id} className={`group bg-[var(--bg-secondary)] border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${selectedItems.includes(post.id)
                                    ? 'border-[var(--accent-orange)] ring-1 ring-[var(--accent-orange)]'
                                    : 'border-[var(--border)] hover:border-[var(--accent-orange)]/30'
                                    }`}>
                                    <div className="relative h-48 bg-[var(--bg-primary)] overflow-hidden">
                                        <img
                                            src={post.image || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80'}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(post.id)}
                                                onChange={() => toggleSelectItem(post.id)}
                                                className="w-5 h-5 rounded border-white/50 bg-black/20 text-[var(--accent-orange)] focus:ring-[var(--accent-orange)] backdrop-blur-sm"
                                            />
                                        </div>
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 uppercase">
                                            {post.category || 'General'}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--accent-orange)] transition-colors uppercase tracking-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3 flex-1 font-medium italic">
                                            {post.excerpt || post.summary}
                                        </p>

                                        <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-secondary)] mb-6 pt-4 border-t border-[var(--border)] uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3" />
                                                {post.author}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-auto">
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--accent-orange)] hover:text-white text-[var(--text-secondary)] text-xs font-black transition-all border border-[var(--border)] hover:border-[var(--accent-orange)] uppercase"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 rounded-xl bg-[var(--bg-primary)] hover:bg-red-500 hover:text-white text-[var(--text-secondary)] transition-all border border-[var(--border)] hover:border-red-500"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default BlogList;
