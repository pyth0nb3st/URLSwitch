import { useState, useEffect } from 'react';
import { Rule } from '../../types';

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

export function useRuleForm({
    rule,
    onSave,
    groupId
}: UseRuleFormProps): UseRuleFormResult {
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
        setFormMode,
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