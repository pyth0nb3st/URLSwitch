import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Settings, RuleMatch } from '../types';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import RedirectsList from './components/RedirectsList';

// Main Popup Component
const Popup: React.FC = () => {
    const [currentUrl, setCurrentUrl] = useState<string>('');
    const [redirectMatches, setRedirectMatches] = useState<RuleMatch[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Get all redirect matches for current tab
                const response = await chrome.runtime.sendMessage({
                    action: 'getAllRedirectsForCurrentTab'
                });

                setCurrentUrl(response.currentUrl);
                setRedirectMatches(response.matches || []);

                // Get settings
                const { settings } = await chrome.storage.sync.get('settings');
                setSettings(settings || null);
            } catch (error) {
                console.error('Error loading popup data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleRedirect = (targetUrl: string) => {
        chrome.runtime.sendMessage({
            action: 'performRedirect',
            targetUrl
        });
        window.close(); // Close popup after redirect
    };

    const toggleExtension = () => {
        if (!settings) return;

        const newSettings = { ...settings, enabled: !settings.enabled };
        chrome.storage.sync.set({ settings: newSettings });
        setSettings(newSettings);

        chrome.runtime.sendMessage({
            action: 'toggleExtension',
            enabled: newSettings.enabled
        });
    };

    const toggleAutoRedirect = () => {
        if (!settings) return;

        const newSettings = { ...settings, autoRedirect: !settings.autoRedirect };
        chrome.storage.sync.set({ settings: newSettings });
        setSettings(newSettings);

        chrome.runtime.sendMessage({
            action: 'updateSettings',
            settings: { autoRedirect: newSettings.autoRedirect }
        });
    };

    const openOptions = () => {
        chrome.runtime.openOptionsPage();
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="p-4 min-w-[320px]">
            <Header settings={settings} onToggleExtension={toggleExtension} />

            <RedirectsList
                matches={redirectMatches}
                currentUrl={currentUrl}
                onRedirect={handleRedirect}
            />

            <Footer
                settings={settings}
                onToggleAutoRedirect={toggleAutoRedirect}
                onOpenSettings={openOptions}
            />
        </div>
    );
};

// Render the popup
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<Popup />);
} 