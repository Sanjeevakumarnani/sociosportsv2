import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import { Section, Input } from '../../../components/admin/CmsComponents';

interface PageEditorProps {
    slug: string;
    title: string;
}

const PageEditor = ({ slug, title }: PageEditorProps) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Default structure for generic text pages
    const [data, setData] = useState({
        title: title,
        content: ''
    });

    useEffect(() => {
        setLoading(true);
        loadData();
    }, [slug]);

    const loadData = async () => {
        try {
            const response = await api.cms.get(slug);
            if (response && response.content) {
                // Determine if content is JSON or raw string. 
                try {
                    const parsed = JSON.parse(response.content);
                    setData(parsed);
                } catch {
                    // Fallback if not JSON (legacy or empty)
                    setData(prev => ({ ...prev, content: response.content || '' }));
                }
            } else {
                // If new, reset to defaults
                setData({ title: title, content: '' });
            }
        } catch (error) {
            console.error(`Failed to load ${slug}`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            await api.cms.update(slug, {
                title: title,
                content: JSON.stringify(data)
            }, token);
            alert('Content saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-[var(--text-primary)] p-8">Loading...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                    {title} <span className="text-[var(--accent-orange)]">Editor</span>
                </h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            <Section title="Page Content">
                <Input
                    label="Page Title (Displayed on page)"
                    value={data.title}
                    onChange={(v: string) => setData({ ...data, title: v })}
                />
                <div className="mt-4">
                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Main Content (Markdown/HTML supported)</label>
                    <textarea
                        value={data.content}
                        onChange={(e) => setData({ ...data, content: e.target.value })}
                        placeholder="Enter the full text content for this page..."
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-orange)] outline-none min-h-[400px] leading-relaxed font-mono"
                    />
                </div>
            </Section>
        </div>
    );
};

export default PageEditor;
