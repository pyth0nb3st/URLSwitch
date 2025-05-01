import React from 'react';
import { Rule } from '../../types';
import ToggleSwitch from './ToggleSwitch';

interface RuleItemProps {
    rule: Rule;
    groupId: string;
    onToggle: (groupId: string, ruleId: string) => void;
    onEdit: (groupId: string, rule: Rule) => void;
    onDelete: (groupId: string, ruleId: string) => void;
}

const RuleItem: React.FC<RuleItemProps> = ({
    rule,
    groupId,
    onToggle,
    onEdit,
    onDelete
}) => {
    return (
        <div className="flex justify-between items-center p-2 border-b last:border-b-0 hover:bg-gray-50">
            <div className="flex-grow">
                <div className="font-medium">{rule.name}</div>
                <div className="text-xs text-gray-500">
                    <div className="truncate max-w-md">{rule.fromPattern}</div>
                    <div className="truncate max-w-md">→ {rule.toPattern}</div>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={() => onEdit(groupId, rule)}
                    className="text-gray-500 hover:text-blue-500"
                    title="Edit rule"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>

                <button
                    onClick={() => onDelete(groupId, rule.id)}
                    className="text-gray-500 hover:text-red-500"
                    title="Delete rule"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                <ToggleSwitch
                    enabled={rule.enabled}
                    onChange={() => onToggle(groupId, rule.id)}
                    size="sm"
                />
            </div>
        </div>
    );
};

export default RuleItem; 