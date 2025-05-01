import React from 'react';
import { Settings } from '../../types';
import ToggleSwitch from './ToggleSwitch';

interface FooterProps {
    settings: Settings | null;
    onToggleAutoRedirect: () => void;
    onOpenSettings: () => void;
}

const Footer: React.FC<FooterProps> = ({ settings, onToggleAutoRedirect, onOpenSettings }) => {
    return (
        <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Auto Redirect</span>
                <ToggleSwitch
                    enabled={!!settings?.autoRedirect}
                    onChange={onToggleAutoRedirect}
                />
            </div>
            <button
                onClick={onOpenSettings}
                className="w-full py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
                Open Settings
            </button>
        </div>
    );
};

export default Footer; 