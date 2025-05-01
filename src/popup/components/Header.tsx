import React from 'react';
import { Settings } from '../../types';
import ToggleSwitch from './ToggleSwitch';
import { useTranslation } from '../../hooks/useTranslation';

interface HeaderProps {
    settings: Settings | null;
    onToggleExtension: () => void;
}

const Header: React.FC<HeaderProps> = ({ settings, onToggleExtension }) => {
    const { t } = useTranslation();

    return (
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold">{t('appName')}</h1>
            <div className="flex items-center">
                <span className="text-sm mr-2">{settings?.enabled ? t('enabled') : t('disabled')}</span>
                <ToggleSwitch
                    enabled={!!settings?.enabled}
                    onChange={onToggleExtension}
                />
            </div>
        </div>
    );
};

export default Header; 