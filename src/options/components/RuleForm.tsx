import React, { useState, useEffect } from 'react';
import { Rule } from '../../types';

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
    const [formMode, setFormMode] = useState<'advanced' | 'simple'>('simple');
    const [name, setName] = useState('');
    const [fromPattern, setFromPattern] = useState('');
    const [toPattern, setToPattern] = useState('');
    const [fromDomain, setFromDomain] = useState('');
    const [toDomain, setToDomain] = useState('');
    const [priority, setPriority] = useState(1);
    const [enabled, setEnabled] = useState(true);
    const [createReverse, setCreateReverse] = useState(true);
    const [patternError, setPatternError] = useState('');
    const [autoGenerateName, setAutoGenerateName] = useState(true);

    // 当编辑现有规则时，加载规则数据
    useEffect(() => {
        if (rule) {
            setName(rule.name);
            setFromPattern(rule.fromPattern);
            setToPattern(rule.toPattern);
            setPriority(rule.priority);
            setEnabled(rule.enabled);
            setCreateReverse(false); // 编辑现有规则时，默认不创建反向规则

            // Try to detect if this is a simple domain rule
            try {
                const fromDomainMatch = rule.fromPattern.match(/^\^https\?:\/\/([^/]+)/);
                const toDomainMatch = rule.toPattern.match(/^https:\/\/([^/]+)/);

                if (fromDomainMatch && toDomainMatch) {
                    setFromDomain(fromDomainMatch[1].replace(/\\\./g, '.'));
                    setToDomain(toDomainMatch[1]);
                    setFormMode('simple');
                } else {
                    setFormMode('advanced');
                }
            } catch (e) {
                setFormMode('advanced');
            }
        }
    }, [rule]);

    // 当域名更改时自动更新规则名称
    useEffect(() => {
        if (autoGenerateName && formMode === 'simple' && fromDomain && toDomain) {
            setName(`${fromDomain} → ${toDomain}`);
        }
    }, [autoGenerateName, formMode, fromDomain, toDomain]);

    // 测试正则表达式是否有效
    const testPattern = (pattern: string): boolean => {
        try {
            new RegExp(pattern);
            return true;
        } catch (e) {
            return false;
        }
    };

    // 验证表单
    const validateForm = (): boolean => {
        if (!name.trim()) {
            setPatternError('Name is required');
            return false;
        }

        if (formMode === 'simple') {
            if (!fromDomain.trim() || !toDomain.trim()) {
                setPatternError('Both domains are required');
                return false;
            }
        } else {
            if (!fromPattern.trim() || !toPattern.trim()) {
                setPatternError('Both patterns are required');
                return false;
            }

            if (!testPattern(fromPattern)) {
                setPatternError('From pattern is not a valid regular expression');
                return false;
            }
        }

        setPatternError('');
        return true;
    };

    // Generate regex patterns from domains
    const generatePatterns = () => {
        // Escape dots in domain for regex
        const escapedFromDomain = fromDomain.replace(/\./g, '\\.');

        // Create regex that captures the path
        const from = `^https?://${escapedFromDomain}/(.*)$`;
        const to = `https://${toDomain}/$1`;

        return { from, to };
    };

    // 处理保存操作
    const handleSave = () => {
        if (!validateForm()) return;

        let finalFromPattern = fromPattern;
        let finalToPattern = toPattern;

        // If using simple mode, generate the patterns
        if (formMode === 'simple') {
            const { from, to } = generatePatterns();
            finalFromPattern = from;
            finalToPattern = to;
        }

        const newRule: Omit<Rule, 'id'> = {
            name,
            fromPattern: finalFromPattern,
            toPattern: finalToPattern,
            priority,
            enabled
        };

        onSave(groupId, newRule, createReverse && !rule);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setAutoGenerateName(false);
    };

    const handleFromDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFromDomain(e.target.value);
        if (autoGenerateName) {
            setName(`${e.target.value} → ${toDomain}`);
        }
    };

    const handleToDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToDomain(e.target.value);
        if (autoGenerateName) {
            setName(`${fromDomain} → ${e.target.value}`);
        }
    };

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
                    // Simple domain switching mode
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                From Domain
                            </label>
                            <input
                                type="text"
                                value={fromDomain}
                                onChange={handleFromDomainChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., github.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To Domain
                            </label>
                            <input
                                type="text"
                                value={toDomain}
                                onChange={handleToDomainChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., github.dev"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                <span>Rule Name</span>
                                <span className="text-xs text-gray-500">
                                    <input
                                        type="checkbox"
                                        checked={autoGenerateName}
                                        onChange={() => setAutoGenerateName(!autoGenerateName)}
                                        className="mr-1"
                                    />
                                    Auto-generate
                                </span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., GitHub to GitHub Dev"
                            />
                        </div>
                    </>
                ) : (
                    // Advanced regex mode
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., GitHub to GitHub Dev"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                From Pattern (RegEx)
                            </label>
                            <input
                                type="text"
                                value={fromPattern}
                                onChange={(e) => setFromPattern(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., ^https?://github\.com/([^/]+/[^/]+)(?:/.*)?$"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To Pattern
                            </label>
                            <input
                                type="text"
                                value={toPattern}
                                onChange={(e) => setToPattern(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., https://github.dev/$1"
                            />
                        </div>
                    </>
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