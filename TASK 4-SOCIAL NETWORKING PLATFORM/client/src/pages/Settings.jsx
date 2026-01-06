import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
    MdOutlinePalette,
    MdOutlineAccountCircle,
    MdOutlineLock,
    MdOutlineNotifications,
    MdOutlinePrivacyTip,
    MdCheckCircle
} from 'react-icons/md';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = useState('display');

    const sections = [
        { id: 'display', name: 'Display & Accessibility', icon: <MdOutlinePalette size={24} /> },
        { id: 'account', name: 'Account Settings', icon: <MdOutlineAccountCircle size={24} /> },
        { id: 'security', name: 'Security & Login', icon: <MdOutlineLock size={24} /> },
        { id: 'notifications', name: 'Notifications', icon: <MdOutlineNotifications size={24} /> },
        { id: 'privacy', name: 'Privacy Settings', icon: <MdOutlinePrivacyTip size={24} /> },
    ];

    const themes = [
        { id: 'light', name: 'Light Mode', desc: 'Classic clean look', colors: ['#f8fafc', '#6366f1'] },
        { id: 'dark', name: 'Dark Mode', desc: 'Easier on the eyes', colors: ['#0f172a', '#818cf8'] },
        { id: 'modern', name: 'Modern Dark', desc: 'Sleek black aesthetic', colors: ['#000000', '#00ff88'] },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="glass-card rounded-2xl p-4 sticky top-24">
                    <h2 className="text-xl font-bold mb-6 px-4 theme-text-primary">Settings</h2>
                    <nav className="space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeSection === section.id
                                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-500 font-medium'
                                    : 'hover:theme-bg-inner theme-text-muted hover:theme-text-primary'
                                    }`}
                            >
                                {section.icon}
                                {section.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow">
                <div className="glass-card rounded-2xl p-6 md:p-8 min-h-[600px]">
                    {activeSection === 'display' && (
                        <div className="fade-in">
                            <h3 className="text-2xl font-bold theme-text-primary mb-2">Display & Accessibility</h3>
                            <p className="theme-text-muted mb-8">Customize your viewing experience</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-semibold mb-4">Color Theme</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {themes.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => toggleTheme(t.id)}
                                                className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${theme === t.id
                                                    ? 'border-indigo-500 bg-indigo-500/5'
                                                    : 'border-transparent theme-bg-inner'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-1">
                                                        {t.colors.map((c, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-4 h-4 rounded-full border border-white/20"
                                                                style={{ backgroundColor: c }}
                                                            />
                                                        ))}
                                                    </div>
                                                    {theme === t.id && (
                                                        <MdCheckCircle className="text-indigo-500" size={20} />
                                                    )}
                                                </div>
                                                <div className="font-semibold theme-text-primary">{t.name}</div>
                                                <div className="text-xs theme-text-muted">{t.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <hr className="theme-border" />

                                <div>
                                    <h4 className="text-lg font-semibold theme-text-primary mb-2">Font Size</h4>
                                    <p className="text-sm theme-text-muted mb-4">Coming soon...</p>
                                    <div className="h-2 w-full theme-bg-inner rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-1/2 opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection !== 'display' && (
                        <div className="flex flex-col items-center justify-center h-[500px] text-center opacity-50">
                            <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mb-4">
                                {sections.find(s => s.id === activeSection)?.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{sections.find(s => s.id === activeSection)?.name}</h3>
                            <p>This feature is coming soon to your social experience.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
