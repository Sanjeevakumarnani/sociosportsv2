import { useState, useRef } from 'react';
import { Palette, Crown, Zap, Waves, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useFocusTrap(switcherRef, isOpen, () => setIsOpen(false));

  const themes = [
    { id: 'navy', name: 'Deep Navy', icon: Waves, color: '#FF4D2E' },
    { id: 'gold', name: 'Royal Gold', icon: Crown, color: '#F59E0B' },
    { id: 'blue', name: 'Light Navy', icon: Zap, color: '#1870cb' },
    { id: 'light', name: 'Light Mode', icon: Sun, color: '#E8432A' },
  ] as const;

  return (
    <div className="fixed top-24 right-4 z-50" ref={switcherRef}>
      <div className="relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Change platform theme"
          aria-expanded={isOpen}
          aria-haspopup="true"
          className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <Palette className="w-5 h-5 text-[var(--accent-orange)]" aria-hidden="true" />
        </button>

        {/* Theme Options */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-3 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id as 'navy' | 'gold' | 'blue' | 'light');
                      setIsOpen(false);
                    }}
                    aria-label={`Switch to ${t.name} theme`}
                    aria-pressed={isActive}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 min-w-[160px] ${isActive
                      ? 'bg-[var(--bg-primary)] ring-2 ring-[var(--border)]'
                      : 'hover:bg-[var(--bg-primary)]/50'
                      }`}
                    style={{
                      ringColor: isActive ? t.color : 'transparent',
                      '--tw-ring-color': t.color
                    } as React.CSSProperties}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${t.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: t.color }} />
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {t.name}
                    </span>
                    {isActive && (
                      <div
                        className="ml-auto w-2 h-2 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-secondary)] text-center">
                Choose your theme
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
