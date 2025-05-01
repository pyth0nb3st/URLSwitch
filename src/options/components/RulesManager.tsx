import React from 'react';
import { RuleGroup } from '../../types';
import RuleGroupItem from './RuleGroupItem';
import RuleGroupForm from './RuleGroupForm';
import { useRuleGroups } from '../hooks/useRuleGroups';

interface RulesManagerProps {
    ruleGroups: RuleGroup[];
    onUpdateRuleGroups: (ruleGroups: RuleGroup[]) => void;
}

const RulesManager: React.FC<RulesManagerProps> = ({ ruleGroups, onUpdateRuleGroups }) => {
    const {
        isAddingGroup,
        editingGroup,
        handleAddGroup,
        handleEditGroup,
        handleCancelGroupEdit,
        handleSaveGroup,
        handleDeleteGroup,
        handleToggleGroup,
        handleToggleRule,
        handleCreateReverseRule,
        handleSaveRule,
        handleUpdateRule,
        handleDeleteRule
    } = useRuleGroups({ ruleGroups, onUpdateRuleGroups });

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Rules Management</h2>
                {!isAddingGroup && (
                    <button
                        onClick={handleAddGroup}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        + Add Rule Group
                    </button>
                )}
            </div>

            {isAddingGroup ? (
                <div className="mb-6">
                    <RuleGroupForm
                        group={editingGroup || undefined}
                        onSave={handleSaveGroup}
                        onCancel={handleCancelGroupEdit}
                    />
                </div>
            ) : null}

            {ruleGroups.length === 0 && !isAddingGroup ? (
                <div className="text-gray-500 py-4 text-center">
                    No rule groups defined
                </div>
            ) : (
                <div className="space-y-4">
                    {ruleGroups.map(group => (
                        <RuleGroupItem
                            key={group.id}
                            group={group}
                            onToggleGroup={handleToggleGroup}
                            onToggleRule={handleToggleRule}
                            onEditGroup={handleEditGroup}
                            onDeleteGroup={handleDeleteGroup}
                            onSaveRule={handleSaveRule}
                            onUpdateRule={handleUpdateRule}
                            onDeleteRule={handleDeleteRule}
                            onCreateReverseRule={handleCreateReverseRule}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RulesManager; 