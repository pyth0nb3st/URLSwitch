import React, { useState } from 'react';
import { RuleGroup, Rule } from '../../types';
import ToggleSwitch from './ToggleSwitch';
import RuleItem from './RuleItem';
import RuleForm from './RuleForm';

interface RuleGroupItemProps {
    group: RuleGroup;
    onToggleGroup: (groupId: string) => void;
    onToggleRule: (groupId: string, ruleId: string) => void;
    onEditGroup: (group: Pick<RuleGroup, 'id' | 'name'>) => void;
    onDeleteGroup: (groupId: string) => void;
    onSaveRule: (groupId: string, rule: Omit<Rule, 'id'>, createReverse: boolean) => void;
    onUpdateRule: (groupId: string, rule: Rule) => void;
    onDeleteRule: (groupId: string, ruleId: string) => void;
}

const RuleGroupItem: React.FC<RuleGroupItemProps> = ({
    group,
    onToggleGroup,
    onToggleRule,
    onEditGroup,
    onDeleteGroup,
    onSaveRule,
    onUpdateRule,
    onDeleteRule
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingRule, setIsAddingRule] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);

    const handleAddRule = () => {
        setIsAddingRule(true);
        setEditingRule(null);
    };

    const handleEditRule = (groupId: string, rule: Rule) => {
        console.log('handleEditRule', groupId, rule);
        setEditingRule(rule);
        setIsAddingRule(true);
    };

    const handleCancelRuleEdit = () => {
        setIsAddingRule(false);
        setEditingRule(null);
    };

    const handleSaveRule = (groupId: string, rule: Omit<Rule, 'id'>, createReverse: boolean) => {
        if (editingRule) {
            onUpdateRule(groupId, { ...rule, id: editingRule.id });
        } else {
            onSaveRule(groupId, rule, createReverse);
        }
        setIsAddingRule(false);
        setEditingRule(null);
    };

    return (
        <div className="border rounded-lg mb-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-t-lg">
                <div className="flex items-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mr-2 text-gray-500"
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <h3 className="font-medium">{group.name}</h3>
                    <span className="ml-2 text-sm text-gray-500">({group.rules.length} rules)</span>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => onEditGroup(group)}
                        className="text-gray-500 hover:text-blue-500"
                        title="Edit group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => onDeleteGroup(group.id)}
                        className="text-gray-500 hover:text-red-500"
                        title="Delete group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>

                    <ToggleSwitch
                        enabled={group.enabled}
                        onChange={() => onToggleGroup(group.id)}
                    />
                </div>
            </div>

            {isExpanded && (
                <div className="p-4">
                    {group.rules.length === 0 && !isAddingRule ? (
                        <div className="text-gray-500 py-2 text-center">
                            No rules in this group
                        </div>
                    ) : (
                        <div className="space-y-2 mb-4">
                            {group.rules.map(rule => (
                                <RuleItem
                                    key={rule.id}
                                    rule={rule}
                                    groupId={group.id}
                                    onToggle={onToggleRule}
                                    onEdit={handleEditRule}
                                    onDelete={onDeleteRule}
                                />
                            ))}
                        </div>
                    )}

                    {isAddingRule ? (
                        <RuleForm
                            groupId={group.id}
                            rule={editingRule || undefined}
                            onSave={handleSaveRule}
                            onCancel={handleCancelRuleEdit}
                        />
                    ) : (
                        <button
                            onClick={handleAddRule}
                            className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                            + Add New Rule
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default RuleGroupItem; 