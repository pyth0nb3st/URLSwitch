import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const Loading: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="p-8 flex justify-center">
            <div className="text-gray-500">{t('loading')}</div>
        </div>
    );
};

export default Loading; 