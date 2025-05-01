import React from 'react';
import { Rule } from '../../types';
import { useRuleForm } from '../hooks/useRuleForm';
import SimpleRuleForm from './SimpleRuleForm';
import AdvancedRuleForm from './AdvancedRuleForm';

interface RuleFormProps {
    groupId: string;
    rule?: Rule; // 如果提供，表示编辑现有规则；否则是新规则
    isReverse?: boolean; // 标记是否为反向规则（用于UI显示）
    onSave: (groupId: string, rule: Omit<Rule, 'id'>, createReverse: boolean) => void;
    onCancel: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({
    groupId,
    rule,
    isReverse = false,
    onSave,
    onCancel
}) => {
    const {
        formMode,
        name,
        fromPattern,
        toPattern,
        fromDomain,
        toDomain,
        priority,
        createReverse,
        patternError,
        autoGenerateName,
        setFormMode,
        handleNameChange,
        handleFromDomainChange,
        handleToDomainChange,
        setFromPattern,
        setToPattern,
        setPriority,
        setCreateReverse,
        setAutoGenerateName,
        handleSave
    } = useRuleForm({ rule, onSave, groupId });

    return (
        <div className="bg-white p-5 rounded-lg border shadow-sm">
            <h3 className="text-lg font-medium mb-4">
                {rule ? 'Edit Rule' : 'Add New Rule'}
                {isReverse && ' (Reverse)'}
            </h3>

            <div className="space-y-4">
                <div className="flex space-x-4 mb-2">
                    <button
                        type="button"
                        onClick={() => setFormMode('simple')}
                        className={`px-3 py-1 rounded ${formMode === 'simple'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'}`}
                    >
                        Simple Mode
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormMode('advanced')}
                        className={`px-3 py-1 rounded ${formMode === 'advanced'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'}`}
                    >
                        Advanced Mode
                    </button>
                </div>

                {formMode === 'simple' ? (
                    <SimpleRuleForm
                        fromDomain={fromDomain}
                        toDomain={toDomain}
                        name={name}
                        autoGenerateName={autoGenerateName}
                        onFromDomainChange={handleFromDomainChange}
                        onToDomainChange={handleToDomainChange}
                        onNameChange={handleNameChange}
                        onAutoGenerateChange={setAutoGenerateName}
                    />
                ) : (
                    <AdvancedRuleForm
                        name={name}
                        fromPattern={fromPattern}
                        toPattern={toPattern}
                        onNameChange={handleNameChange}
                        onFromPatternChange={(e) => setFromPattern(e.target.value)}
                        onToPatternChange={(e) => setToPattern(e.target.value)}
                    />
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority (Lower number = higher priority)
                    </label>
                    <input
                        type="number"
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value))}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="1"
                        max="100"
                    />
                </div>

                {!rule && (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="createReverse"
                            checked={createReverse}
                            onChange={(e) => setCreateReverse(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="createReverse" className="ml-2 block text-sm text-gray-700">
                            Automatically create reverse rule
                        </label>
                    </div>
                )}

                {patternError && (
                    <div className="text-red-500 text-sm">{patternError}</div>
                )}

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
                        Save Rule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RuleForm; 