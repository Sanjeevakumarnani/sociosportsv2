import { useState } from 'react';
import { Save, Loader2, Moon, Sun, Smartphone, Monitor } from 'lucide-react';
import type { Theme } from '../../contexts/ThemeContext';
import { useTheme } from '../../contexts/ThemeContext';
import AdminLayout from '../../layouts/AdminLayout';
import toast from 'react-hot-toast';

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                alert('Authentication required');
                return;
            }
            // Persistence is currently handled by App context, 
            // but we ensure it matches the landing page/api logic.
            localStorage.setItem('theme_preference', theme);

            // Artificial delay removed, logic confirmed.
            toast.success('Settings saved successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const themeOptions = [
        { id: 'navy', name: 'Deep Navy', desc: 'Default immersive dark theme', icon: Moon, color: '#0f172a' },
        { id: 'gold', name: 'Royal Gold', desc: 'Luxury dark theme with gold accents', icon: Smartphone, color: '#F59E0B' },
        { id: 'blue', name: 'Light Navy', desc: 'Brighter blue professional theme', icon: Monitor, color: '#1e40af' },
        { id: 'light', name: 'Light Mode', desc: 'Clean, bright daytime theme', icon: Sun, color: '#E8432A' },
    ];

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Settings</h1>
                        <p className="text-[var(--text-secondary)]">Manage your admin preferences.</p>
                    </div>
                    <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>

                {/* Theme Settings */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-[var(--accent-orange)]" />
                        Appearance
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {themeOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = theme === option.id;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setTheme(option.id as Theme)}
                                    className={`relative p-4 rounded-xl border-2 text-left transition-all group ${isActive
                                        ? 'border-[var(--accent-orange)] bg-[var(--bg-primary)]'
                                        : 'border-[var(--border)] hover:border-[var(--text-secondary)] bg-transparent'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`p-2 rounded-lg ${isActive ? 'bg-[var(--accent-orange)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {isActive && (
                                            <div className="w-3 h-3 rounded-full bg-[var(--accent-orange)]" />
                                        )}
                                    </div>
                                    <div className="font-bold text-[var(--text-primary)] mb-1">{option.name}</div>
                                    <div className="text-xs text-[var(--text-secondary)]">{option.desc}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Account Settings removed as per audit */}
            </div>
        </AdminLayout>
    );
};

export default Settings;
