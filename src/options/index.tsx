import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RuleGroup, Settings } from '../types';

// Import components
import Loading from './components/Loading';
import TabNav, { TabType } from './components/TabNav';
import GeneralSettings from './components/GeneralSettings';
import RulesManager from './components/RulesManager';
import ImportExport from './components/ImportExport';

// Main Options Page Component
const OptionsPage: React.FC = () => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<TabType>('general');

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await chrome.storage.sync.get(['settings', 'ruleGroups']);
                setSettings(data.settings || null);
                setRuleGroups(data.ruleGroups || []);
            } catch (error) {
                console.error('Error loading options data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleToggleExtension = () => {
        if (!settings) return;

        const newSettings = { ...settings, enabled: !settings.enabled };
        saveSettings(newSettings);
    };

    const handleToggleAutoRedirect = () => {
        if (!settings) return;

        const newSettings = { ...settings, autoRedirect: !settings.autoRedirect };
        saveSettings(newSettings);
    };

    const handleRedirectDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) return;

        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) return;

        const newSettings = { ...settings, redirectDelay: value };
        saveSettings(newSettings);
    };

    const saveSettings = (newSettings: Settings) => {
        chrome.storage.sync.set({ settings: newSettings });
        setSettings(newSettings);
    };

    const handleUpdateRuleGroups = (newRuleGroups: RuleGroup[]) => {
        chrome.storage.sync.set({ ruleGroups: newRuleGroups });
        setRuleGroups(newRuleGroups);
    };

    const handleExportRules = () => {
        // Create a downloadable JSON file
        const dataStr = JSON.stringify({ ruleGroups }, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

        const exportName = `url-switch-rules-${new Date().toISOString().slice(0, 10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
    };

    const handleImportRules = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);

                if (data.ruleGroups && Array.isArray(data.ruleGroups)) {
                    handleUpdateRuleGroups(data.ruleGroups);
                    alert('Rules imported successfully');
                } else {
                    alert('Invalid import file format');
                }
            } catch (error) {
                console.error('Error parsing import file:', error);
                alert('Error importing rules');
            }
        };

        reader.readAsText(file);
    };

    if (isLoading || !settings) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">URL Switch Options</h1>

            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'general' && (
                <GeneralSettings
                    settings={settings}
                    onToggleExtension={handleToggleExtension}
                    onToggleAutoRedirect={handleToggleAutoRedirect}
                    onRedirectDelayChange={handleRedirectDelayChange}
                />
            )}

            {activeTab === 'rules' && (
                <RulesManager
                    ruleGroups={ruleGroups}
                    onUpdateRuleGroups={handleUpdateRuleGroups}
                />
            )}

            {activeTab === 'import' && (
                <ImportExport
                    onExportRules={handleExportRules}
                    onImportRules={handleImportRules}
                />
            )}
        </div>
    );
};

// Render the options page
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<OptionsPage />);
} 