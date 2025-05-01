import React from 'react';
import { Settings } from '../../types';
import ToggleSwitch from './ToggleSwitch';

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
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>

            <div className="mb-4">
                <div className="flex justify-between items-center py-3">
                    <span>Extension Enabled</span>
                    <ToggleSwitch
                        enabled={settings.enabled}
                        onChange={onToggleExtension}
                    />
                </div>

                <div className="flex justify-between items-center py-3 border-t">
                    <span>Auto Redirect</span>
                    <ToggleSwitch
                        enabled={settings.autoRedirect}
                        onChange={onToggleAutoRedirect}
                    />
                </div>

                <div className="flex justify-between items-center py-3 border-t">
                    <span>Redirect Delay (ms)</span>
                    <input
                        type="number"
                        value={settings.redirectDelay}
                        onChange={onRedirectDelayChange}
                        className="border rounded p-1 w-24 text-right"
                        min="0"
                        max="10000"
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings; 