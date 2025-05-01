import React from 'react';
import { useRuleForm } from '../hooks/useRuleForm';
import { Rule } from '../../types';
import SimpleRuleForm from './SimpleRuleForm';
import AdvancedRuleForm from './AdvancedRuleForm';

interface RuleFormProps {
    rule?: Rule;
    onSave: (
        groupId: string,
        rule: Omit<Rule, 'id'>,
        createReverse: boolean
    ) => void;
    groupId: string;
    onCancel: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({ rule, onSave, groupId, onCancel }) => {
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

    // 转换简单模式数据到高级模式
    const convertToAdvanced = () => {
        if (formMode === 'simple' && fromDomain && toDomain) {
            const confirmMessage =
                `确认将简单规则转换为高级模式?\n\n` +
                `从: ${fromDomain} → ${toDomain}\n\n` +
                `将生成以下正则表达式模式:\n` +
                `源模式: ^https?://${fromDomain.replace(/\./g, '\\.')}/(.*)$\n` +
                `目标模式: https://${toDomain}/$1\n`;

            if (confirm(confirmMessage)) {
                setFormMode('advanced');
            }
        } else {
            setFormMode('advanced');
        }
    };

    // 检查能否使用简单模式
    const canUseSimpleMode = (): boolean => {
        if (!rule) return true;

        // 如果是新规则，总是可以用简单模式
        if (!rule.fromPattern || !rule.toPattern) return true;

        // 尝试匹配简单域名规则的模式
        const simpleFromPattern = /^\^https\?:\/\/([a-zA-Z0-9\\.\-]+)\/\(\.\*\)\$$/;
        const simpleToPattern = /^https:\/\/([a-zA-Z0-9.\-]+)\/\$1$/;

        return simpleFromPattern.test(rule.fromPattern) && simpleToPattern.test(rule.toPattern);
    };

    const isSimpleModeAvailable = canUseSimpleMode();

    return (
        <div className="bg-white rounded shadow p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">
                {rule ? '编辑规则' : '添加新规则'}
            </h3>

            <div className="mb-4">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="mode-simple"
                            checked={formMode === 'simple'}
                            onChange={() => setFormMode('simple')}
                            className="mr-2"
                            disabled={!isSimpleModeAvailable}
                        />
                        <label
                            htmlFor="mode-simple"
                            className={`${!isSimpleModeAvailable ? 'text-gray-400' : 'text-gray-700'}`}
                        >
                            简单模式
                            <span className="ml-2 text-xs text-gray-500">(仅域名转换)</span>
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="mode-advanced"
                            checked={formMode === 'advanced'}
                            onChange={() => setFormMode('advanced')}
                            className="mr-2"
                        />
                        <label htmlFor="mode-advanced" className="text-gray-700">
                            高级模式
                            <span className="ml-2 text-xs text-gray-500">(RegEx)</span>
                        </label>
                    </div>

                    {formMode === 'simple' && fromDomain && toDomain && (
                        <button
                            type="button"
                            onClick={convertToAdvanced}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            转换为高级模式
                        </button>
                    )}

                    {!isSimpleModeAvailable && formMode === 'advanced' && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            此规则使用了高级正则表达式，不能用简单模式编辑
                        </span>
                    )}
                </div>

                <div className="space-y-4">
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

                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <div className="flex items-start mb-2">
                            <div className="font-medium text-blue-700">优先级设置</div>
                            <div className="ml-1 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">重要</div>
                        </div>

                        <div className="text-sm text-blue-700 mb-2">
                            优先级决定规则的匹配顺序。当多个规则都能匹配同一个URL时，优先级较高的规则将被使用。
                        </div>

                        <div className="flex items-center">
                            <label className="block text-sm font-medium text-gray-700 mr-2">
                                优先级
                            </label>
                            <input
                                type="number"
                                value={priority}
                                onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                                min="1"
                                max="100"
                                className="w-20 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-500">数字越小优先级越高</span>
                        </div>
                    </div>

                    {!rule && (
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={createReverse}
                                onChange={(e) => setCreateReverse(e.target.checked)}
                                id="create-reverse"
                                className="mr-2"
                            />
                            <label htmlFor="create-reverse" className="text-sm text-gray-700">
                                同时创建反向规则
                            </label>
                        </div>
                    )}

                    {patternError && (
                        <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded border border-red-200">
                            {patternError}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                    取消
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {rule ? '更新规则' : '添加规则'}
                </button>
            </div>
        </div>
    );
};

export default RuleForm; 