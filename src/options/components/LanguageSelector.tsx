import React from 'react';
import { LanguageCode } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface LanguageSelectorProps {
    preferredLanguage: LanguageCode;
    onLanguageChange: (language: LanguageCode) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    preferredLanguage,
    onLanguageChange
}) => {
    const { t, currentLanguage } = useTranslation();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value as LanguageCode;
        if (newLanguage !== preferredLanguage) {
            onLanguageChange(newLanguage);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col">
                <select
                    value={preferredLanguage}
                    onChange={handleChange}
                    className="border rounded p-1 min-w-[200px] mb-2"
                >
                    <option value="en">{t('english')}</option>
                    <option value="zh_CN">{t('chinese')}</option>
                </select>
                <div className="text-xs text-gray-500">
                    {t('currentLanguage')}: {currentLanguage === 'zh_CN' ? '中文' : 'English'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {t('browserSettings')}
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector; 