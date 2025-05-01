import React from 'react';

interface SimpleRuleFormProps {
    fromDomain: string;
    toDomain: string;
    name: string;
    autoGenerateName: boolean;
    onFromDomainChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToDomainChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAutoGenerateChange: (value: boolean) => void;
}

const SimpleRuleForm: React.FC<SimpleRuleFormProps> = ({
    fromDomain,
    toDomain,
    name,
    autoGenerateName,
    onFromDomainChange,
    onToDomainChange,
    onNameChange,
    onAutoGenerateChange
}) => {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Domain
                </label>
                <input
                    type="text"
                    value={fromDomain}
                    onChange={onFromDomainChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., github.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Domain
                </label>
                <input
                    type="text"
                    value={toDomain}
                    onChange={onToDomainChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., github.dev"
                />
            </div>

            <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Rule Name</span>
                    <span className="text-xs text-gray-500">
                        <input
                            type="checkbox"
                            checked={autoGenerateName}
                            onChange={(e) => onAutoGenerateChange(e.target.checked)}
                            className="mr-1"
                        />
                        Auto-generate
                    </span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={onNameChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., GitHub to GitHub Dev"
                />
            </div>
        </>
    );
};

export default SimpleRuleForm; 