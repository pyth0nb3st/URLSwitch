import React from 'react';
import { Settings, LanguageCode } from '../../types';
import ToggleSwitch from './ToggleSwitch';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../../hooks/useTranslation';

interface GeneralSettingsProps {
    settings: Settings;
    onToggleExtension: () => void;
    onToggleAutoRedirect: () => void;
    onRedirectDelayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    settings,
    onToggleExtension,
    onToggleAutoRedirect,
    onRedirectDelayChange
}) => {
    const { t, changeLanguage } = useTranslation();

    const handleLanguageChange = (language: LanguageCode) => {
        if (language !== settings.language) {
            changeLanguage(language);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">{t('settings')}</h2>

            <div className="mb-4">
                <div className="flex justify-between items-center py-3">
                    <span>{t('enabled')}</span>
                    <ToggleSwitch
                        enabled={settings.enabled}
                        onChange={onToggleExtension}
                    />
                </div>

                <div className="flex justify-between items-center py-3 border-t">
                    <span>{t('autoRedirect')}</span>
                    <ToggleSwitch
                        enabled={settings.autoRedirect}
                        onChange={onToggleAutoRedirect}
                    />
                </div>

                <div className="flex justify-between items-center py-3 border-t">
                    <span>{t('redirectDelay')}</span>
                    <input
                        type="number"
                        value={settings.redirectDelay}
                        onChange={onRedirectDelayChange}
                        className="border rounded p-1 w-24 text-right"
                        min="0"
                        max="10000"
                    />
                </div>

                <div className="flex justify-between items-start py-3 border-t">
                    <span>{t('languagePreference')}</span>
                    <LanguageSelector
                        preferredLanguage={settings.language || 'en'}
                        onLanguageChange={handleLanguageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings; 