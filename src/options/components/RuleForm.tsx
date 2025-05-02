import React from 'react';
import { useRuleForm } from '../hooks/useRuleForm';
import { Rule } from '../../types';
import SimpleRuleForm from './SimpleRuleForm';
import AdvancedRuleForm from './AdvancedRuleForm';
import { useTranslation } from '../../hooks/useTranslation';

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
    const { t } = useTranslation();

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
                `${t('confirmConvertToAdvanced')}\n\n` +
                `${t('from')}: ${fromDomain} → ${toDomain}\n\n` +
                `${t('willGeneratePatterns')}:\n` +
                `${t('sourcePattern')}: ^https?://${fromDomain.replace(/\./g, '\\.')}/(.*)$\n` +
                `${t('targetPattern')}: https://${toDomain}/$1\n`;

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
                {rule ? t('editRule') : t('addNewRule')}
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
                            {t('simpleMode')}
                            <span className="ml-2 text-xs text-gray-500">({t('domainOnly')})</span>
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
                            {t('advancedMode')}
                            <span className="ml-2 text-xs text-gray-500">(RegEx)</span>
                        </label>
                    </div>

                    {formMode === 'simple' && fromDomain && toDomain && (
                        <button
                            type="button"
                            onClick={convertToAdvanced}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            {t('convertToAdvanced')}
                        </button>
                    )}

                    {!isSimpleModeAvailable && formMode === 'advanced' && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            {t('advancedRuleCannotUseSimpleMode')}
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
                            <div className="font-medium text-blue-700">{t('prioritySettings')}</div>
                            <div className="ml-1 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{t('important')}</div>
                        </div>

                        <div className="text-sm text-blue-700 mb-2">
                            {t('priorityDescription')}
                        </div>

                        <div className="flex items-center">
                            <label className="block text-sm font-medium text-gray-700 mr-2">
                                {t('priority')}
                            </label>
                            <input
                                type="number"
                                value={priority}
                                onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                                min="1"
                                max="100"
                                className="w-20 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-500">{t('priorityHint')}</span>
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
                                {t('createReverseRule')}
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
                    {t('cancel')}
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {rule ? t('updateRule') : t('addRule')}
                </button>
            </div>
        </div>
    );
};

export default RuleForm; 