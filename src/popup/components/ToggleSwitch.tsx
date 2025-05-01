import React from 'react';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: () => void;
    size?: 'sm' | 'md';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, size = 'sm' }) => {
    const width = size === 'sm' ? 'w-10' : 'w-12';
    const height = size === 'sm' ? 'h-5' : 'h-6';
    const thumbSize = size === 'sm' ? 'w-4 h-4' : 'w-4 h-4';
    const thumbTop = size === 'sm' ? 'top-0.5' : 'top-1';
    const thumbLeft = size === 'sm' ? 'left-0.5' : 'left-1';
    const thumbTranslate = size === 'sm' ? 'translate-x-5' : 'translate-x-6';

    return (
        <button
            onClick={onChange}
            className={`${width} ${height} rounded-full relative ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
        >
            <span
                className={`absolute ${thumbTop} ${thumbLeft} bg-white ${thumbSize} rounded-full transition-transform ${enabled ? thumbTranslate : ''}`}
            />
        </button>
    );
};

export default ToggleSwitch; 