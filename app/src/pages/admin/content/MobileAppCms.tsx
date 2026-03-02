import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { Section, Input, RemoveBtn } from '../../../components/admin/CmsComponents';

const MobileAppCms = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [data, setData] = useState({
        hero: {
            title: 'YOUR SPORTS IN YOUR POCKET.',
            subtitle: 'Available Now',
            description: 'The full power of the SocioSports ecosystem. Verified stats, instant bookings, and community connection.',
            androidLink: 'https://play.google.com/store/apps/details?id=com.sociobeats&pcampaignid=web_share',
            iosLink: '#'
        },
        modal: {
            title: "Shhh... You're Early.",
            subtitle: 'Stealth Mode',
            description: 'The ultimate sports ecosystem is currently in Stealth Mode. We are crafting an experience that will redefine how you play. Access is rolling out soon.'
        },
        features: [
            { title: "Verified Sports ID", desc: "Your digital passport for tournaments and trials." },
            { title: "Smart Alerts", desc: "Instant notifications for tournament registrations and results." },
            { title: "Live Scores", desc: "Real-time updates from ongoing matches in your network." },
            { title: "Easy Booking", desc: "Book turfs, coaches, and events in 3 taps." }
        ],
        steps: [
            { step: 'Step 1', title: 'Create Profile' },
            { step: 'Step 2', title: 'Discover & Connect' },
            { step: 'Step 3', title: 'Book & Play' },
            { step: 'Step 4', title: 'Grow & Earn' }
        ]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const content = await api.cms.get('mobile-app');
            if (content && content.content) {
                const parsed = JSON.parse(content.content);
                setData(prev => ({ ...prev, ...parsed }));
            }
        } catch (error) {
            console.error('Failed to load Mobile App content', error);
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
            await api.cms.update('mobile-app', {
                title: 'Mobile App Page',
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

    // Generic helper to update nested object fields
    const updateNested = (section: keyof typeof data, field: string, value: string) => {
        setData({
            ...data,
            [section]: {
                ...data[section],
                [field]: value
            }
        });
    };

    // Generic helper to update item in array
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

    if (loading) return <div className="text-[var(--text-primary)] p-8">Loading CMS...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Mobile App <span className="text-[var(--accent-orange)]">Editor</span></h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            {/* Hero Section */}
            <Section title="Hero Section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Main Title" value={data.hero.title} onChange={(v: string) => updateNested('hero', 'title', v)} />
                    <Input label="Subtitle (Pill)" value={data.hero.subtitle} onChange={(v: string) => updateNested('hero', 'subtitle', v)} />
                    <div className="md:col-span-2">
                        <Input label="Description" value={data.hero.description} onChange={(v: string) => updateNested('hero', 'description', v)} type="textarea" />
                    </div>
                    <Input label="iOS Store Link" value={data.hero.iosLink} onChange={(v: string) => updateNested('hero', 'iosLink', v)} />
                    <Input label="Android Store Link" value={data.hero.androidLink} onChange={(v: string) => updateNested('hero', 'androidLink', v)} />
                </div>
            </Section>

            {/* Mystery Modal Section */}
            <Section title="Mystery Modal (Stealth Mode)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Modal Title" value={data.modal.title} onChange={(v: string) => updateNested('modal', 'title', v)} />
                    <Input label="Modal Subtitle" value={data.modal.subtitle} onChange={(v: string) => updateNested('modal', 'subtitle', v)} />
                    <div className="md:col-span-2">
                        <Input label="Modal Message" value={data.modal.description} onChange={(v: string) => updateNested('modal', 'description', v)} type="textarea" />
                    </div>
                </div>
            </Section>

            {/* Features */}
            <Section title="App Features" onAdd={() => addItem('features', { title: 'New Feature', desc: 'Description' })}>
                {data.features?.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group">
                        <Input label="Title" value={item.title} onChange={(v: string) => updateItem('features', i, 'title', v)} />
                        <Input label="Description" value={item.desc} onChange={(v: string) => updateItem('features', i, 'desc', v)} />
                        <RemoveBtn onClick={() => removeItem('features', i)} />
                    </div>
                ))}
            </Section>

            {/* Screen Steps */}
            <Section title="Screen Flow Steps" onAdd={() => addItem('steps', { step: 'Step X', title: 'Action Name' })}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {data.steps?.map((item: any, i: number) => (
                        <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl relative group space-y-2">
                            <Input label="Step Label" value={item.step} onChange={(v: string) => updateItem('steps', i, 'step', v)} />
                            <Input label="Step Title" value={item.title} onChange={(v: string) => updateItem('steps', i, 'title', v)} />
                            <RemoveBtn onClick={() => removeItem('steps', i)} />
                        </div>
                    ))}
                </div>
            </Section>

        </div>
    );
};

export default MobileAppCms;
