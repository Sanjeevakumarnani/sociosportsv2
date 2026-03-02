import { useState, useEffect } from 'react';
import { Save, Loader2, Briefcase, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { Section, Input, RemoveBtn } from '../../../components/admin/CmsComponents';

const JobsPageCms = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [data, setData] = useState({
        hero: {
            title: 'BUILD THE FUTURE OF SPORTS.',
            description: 'Join the team revolutionizing India\'s sports ecosystem. We are looking for passionate individuals to drive our mission forward.'
        },
        jobs: [
            {
                id: 1,
                role: 'Event Coordinator',
                org: 'SocioSports Operations',
                location: 'Hyderabad, On-site',
                type: 'Full-time',
                salary: '₹4.5L - ₹6L',
                desc: 'Manage end-to-end execution of our SportsOnWheels tournaments.',
                requirements: ['3+ years event management experience', 'Strong leadership skills']
            }
        ]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const content = await api.cms.get('jobs-page');
            if (content && content.content) {
                setData(prev => ({ ...prev, ...JSON.parse(content.content) }));
            }
        } catch (error) {
            console.error('Failed to load Jobs content', error);
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
            await api.cms.update('jobs-page', {
                title: 'Jobs Page',
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

    // Generic Helpers
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

    // Requirement Helpers
    const updateRequirement = (jobIndex: number, reqIndex: number, value: string) => {
        const jobs = [...data.jobs];
        jobs[jobIndex].requirements[reqIndex] = value;
        setData({ ...data, jobs });
    };

    const addRequirement = (jobIndex: number) => {
        const jobs = [...data.jobs];
        if (!jobs[jobIndex].requirements) jobs[jobIndex].requirements = [];
        jobs[jobIndex].requirements.push('New Requirement');
        setData({ ...data, jobs });
    };

    const removeRequirement = (jobIndex: number, reqIndex: number) => {
        const jobs = [...data.jobs];
        jobs[jobIndex].requirements.splice(reqIndex, 1);
        setData({ ...data, jobs });
    };

    if (loading) return <div className="text-[var(--text-primary)] p-8">Loading CMS...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Jobs <span className="text-[var(--accent-orange)]">Editor</span></h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            {/* Hero */}
            <Section title="Hero Section">
                <div className="grid grid-cols-1 gap-6">
                    <Input label="Main Title" value={data.hero.title} onChange={(v: string) => updateNested('hero', 'title', v)} />
                    <Input label="Description" value={data.hero.description} onChange={(v: string) => updateNested('hero', 'description', v)} type="textarea" />
                </div>
            </Section>

            {/* Job Listings */}
            <Section title="Job Openings" onAdd={() => addItem('jobs', {
                id: Date.now(),
                role: 'New Role',
                org: 'Organization',
                location: 'Location',
                type: 'Type',
                salary: 'Salary',
                desc: 'Description',
                requirements: []
            })}>
                {data.jobs.map((job: any, i: number) => (
                    <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] p-6 rounded-xl relative group space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Role Title" value={job.role} onChange={(v: string) => updateItem('jobs', i, 'role', v)} />
                            <Input label="Organization" value={job.org} onChange={(v: string) => updateItem('jobs', i, 'org', v)} />
                            <Input label="Location" value={job.location} onChange={(v: string) => updateItem('jobs', i, 'location', v)} />
                            <Input label="Employment Type" value={job.type} onChange={(v: string) => updateItem('jobs', i, 'type', v)} />
                            <Input label="Salary Range" value={job.salary} onChange={(v: string) => updateItem('jobs', i, 'salary', v)} />
                        </div>
                        <Input label="Job Description" value={job.desc} onChange={(v: string) => updateItem('jobs', i, 'desc', v)} type="textarea" />

                        {/* Requirements */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">Key Requirements</label>
                            {job.requirements?.map((req: string, rIdx: number) => (
                                <div key={rIdx} className="flex gap-2">
                                    <input
                                        value={req}
                                        onChange={(e) => updateRequirement(i, rIdx, e.target.value)}
                                        className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)]"
                                    />
                                    <button onClick={() => removeRequirement(i, rIdx)} className="text-red-500 hover:text-red-400">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => addRequirement(i)} className="text-xs text-[var(--accent-orange)] hover:underline">+ Add Requirement</button>
                        </div>

                        <RemoveBtn onClick={() => removeItem('jobs', i)} />
                    </div>
                ))}
            </Section>

        </div>
    );
};

export default JobsPageCms;
