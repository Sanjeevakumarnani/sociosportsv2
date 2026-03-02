import { useState, useEffect } from 'react';
import { Save, Loader2, Globe } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { Section, Input } from '../../../components/admin/CmsComponents';

const SettingsCms = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [data, setData] = useState({
        contact: {
            email: 'info@sociosports.com',
            phone: '+91 7842983839',
            address: 'Plot 417, Vasanth Nagar, KPHB 9th Phase, Hyderabad, Telangana - 500085'
        },
        socials: {
            instagram: 'https://instagram.com/sociosports',
            linkedin: 'https://linkedin.com/company/sociosports',
            twitter: 'https://twitter.com/sociosports',
            youtube: 'https://youtube.com/@sociosports'
        }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const content = await api.cms.get('global-settings');
            if (content && content.content) {
                setData(prev => ({ ...prev, ...JSON.parse(content.content) }));
            }
        } catch (error) {
            console.error('Failed to load Global Settings', error);
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
            await api.cms.update('global-settings', {
                title: 'Global Settings',
                content: JSON.stringify(data)
            }, token);
            alert('Settings updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const updateNested = (section: keyof typeof data, field: string, value: string) => {
        setData({
            ...data,
            [section]: {
                ...data[section],
                [field]: value
            }
        });
    };

    if (loading) return <div className="text-[var(--text-primary)] p-8">Loading Settings...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Global <span className="text-[var(--accent-orange)]">Settings</span></h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            <Section title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Support Email" value={data.contact.email} onChange={(v: string) => updateNested('contact', 'email', v)} />
                    <Input label="Phone Number" value={data.contact.phone} onChange={(v: string) => updateNested('contact', 'phone', v)} />
                    <div className="md:col-span-2">
                        <Input label="Physical Address" value={data.contact.address} onChange={(v: string) => updateNested('contact', 'address', v)} />
                    </div>
                </div>
            </Section>

            <Section title="Social Media Links">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Instagram URL" value={data.socials.instagram} onChange={(v: string) => updateNested('socials', 'instagram', v)} />
                    <Input label="LinkedIn URL" value={data.socials.linkedin} onChange={(v: string) => updateNested('socials', 'linkedin', v)} />
                    <Input label="Twitter / X URL" value={data.socials.twitter} onChange={(v: string) => updateNested('socials', 'twitter', v)} />
                    <Input label="YouTube URL" value={data.socials.youtube} onChange={(v: string) => updateNested('socials', 'youtube', v)} />
                </div>
            </Section>
        </div>
    );
};

export default SettingsCms;
