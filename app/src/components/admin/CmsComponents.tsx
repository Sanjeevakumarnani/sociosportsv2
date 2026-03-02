import { Trash2, Plus } from 'lucide-react';

export const Section = ({ title, children, onAdd, className = '' }: any) => (
    <div className={`bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-8 ${className}`}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase">{title}</h2>
            {onAdd && (
                <button onClick={onAdd} className="text-xs bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Item
                </button>
            )}
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

export const Input = ({ label, value, onChange, type = "text", placeholder = "", className = "" }: any) => (
    <div className={className}>
        {label && <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">{label}</label>}
        {type === 'textarea' ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-orange)] outline-none resize-none"
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-orange)] outline-none"
            />
        )}
    </div>
);

export const RemoveBtn = ({ onClick }: any) => (
    <button onClick={onClick} className="absolute -top-2 -right-2 bg-red-500/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Trash2 className="w-3 h-3 text-white" />
    </button>
);
