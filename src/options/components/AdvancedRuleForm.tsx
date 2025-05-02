import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

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
    const { t } = useTranslation();

    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('ruleName')}</label>
                <input
                    type="text"
                    value={name}
                    onChange={onNameChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={t('ruleNamePlaceholderAdvanced')}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('sourcePattern')} ({t('regexLabel')})
                    <span className="ml-2 text-xs text-gray-500">{t('usedForMatching')}</span>
                </label>
                <input
                    type="text"
                    value={fromPattern}
                    onChange={onFromPatternChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={t('sourcePatternPlaceholder')}
                />
                <div className="mt-1 text-xs text-gray-500">
                    <p>{t('regexCaptureGroupHint')}</p>
                    <p>{t('regexExample')}: <code>^https?://([^/]+)/(.*)$</code> {t('regexExampleExplanation')}</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('targetPattern')}
                    <span className="ml-2 text-xs text-gray-500">{t('usedForRedirect')}</span>
                </label>
                <input
                    type="text"
                    value={toPattern}
                    onChange={onToPatternChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={t('targetPatternPlaceholder')}
                />
                <div className="mt-1 text-xs text-gray-500">
                    <p>{t('regexReferenceHint')}</p>
                    <p>{t('regexExample')}: <code>https://newdomain.com/$2</code> {t('regexReferenceExampleExplanation')}</p>
                </div>
            </div>
        </>
    );
};

export default AdvancedRuleForm; 