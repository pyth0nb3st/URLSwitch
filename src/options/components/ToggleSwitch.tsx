import React from 'react';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, size = 'md' }) => {
    const width = size === 'sm' ? 'w-10' : size === 'md' ? 'w-12' : 'w-14';
    const height = size === 'sm' ? 'h-5' : size === 'md' ? 'h-6' : 'h-7';
    const thumbSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
    const thumbTop = size === 'sm' ? 'top-0.5' : size === 'md' ? 'top-1' : 'top-1';
    const thumbLeft = size === 'sm' ? 'left-0.5' : size === 'md' ? 'left-1' : 'left-1';
    const thumbTranslate = size === 'sm' ? 'translate-x-5' : size === 'md' ? 'translate-x-6' : 'translate-x-7';

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