import React, { useState, useEffect } from 'react';
import { RuleGroup } from '../../types';

interface RuleGroupFormProps {
    group?: Pick<RuleGroup, 'id' | 'name'>;
    onSave: (group: Omit<RuleGroup, 'id' | 'rules'>) => void;
    onCancel: () => void;
}

const RuleGroupForm: React.FC<RuleGroupFormProps> = ({ group, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        if (group) {
            setName(group.name);
        }
    }, [group]);

    const handleSave = () => {
        if (!name.trim()) {
            setNameError('Group name is required');
            return;
        }

        onSave({
            name,
            enabled: true
        });
    };

    return (
        <div className="bg-white p-5 rounded-lg border shadow-sm">
            <h3 className="text-lg font-medium mb-4">
                {group ? 'Edit Rule Group' : 'Add New Rule Group'}
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setNameError('');
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., GitHub"
                    />
                    {nameError && (
                        <div className="text-red-500 text-sm mt-1">{nameError}</div>
                    )}
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Save Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RuleGroupForm; 