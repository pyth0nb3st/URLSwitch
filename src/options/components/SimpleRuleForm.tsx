import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

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
    const { t } = useTranslation();

    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('fromDomain')}
                </label>
                <input
                    type="text"
                    value={fromDomain}
                    onChange={onFromDomainChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={t('domainPlaceholderFrom')}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('toDomain')}
                </label>
                <input
                    type="text"
                    value={toDomain}
                    onChange={onToDomainChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={t('domainPlaceholderTo')}
                />
            </div>

            <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{t('ruleName')}</span>
                    <span className="text-xs text-gray-500">
                        <input
                            type="checkbox"
                            checked={autoGenerateName}
                            onChange={(e) => onAutoGenerateChange(e.target.checked)}
                            className="mr-1"
                        />
                        {t('autoGenerate')}
                    </span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={onNameChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={t('ruleNamePlaceholder')}
                />
            </div>
        </>
    );
};

export default SimpleRuleForm; 