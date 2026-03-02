import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import ImageUpload from '../../../components/common/ImageUpload';
import { useNavigate } from 'react-router-dom';

const SportsOnWheelsCms = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Default structure matching SportsOnWheelsPage.tsx
    const [data, setData] = useState({
        features: [
            { title: '60-Minute Setup', desc: 'Rapid deployment infrastructure.' }
        ],
        sectors: [
            { id: 'residential', title: 'Housing Societies', image: '/images/sow_01.jpg', points: ['Point 1'] }
        ],
        eventFlow: [
            { step: '01', title: 'Request an Event', desc: 'Tell us your location.' }
        ],
        safetyItems: [
            'Trained coordinators and first-aid support'
        ]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const content = await api.cms.get('sports-on-wheels');
            if (content && content.content) {
                setData(JSON.parse(content.content));
            }
        } catch (error) {
            console.error('Failed to load SOW content', error);
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
            await api.cms.update('sports-on-wheels', {
                title: 'Sports On Wheels Page',
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

    // Generic helper to update item in array
    const updateItem = (section: keyof typeof data, index: number, field: string, value: string) => {
        const list = [...data[section]] as any[];
        list[index][field] = value;
        setData({ ...data, [section]: list });
    };

    // Helper for simple string arrays (safetyItems)
    const updateStringItem = (section: keyof typeof data, index: number, value: string) => {
        const list = [...data[section]] as string[];
        list[index] = value;
        setData({ ...data, [section]: list });
    };

    // Helper for Sector Points (array of strings inside object)
    const updateSectorPoint = (sectorIndex: number, pointIndex: number, value: string) => {
        const newSectors = [...data.sectors];
        newSectors[sectorIndex].points[pointIndex] = value;
        setData({ ...data, sectors: newSectors });
    };

    // Helper to add Sector Point
    const addSectorPoint = (sectorIndex: number) => {
        const newSectors = [...data.sectors];
        if (!newSectors[sectorIndex].points) newSectors[sectorIndex].points = [];
        newSectors[sectorIndex].points.push('New Point');
        setData({ ...data, sectors: newSectors });
    };

    // Helper to remove Sector Point
    const removeSectorPoint = (sectorIndex: number, pointIndex: number) => {
        const newSectors = [...data.sectors];
        newSectors[sectorIndex].points.splice(pointIndex, 1);
        setData({ ...data, sectors: newSectors });
    };

    // Generic helper to remove item
    const removeItem = (section: keyof typeof data, index: number) => {
        const list = [...data[section]];
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
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Sports On Wheels <span className="text-[var(--accent-orange)]">Editor</span></h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            {/* Core Features */}
            <Section title="Core Features" onAdd={() => addItem('features', { title: 'New Feature', desc: 'Description' })}>
                {data.features?.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group">
                        <Input label="Title" value={item.title} onChange={(v: string) => updateItem('features', i, 'title', v)} />
                        <Input label="Description" value={item.desc} onChange={(v: string) => updateItem('features', i, 'desc', v)} />
                        <RemoveBtn onClick={() => removeItem('features', i)} />
                    </div>
                ))}
            </Section>

            {/* Event Flow */}
            <Section title="Event Flow Steps" onAdd={() => addItem('eventFlow', { step: '0X', title: 'Step Title', desc: 'Description' })}>
                {data.eventFlow?.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group">
                        <Input label="Step #" value={item.step} onChange={(v: string) => updateItem('eventFlow', i, 'step', v)} />
                        <Input label="Title" value={item.title} onChange={(v: string) => updateItem('eventFlow', i, 'title', v)} />
                        <Input label="Description" value={item.desc} onChange={(v: string) => updateItem('eventFlow', i, 'desc', v)} />
                        <RemoveBtn onClick={() => removeItem('eventFlow', i)} />
                    </div>
                ))}
            </Section>

            {/* Sectors */}
            <Section title="Sectors Supported" onAdd={() => addItem('sectors', { id: 'new', title: 'New Sector', image: '', points: [] })}>
                {data.sectors?.map((item: any, i: number) => (
                    <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl relative group space-y-4">
                        <div className="flex gap-4">
                            <div className="w-32 h-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shrink-0 relative overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} className="w-full h-full object-cover" />
                                ) : <ImageIcon className="w-8 h-8 m-auto mt-8 text-[var(--text-secondary)]" />}
                                <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/60 flex items-center justify-center transition-opacity">
                                    <ImageUpload label=" " onChange={(url: string) => updateItem('sectors', i, 'image', url)} />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <Input label="Title" value={item.title} onChange={(v: string) => updateItem('sectors', i, 'title', v)} />

                                {/* Points List for this Sector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">Key Points</label>
                                    {item.points?.map((pt: string, ptIndex: number) => (
                                        <div key={ptIndex} className="flex gap-2">
                                            <input
                                                value={pt}
                                                onChange={(e) => updateSectorPoint(i, ptIndex, e.target.value)}
                                                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)]"
                                            />
                                            <button onClick={() => removeSectorPoint(i, ptIndex)} className="text-red-500 hover:text-red-400">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addSectorPoint(i)} className="text-xs text-[var(--accent-orange)] hover:underline">+ Add Point</button>
                                </div>
                            </div>
                        </div>
                        <RemoveBtn onClick={() => removeItem('sectors', i)} />
                    </div>
                ))}
            </Section>

            {/* Safety Items */}
            <Section title="Safety Items" onAdd={() => addItem('safetyItems', 'New Safety Rule')}>
                {data.safetyItems?.map((item: string, i: number) => (
                    <div key={i} className="flex gap-4 bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group items-center">
                        <input
                            value={item}
                            onChange={(e) => updateStringItem('safetyItems', i, e.target.value)}
                            className="flex-1 bg-transparent border-b border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none"
                        />
                        <RemoveBtn onClick={() => removeItem('safetyItems', i)} />
                    </div>
                ))}
            </Section>

        </div>
    );
};

import { Section, Input, RemoveBtn } from '../../../components/admin/CmsComponents';

export default SportsOnWheelsCms;
