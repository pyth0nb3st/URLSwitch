import React, { useState } from 'react';
import { RuleGroup, Rule } from '../../types';
import RuleGroupItem from './RuleGroupItem';
import RuleGroupForm from './RuleGroupForm';
import { v4 as uuidv4 } from 'uuid';

interface RulesManagerProps {
    ruleGroups: RuleGroup[];
    onUpdateRuleGroups: (ruleGroups: RuleGroup[]) => void;
}

const RulesManager: React.FC<RulesManagerProps> = ({ ruleGroups, onUpdateRuleGroups }) => {
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Pick<RuleGroup, 'id' | 'name'> | null>(null);

    // 创建新的规则组
    const handleAddGroup = () => {
        setIsAddingGroup(true);
        setEditingGroup(null);
    };

    // 编辑现有规则组
    const handleEditGroup = (group: Pick<RuleGroup, 'id' | 'name'>) => {
        setEditingGroup(group);
        setIsAddingGroup(true);
    };

    // 取消添加/编辑操作
    const handleCancelGroupEdit = () => {
        setIsAddingGroup(false);
        setEditingGroup(null);
    };

    // 保存规则组
    const handleSaveGroup = (groupData: Omit<RuleGroup, 'id' | 'rules'>) => {
        if (editingGroup) {
            // 更新现有组
            const updatedGroups = ruleGroups.map(group =>
                group.id === editingGroup.id ? { ...group, ...groupData } : group
            );
            onUpdateRuleGroups(updatedGroups);
        } else {
            // 创建新组
            const newGroup: RuleGroup = {
                id: uuidv4(),
                ...groupData,
                rules: []
            };
            onUpdateRuleGroups([...ruleGroups, newGroup]);
        }

        setIsAddingGroup(false);
        setEditingGroup(null);
    };

    // 删除规则组
    const handleDeleteGroup = (groupId: string) => {
        if (confirm('Are you sure you want to delete this group and all its rules?')) {
            const updatedGroups = ruleGroups.filter(group => group.id !== groupId);
            onUpdateRuleGroups(updatedGroups);
        }
    };

    // 切换规则组启用状态
    const handleToggleGroup = (groupId: string) => {
        const updatedGroups = ruleGroups.map(group =>
            group.id === groupId ? { ...group, enabled: !group.enabled } : group
        );
        onUpdateRuleGroups(updatedGroups);
    };

    // 切换规则启用状态
    const handleToggleRule = (groupId: string, ruleId: string) => {
        const updatedGroups = ruleGroups.map(group => {
            if (group.id !== groupId) return group;

            const updatedRules = group.rules.map(rule =>
                rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
            );

            return { ...group, rules: updatedRules };
        });

        onUpdateRuleGroups(updatedGroups);
    };

    // 从域名提取可读名称（去除正则转义）
    const extractReadableDomain = (domain: string): string => {
        return domain.replace(/\\\./g, '.');
    };

    // 根据from和to域名生成规则名称
    const generateRuleNameFromDomains = (fromDomain: string, toDomain: string): string => {
        return `${fromDomain} → ${toDomain}`;
    };

    // 创建一个规则的反向版本
    const handleCreateReverseRule = (groupId: string, rule: Rule) => {
        const updatedGroups = ruleGroups.map(group => {
            if (group.id !== groupId) return group;

            // 检查是否是简单域名模式
            const fromDomainMatch = rule.fromPattern.match(/^\^https\?:\/\/([^/]+)\/\(\.\*\)\$$/);
            const toDomainMatch = rule.toPattern.match(/^https:\/\/([^/]+)\/\$1$/);

            let reverseRule: Rule;

            if (fromDomainMatch && toDomainMatch) {
                // 简单域名模式 - 交换域名
                const fromDomain = extractReadableDomain(fromDomainMatch[1]);
                const toDomain = toDomainMatch[1];

                // 生成反向规则的名称
                const reverseName = generateRuleNameFromDomains(toDomain, fromDomain);

                // 反向规则需要交换域名
                const reverseFromDomain = toDomain.replace(/\./g, '\\.');

                reverseRule = {
                    id: uuidv4(),
                    name: reverseName,
                    fromPattern: `^https?://${reverseFromDomain}/(.*)$`,
                    toPattern: `https://${fromDomain}/$1`,
                    priority: rule.priority,
                    enabled: rule.enabled
                };
            } else {
                // 复杂正则模式 - 尝试从现有规则名称推断方向
                const parts = rule.name.split(' → ');
                let reverseName: string;

                if (parts.length === 2) {
                    // 如果名称已经使用了箭头格式，交换两部分
                    reverseName = `${parts[1]} → ${parts[0]}`;
                } else {
                    // 否则就简单地加上时间戳
                    reverseName = `${rule.name} (Reversed ${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')})`;
                }

                reverseRule = {
                    id: uuidv4(),
                    name: reverseName,
                    fromPattern: rule.toPattern.replace(/\$(\d+)/g, '___$$$1___'),
                    toPattern: rule.fromPattern.replace(/\(([^)]+)\)/g, '$$$1'),
                    priority: rule.priority,
                    enabled: rule.enabled
                };

                // 修复正则表达式中的替换模式
                reverseRule.fromPattern = reverseRule.fromPattern.replace(/___\$(\d+)___/g, '$$$1');
            }

            // 添加反向规则到组中
            return { ...group, rules: [...group.rules, reverseRule] };
        });

        onUpdateRuleGroups(updatedGroups);
    };

    // 添加新规则（并可选创建反向规则）
    const handleSaveRule = (groupId: string, ruleData: Omit<Rule, 'id'>, createReverse: boolean) => {
        const updatedGroups = ruleGroups.map(group => {
            if (group.id !== groupId) return group;

            // 创建新规则
            const newRule: Rule = {
                id: uuidv4(),
                ...ruleData
            };

            let updatedRules = [...group.rules, newRule];

            // 如果需要创建反向规则
            if (createReverse) {
                // Check if this is a domain-switching pattern
                const fromDomainMatch = ruleData.fromPattern.match(/^\^https\?:\/\/([^/]+)\/\(\.\*\)\$$/);
                const toDomainMatch = ruleData.toPattern.match(/^https:\/\/([^/]+)\/\$1$/);

                if (fromDomainMatch && toDomainMatch) {
                    // Simple domain switching - create reverse rule with swapped domains
                    const fromDomain = extractReadableDomain(fromDomainMatch[1]);
                    const toDomain = toDomainMatch[1];

                    // 生成反向规则的名称
                    const reverseName = generateRuleNameFromDomains(toDomain, fromDomain);

                    // For the reverse rule, we swap the domains
                    const reverseFromDomain = toDomain.replace(/\./g, '\\.');

                    const reverseRule: Rule = {
                        id: uuidv4(),
                        name: reverseName,
                        fromPattern: `^https?://${reverseFromDomain}/(.*)$`,
                        toPattern: `https://${fromDomain}/$1`,
                        priority: ruleData.priority,
                        enabled: ruleData.enabled
                    };

                    updatedRules.push(reverseRule);
                } else {
                    // 复杂正则模式 - 尝试从现有规则名称推断方向
                    const parts = ruleData.name.split(' → ');
                    let reverseName: string;

                    if (parts.length === 2) {
                        // 如果名称已经使用了箭头格式，交换两部分
                        reverseName = `${parts[1]} → ${parts[0]}`;
                    } else {
                        // 否则使用原名称加上 Reversed 后缀
                        reverseName = `${ruleData.name} (Reversed)`;
                    }

                    // Complex pattern - use the existing logic
                    const reverseRule: Rule = {
                        id: uuidv4(),
                        name: reverseName,
                        fromPattern: ruleData.toPattern.replace(/\$(\d+)/g, '___$$$1___'),
                        toPattern: ruleData.fromPattern.replace(/\(([^)]+)\)/g, '$$$1'),
                        priority: ruleData.priority,
                        enabled: ruleData.enabled
                    };

                    // 修复反向规则中的替换模式
                    // 首先，将to中的捕获组引用($1, $2等)替换为临时标记
                    let reverseFromPattern = reverseRule.fromPattern;

                    // 然后，将正则表达式中的捕获组标记为$1, $2等
                    reverseFromPattern = reverseFromPattern.replace(/___\$(\d+)___/g, '$$$1');

                    // 更新规则
                    reverseRule.fromPattern = reverseFromPattern;

                    updatedRules.push(reverseRule);
                }
            }

            return { ...group, rules: updatedRules };
        });

        onUpdateRuleGroups(updatedGroups);
    };

    // 更新现有规则
    const handleUpdateRule = (groupId: string, updatedRule: Rule) => {
        const updatedGroups = ruleGroups.map(group => {
            if (group.id !== groupId) return group;

            const updatedRules = group.rules.map(rule =>
                rule.id === updatedRule.id ? updatedRule : rule
            );

            return { ...group, rules: updatedRules };
        });

        onUpdateRuleGroups(updatedGroups);
    };

    // 删除规则
    const handleDeleteRule = (groupId: string, ruleId: string) => {
        if (confirm('Are you sure you want to delete this rule?')) {
            const updatedGroups = ruleGroups.map(group => {
                if (group.id !== groupId) return group;

                const updatedRules = group.rules.filter(rule => rule.id !== ruleId);
                return { ...group, rules: updatedRules };
            });

            onUpdateRuleGroups(updatedGroups);
        }
    };

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