import { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { Section, Input, RemoveBtn } from '../../../components/admin/CmsComponents';
import ImageUpload from '../../../components/common/ImageUpload';

const VendorsPageCms = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [data, setData] = useState({
        hero: {
            subtitle: 'Partner Gateway',
            title: 'SCALE YOUR BUSINESS.',
            description: 'Join India\'s premier sports ecosystem. Access massive footfall, build institutional credibility, and connect directly with verified athletes.'
        },
        benefits: [
            { title: 'Direct Monetization', desc: 'Turn spectators into customers.', stats: '3-4x ROI' }
        ],
        stallTypes: [
            {
                name: 'Retail Pop-up',
                image: '/images/vendor_retail.png',
                desc: 'Maximum exposure for sports gear.',
                features: ['10x10 FT Tent', '2 Display Tables']
            }
        ],
        steps: [
            { step: '01', title: 'Register', desc: 'Secure your spot through our digital portal.' }
        ]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const content = await api.cms.get('vendors-page');
            if (content && content.content) {
                setData(prev => ({ ...prev, ...JSON.parse(content.content) }));
            }
        } catch (error) {
            console.error('Failed to load Vendors content', error);
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
            await api.cms.update('vendors-page', {
                title: 'Vendors Page',
                content: JSON.stringify(data)
            }, token);
            alert('Page updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    // Helpers
    const updateNested = (section: keyof typeof data, field: string, value: string) => {
        setData({
            ...data,
            [section]: {
                ...data[section],
                [field]: value
            }
        });
    };

    const updateItem = (section: keyof typeof data, index: number, field: string, value: string) => {
        // @ts-expect-error: Array spreading of generic CMS data
        const list = [...data[section]];
        list[index][field] = value;
        setData({ ...data, [section]: list });
    };

    const removeItem = (section: keyof typeof data, index: number) => {
        const list = [...data[section]];
        list.splice(index, 1);
        setData({ ...data, [section]: list });
    };

    const addItem = (section: keyof typeof data, template: any) => {
        setData({ ...data, [section]: [...(data[section] || []), template] });
    };

    // Special Helper for Stall Features (Array of strings inside Array of Objects)
    const updateStallFeature = (stallIndex: number, featureIndex: number, value: string) => {
        const stalls = [...data.stallTypes];
        stalls[stallIndex].features[featureIndex] = value;
        setData({ ...data, stallTypes: stalls });
    };

    const addStallFeature = (stallIndex: number) => {
        const stalls = [...data.stallTypes];
        if (!stalls[stallIndex].features) stalls[stallIndex].features = [];
        stalls[stallIndex].features.push('New Feature');
        setData({ ...data, stallTypes: stalls });
    };

    const removeStallFeature = (stallIndex: number, featureIndex: number) => {
        const stalls = [...data.stallTypes];
        stalls[stallIndex].features.splice(featureIndex, 1);
        setData({ ...data, stallTypes: stalls });
    };


    if (loading) return <div className="text-[var(--text-primary)] p-8">Loading CMS...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Vendors <span className="text-[var(--accent-orange)]">Editor</span></h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            {/* Hero */}
            <Section title="Hero Section">
                <div className="grid grid-cols-1 gap-6">
                    <Input label="Subtitle (Pill)" value={data.hero.subtitle} onChange={(v: string) => updateNested('hero', 'subtitle', v)} />
                    <Input label="Main Title" value={data.hero.title} onChange={(v: string) => updateNested('hero', 'title', v)} />
                    <Input label="Description" value={data.hero.description} onChange={(v: string) => updateNested('hero', 'description', v)} type="textarea" />
                </div>
            </Section>

            {/* Benefits */}
            <Section title="Vendor Benefits" onAdd={() => addItem('benefits', { title: 'Benefit', desc: 'Description', stats: 'Stat' })}>
                {data.benefits.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group">
                        <Input label="Title" value={item.title} onChange={(v: string) => updateItem('benefits', i, 'title', v)} />
                        <Input label="Description" value={item.desc} onChange={(v: string) => updateItem('benefits', i, 'desc', v)} />
                        <Input label="Stat/ROI" value={item.stats} onChange={(v: string) => updateItem('benefits', i, 'stats', v)} />
                        <RemoveBtn onClick={() => removeItem('benefits', i)} />
                    </div>
                ))}
            </Section>

            {/* Steps */}
            <Section title="Registration Steps" onAdd={() => addItem('steps', { step: '0X', title: 'Step', desc: 'Description' })}>
                {data.steps.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group">
                        <Input label="Step #" value={item.step} onChange={(v: string) => updateItem('steps', i, 'step', v)} />
                        <Input label="Title" value={item.title} onChange={(v: string) => updateItem('steps', i, 'title', v)} />
                        <Input label="Description" value={item.desc} onChange={(v: string) => updateItem('steps', i, 'desc', v)} />
                        <RemoveBtn onClick={() => removeItem('steps', i)} />
                    </div>
                ))}
            </Section>

            {/* Stall Types */}
            <Section title="Stall Configurations" onAdd={() => addItem('stallTypes', { name: 'New Stall', image: '', desc: '', features: [] })}>
                {data.stallTypes.map((stall: any, i: number) => (
                    <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl relative group space-y-4">
                        <div className="flex gap-6">
                            <div className="w-40 h-40 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shrink-0 relative overflow-hidden">
                                {stall.image ? (
                                    <img src={stall.image} className="w-full h-full object-cover" />
                                ) : <ImageIcon className="w-10 h-10 m-auto mt-16 text-[var(--text-secondary)]" />}
                                <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/60 flex items-center justify-center transition-opacity">
                                    <ImageUpload label=" " onChange={(url: string) => updateItem('stallTypes', i, 'image', url)} />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <Input label="Stall Name" value={stall.name} onChange={(v: string) => updateItem('stallTypes', i, 'name', v)} />
                                <Input label="Description" value={stall.desc} onChange={(v: string) => updateItem('stallTypes', i, 'desc', v)} />

                                {/* Features List */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">Amenities / Features</label>
                                    {stall.features?.map((feat: string, fIdx: number) => (
                                        <div key={fIdx} className="flex gap-2">
                                            <input
                                                value={feat}
                                                onChange={(e) => updateStallFeature(i, fIdx, e.target.value)}
                                                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)]"
                                            />
                                            <button onClick={() => removeStallFeature(i, fIdx)} className="text-red-500 hover:text-red-400">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addStallFeature(i)} className="text-xs text-[var(--accent-orange)] hover:underline">+ Add Feature</button>
                                </div>
                            </div>
                        </div>
                        <RemoveBtn onClick={() => removeItem('stallTypes', i)} />
                    </div>
                ))}
            </Section>

        </div>
    );
};

export default VendorsPageCms;
