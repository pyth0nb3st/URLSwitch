import React from 'react';
import { LanguageCode } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface LanguageSelectorProps {
    className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
    const { t, changeLanguage, currentLanguage, preferredLanguage } = useTranslation();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value as LanguageCode;
        if (newLanguage !== preferredLanguage) {
            changeLanguage(newLanguage);
        }
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex items-center mb-1">
                <label htmlFor="language-select" className="text-sm mr-2">
                    {t('languagePreference')}:
                </label>
            </div>
            <div className="flex items-center">
                <select
                    id="language-select"
                    value={preferredLanguage}
                    onChange={handleLanguageChange}
                    className="text-sm p-1 border rounded"
                >
                    <option value="en">{t('english')}</option>
                    <option value="zh_CN">{t('chinese')}</option>
                </select>
                <span className="text-xs text-gray-500 ml-2">{t('currentLanguage')}: {currentLanguage === 'zh_CN' ? '中文' : 'English'}</span>
            </div>
        </div>
    );
};

export default LanguageSelector; 