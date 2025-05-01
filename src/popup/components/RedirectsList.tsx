import React from 'react';
import { RuleMatch } from '../../types';
import RedirectButton from './RedirectButton';
import { useTranslation } from '../../hooks/useTranslation';

interface RedirectsListProps {
    matches: RuleMatch[];
    currentUrl: string;
    onRedirect: (targetUrl: string) => void;
}

const RedirectsList: React.FC<RedirectsListProps> = ({ matches, currentUrl, onRedirect }) => {
    const { t } = useTranslation();

    if (matches.length === 0) {
        return (
            <div className="text-gray-500 mb-4 text-center py-4">
                {t('noMatchesFound')}
            </div>
        );
    }

    return (
        <div className="mb-4">
            <div className="text-sm mb-3 overflow-hidden text-ellipsis">
                <span className="font-semibold">{t('currentUrl')}:</span>
                <div className="text-gray-600 truncate">{currentUrl}</div>
            </div>

            <div className="text-sm mb-2 font-medium">
                {t('availableRedirects')} ({matches.length}):
            </div>

            <div className="space-y-2">
                {matches.map((match) => (
                    <RedirectButton
                        key={match.rule.id}
                        match={match}
                        onRedirect={onRedirect}
                    />
                ))}
            </div>
        </div>
    );
};

export default RedirectsList; 