import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import ImageUpload from '../../../components/common/ImageUpload';
import { useNavigate } from 'react-router-dom';

const AboutPageCms = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Default structure matching AboutUsPage.tsx
    const [data, setData] = useState({
        missionPoints: [
            { title: 'Empowerment', desc: 'Digital identity for athletes.' },
            { title: 'Sustainability', desc: 'Sustainable sports careers.' }
        ],
        coreValues: [
            { title: 'Community First', desc: 'Strengthening real-world bonds.' }
        ],
        companyInfo: [
            { label: 'Company Name', value: 'ViranAI Solutions' },
        ],
        leadership: [
            { name: 'Phanindra KKV', role: 'Founder & CEO', image: '/images/team_phanindra.png', bio: 'Bio here...', quote: 'Quote here...' }
        ]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const content = await api.cms.get('about-us');
            if (content && content.content) {
                setData(JSON.parse(content.content));
            }
        } catch (error) {
            console.error('Failed to load about content', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }
            await api.cms.update('about-us', {
                title: 'About Us Page',
                content: JSON.stringify(data)
            }, token);
            alert('About Us page updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    // Generic helper to update item in array
    const updateItem = (section: keyof typeof data, index: number, field: string, value: string) => {
        const list = [...data[section]] as any[];
        list[index][field] = value;
        setData({ ...data, [section]: list });
    };

    // Generic helper to remove item
    const removeItem = (section: keyof typeof data, index: number) => {
        const list = [...data[section]] as any[];
        list.splice(index, 1);
        setData({ ...data, [section]: list });
    };

    // Generic helper to add item
    const addItem = (section: keyof typeof data, template: any) => {
        setData({ ...data, [section]: [...(data[section] || []), template] });
    };

    if (loading) return <div className="text-[var(--text-primary)] p-8">Loading CMS...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">About Us <span className="text-[var(--accent-orange)]">Editor</span></h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            {/* Mission Points */}
            <Section title="Vision & Mission Points" onAdd={() => addItem('missionPoints', { title: 'New', desc: 'Description' })}>
                {data.missionPoints?.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group">
                        <Input label="Title" value={item.title} onChange={(v: string) => updateItem('missionPoints', i, 'title', v)} />
                        <Input label="Description" value={item.desc} onChange={(v: string) => updateItem('missionPoints', i, 'desc', v)} />
                        <RemoveBtn onClick={() => removeItem('missionPoints', i)} />
                    </div>
                ))}
            </Section>

            {/* Core Values */}
            <Section title="Core Values (DNA)" onAdd={() => addItem('coreValues', { title: 'Value', desc: 'Description' })}>
                {data.coreValues?.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group">
                        <Input label="Value" value={item.title} onChange={(v: string) => updateItem('coreValues', i, 'title', v)} />
                        <Input label="Description" value={item.desc} onChange={(v: string) => updateItem('coreValues', i, 'desc', v)} />
                        <RemoveBtn onClick={() => removeItem('coreValues', i)} />
                    </div>
                ))}
            </Section>

            {/* Company Info */}
            <Section title="Company Info" onAdd={() => addItem('companyInfo', { label: 'Label', value: 'Value' })}>
                {data.companyInfo?.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group">
                        <Input label="Label" value={item.label} onChange={(v: string) => updateItem('companyInfo', i, 'label', v)} />
                        <Input label="Value" value={item.value} onChange={(v: string) => updateItem('companyInfo', i, 'value', v)} />
                        <RemoveBtn onClick={() => removeItem('companyInfo', i)} />
                    </div>
                ))}
            </Section>

            {/* Leadership */}
            <Section title="Leadership Team" onAdd={() => addItem('leadership', { name: 'Name', role: 'Role', image: '', bio: '', quote: '' })}>
                {data.leadership?.map((item: any, i: number) => (
                    <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl relative group space-y-4">
                        <div className="flex gap-4">
                            <div className="w-24 h-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shrink-0 relative overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} className="w-full h-full object-cover" />
                                ) : <ImageIcon className="w-8 h-8 m-auto mt-8 text-[var(--text-secondary)]" />}
                                <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/60 flex items-center justify-center transition-opacity">
                                    <ImageUpload label=" " onChange={(url: string) => updateItem('leadership', i, 'image', url)} />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Name" value={item.name} onChange={(v: string) => updateItem('leadership', i, 'name', v)} />
                                    <Input label="Role" value={item.role} onChange={(v: string) => updateItem('leadership', i, 'role', v)} />
                                </div>
                                <Input label="Bio" value={item.bio} onChange={(v: string) => updateItem('leadership', i, 'bio', v)} />
                                <Input label="Quote" value={item.quote} onChange={(v: string) => updateItem('leadership', i, 'quote', v)} />
                            </div>
                        </div>
                        <RemoveBtn onClick={() => removeItem('leadership', i)} />
                    </div>
                ))}
            </Section>

        </div>
    );
};

import { Section, Input, RemoveBtn } from '../../../components/admin/CmsComponents';

export default AboutPageCms;
