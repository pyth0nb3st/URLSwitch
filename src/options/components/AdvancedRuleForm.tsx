import React from 'react';

interface AdvancedRuleFormProps {
    name: string;
    fromPattern: string;
    toPattern: string;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFromPatternChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToPatternChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdvancedRuleForm: React.FC<AdvancedRuleFormProps> = ({
    name,
    fromPattern,
    toPattern,
    onNameChange,
    onFromPatternChange,
    onToPatternChange
}) => {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={onNameChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., GitHub to GitHub Dev"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Pattern (RegEx)
                </label>
                <input
                    type="text"
                    value={fromPattern}
                    onChange={onFromPatternChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., ^https?://github\.com/([^/]+/[^/]+)(?:/.*)?$"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Pattern
                </label>
                <input
                    type="text"
                    value={toPattern}
                    onChange={onToPatternChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., https://github.dev/$1"
                />
            </div>
        </>
    );
};

export default AdvancedRuleForm; 