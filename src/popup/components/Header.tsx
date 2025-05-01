import React from 'react';
import { Settings } from '../../types';
import ToggleSwitch from './ToggleSwitch';

interface HeaderProps {
    settings: Settings | null;
    onToggleExtension: () => void;
}

const Header: React.FC<HeaderProps> = ({ settings, onToggleExtension }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold">URL Switch</h1>
            <div className="flex items-center">
                <span className="text-sm mr-2">{settings?.enabled ? 'Enabled' : 'Disabled'}</span>
                <ToggleSwitch
                    enabled={!!settings?.enabled}
                    onChange={onToggleExtension}
                />
            </div>
        </div>
    );
};

export default Header; 