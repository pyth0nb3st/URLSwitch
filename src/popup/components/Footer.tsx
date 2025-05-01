import React from 'react';
import { Settings } from '../../types';
import ToggleSwitch from './ToggleSwitch';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../../hooks/useTranslation';

interface FooterProps {
    settings: Settings | null;
    onToggleAutoRedirect: () => void;
    onOpenSettings: () => void;
}

const Footer: React.FC<FooterProps> = ({ settings, onToggleAutoRedirect, onOpenSettings }) => {
    const { t } = useTranslation();

    return (
        <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm">{t('autoRedirect')}</span>
                <ToggleSwitch
                    enabled={!!settings?.autoRedirect}
                    onChange={onToggleAutoRedirect}
                />
            </div>

            <div className="mb-4">
                <LanguageSelector className="justify-end" />
            </div>

            <button
                onClick={onOpenSettings}
                className="w-full py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
                {t('settings')}
            </button>
        </div>
    );
};

export default Footer; 