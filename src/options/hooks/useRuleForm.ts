import { useState, useEffect } from 'react';
import { Rule } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface UseRuleFormProps {
    rule?: Rule;
    onSave: (
        groupId: string,
        rule: Omit<Rule, 'id'>,
        createReverse: boolean
    ) => void;
    groupId: string;
}

interface UseRuleFormResult {
    formMode: 'advanced' | 'simple';
    name: string;
    fromPattern: string;
    toPattern: string;
    fromDomain: string;
    toDomain: string;
    priority: number;
    enabled: boolean;
    createReverse: boolean;
    patternError: string;
    autoGenerateName: boolean;
    setFormMode: (mode: 'advanced' | 'simple') => void;
    handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFromDomainChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleToDomainChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFromPattern: (value: string) => void;
    setToPattern: (value: string) => void;
    setPriority: (value: number) => void;
    setCreateReverse: (value: boolean) => void;
    setAutoGenerateName: (value: boolean) => void;
    handleSave: () => void;
    validateForm: () => boolean;
}

// 检查是否为简单域名规则
const isSimpleDomainRule = (fromPattern: string, toPattern: string): boolean => {
    try {
        // 严格检查fromPattern格式: 应该是"^https?://domain\.com/(.*)$"形式
        const fromMatch = fromPattern.match(/^\^https\?:\/\/([a-zA-Z0-9\\.\-]+)\/\(\.\*\)\$$/);

        // 严格检查toPattern格式: 应该是"https://domain.com/$1"形式
        const toMatch = toPattern.match(/^https:\/\/([a-zA-Z0-9.\-]+)\/\$1$/);

        return !!(fromMatch && toMatch);
    } catch (e) {
        return false;
    }
};

export function useRuleForm({
    rule,
    onSave,
    groupId
}: UseRuleFormProps): UseRuleFormResult {
    const { t } = useTranslation();

    // 初始化为简单模式，但当加载复杂规则时会自动切换到高级模式
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

            // 检测是否为简单域名规则
            if (isSimpleDomainRule(rule.fromPattern, rule.toPattern)) {
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
            } else {
                // 非简单域名规则使用高级模式
                setFormMode('advanced');
            }
        }
    }, [rule]);

    // 切换表单模式并处理相关字段
    const handleFormModeChange = (mode: 'advanced' | 'simple') => {
        if (mode === 'advanced' && formMode === 'simple' && (!fromPattern || !toPattern)) {
            // 如果是从简单模式切到高级模式，且高级模式还没有值，则尝试从简单模式生成
            if (fromDomain && toDomain) {
                const escapedFromDomain = fromDomain.replace(/\./g, '\\.');
                setFromPattern(`^https?://${escapedFromDomain}/(.*)$`);
                setToPattern(`https://${toDomain}/$1`);
            }
        } else if (mode === 'simple' && formMode === 'advanced') {
            // 当从高级模式切换到简单模式时，尝试解析高级模式的模式
            try {
                const fromDomainMatch = fromPattern.match(/^\^https\?:\/\/([^/]+)/);
                const toDomainMatch = toPattern.match(/^https:\/\/([^/]+)/);

                if (fromDomainMatch && toDomainMatch) {
                    setFromDomain(fromDomainMatch[1].replace(/\\\./g, '.'));
                    setToDomain(toDomainMatch[1]);
                } else {
                    // 如果无法解析，清空简单模式字段
                    setFromDomain('');
                    setToDomain('');
                }
            } catch (e) {
                // 解析失败时清空简单模式字段
                setFromDomain('');
                setToDomain('');
            }
        }

        setFormMode(mode);
    };

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
            setPatternError(t('ruleNameRequired'));
            return false;
        }

        if (formMode === 'simple') {
            if (!fromDomain.trim() || !toDomain.trim()) {
                setPatternError(t('bothDomainsRequired'));
                return false;
            }
        } else {
            // Advanced mode validation
            if (!fromPattern.trim() || !toPattern.trim()) {
                setPatternError(t('bothPatternsRequired'));
                return false;
            }

            if (!testPattern(fromPattern)) {
                setPatternError(t('invalidRegexPattern'));
                return false;
            }

            try {
                // Test if the to pattern contains valid references
                const regexGroups = new RegExp(fromPattern).exec('test');
                if (regexGroups && toPattern.includes('$')) {
                    const maxGroupNumber = regexGroups.length - 1;
                    const usedGroups = toPattern.match(/\$(\d+)/g);

                    if (usedGroups) {
                        for (const group of usedGroups) {
                            const groupNumber = parseInt(group.substring(1));
                            if (groupNumber > maxGroupNumber) {
                                setPatternError(t('groupReferenceExceedsCount', [group]));
                                return false;
                            }
                        }
                    }
                }
            } catch (e) {
                // If there's an error, we've already caught it in the previous check
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

        // 确保高级模式下的模式有值
        if (formMode === 'advanced' && (!finalFromPattern || !finalToPattern)) {
            setPatternError(t('advancedModePatternRequired'));
            return;
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

    return {
        formMode,
        name,
        fromPattern,
        toPattern,
        fromDomain,
        toDomain,
        priority,
        enabled,
        createReverse,
        patternError,
        autoGenerateName,
        setFormMode: handleFormModeChange,
        handleNameChange,
        handleFromDomainChange,
        handleToDomainChange,
        setFromPattern,
        setToPattern,
        setPriority,
        setCreateReverse,
        setAutoGenerateName,
        handleSave,
        validateForm
    };
} 