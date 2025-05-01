import React from 'react';
import { RuleMatch } from '../../types';

interface RedirectButtonProps {
    match: RuleMatch;
    onRedirect: (targetUrl: string) => void;
}

const RedirectButton: React.FC<RedirectButtonProps> = ({ match, onRedirect }) => {
    const { rule, targetUrl } = match;

    return (
        <button
            onClick={() => onRedirect(targetUrl)}
            className="w-full py-2 px-3 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex flex-col items-start"
        >
            <span className="font-medium">{rule.name}</span>
            <span className="text-xs text-blue-100 truncate w-full text-left">
                {targetUrl}
            </span>
        </button>
    );
};

export default RedirectButton; 