import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Rule, RuleGroup } from '../../types';
import { createReverseRule } from '../utils/ruleUtils';

export interface UseRuleGroupsProps {
    ruleGroups: RuleGroup[];
    onUpdateRuleGroups: (ruleGroups: RuleGroup[]) => void;
}

export interface UseRuleGroupsReturn {
    isAddingGroup: boolean;
    editingGroup: Pick<RuleGroup, 'id' | 'name'> | null;
    handleAddGroup: () => void;
    handleEditGroup: (group: Pick<RuleGroup, 'id' | 'name'>) => void;
    handleCancelGroupEdit: () => void;
    handleSaveGroup: (groupData: Omit<RuleGroup, 'id' | 'rules'>) => void;
    handleDeleteGroup: (groupId: string) => void;
    handleToggleGroup: (groupId: string) => void;
    handleToggleRule: (groupId: string, ruleId: string) => void;
    handleCreateReverseRule: (groupId: string, rule: Rule) => void;
    handleSaveRule: (groupId: string, ruleData: Omit<Rule, 'id'>, createReverse: boolean) => void;
    handleUpdateRule: (groupId: string, updatedRule: Rule) => void;
    handleDeleteRule: (groupId: string, ruleId: string) => void;
}

export function useRuleGroups({ ruleGroups, onUpdateRuleGroups }: UseRuleGroupsProps): UseRuleGroupsReturn {
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

    // 创建一个规则的反向版本
    const handleCreateReverseRule = (groupId: string, rule: Rule) => {
        const updatedGroups = ruleGroups.map(group => {
            if (group.id !== groupId) return group;

            // 创建反向规则
            const reverseRule: Rule = {
                id: uuidv4(),
                ...createReverseRule(rule)
            };

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
                const reverseRule: Rule = {
                    id: uuidv4(),
                    ...createReverseRule(newRule)
                };

                updatedRules.push(reverseRule);
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

    return {
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
    };
} 