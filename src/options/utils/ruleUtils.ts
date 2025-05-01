import { Rule } from '../../types';

// 从域名提取可读名称（去除正则转义）
export const extractReadableDomain = (domain: string): string => {
    return domain.replace(/\\\./g, '.');
};

// 根据from和to域名生成规则名称
export const generateRuleNameFromDomains = (fromDomain: string, toDomain: string): string => {
    return `${fromDomain} → ${toDomain}`;
};

// 检查是否是简单域名模式的正则表达式
export const isSimpleDomainPattern = (
    fromPattern: string,
    toPattern: string
): { isSimple: boolean, fromDomain?: string, toDomain?: string } => {
    const fromDomainMatch = fromPattern.match(/^\^https\?:\/\/([^/]+)\/\(\.\*\)\$$/);
    const toDomainMatch = toPattern.match(/^https:\/\/([^/]+)\/\$1$/);

    if (fromDomainMatch && toDomainMatch) {
        return {
            isSimple: true,
            fromDomain: extractReadableDomain(fromDomainMatch[1]),
            toDomain: toDomainMatch[1]
        };
    }

    return { isSimple: false };
};

// 为规则创建反向版本
export const createReverseRule = (rule: Rule): Omit<Rule, 'id'> => {
    // 检查是否是简单域名模式
    const { isSimple, fromDomain, toDomain } = isSimpleDomainPattern(
        rule.fromPattern,
        rule.toPattern
    );

    if (isSimple && fromDomain && toDomain) {
        // 简单域名模式 - 交换域名
        // 生成反向规则的名称
        const reverseName = generateRuleNameFromDomains(toDomain, fromDomain);

        // 反向规则需要交换域名
        const reverseFromDomain = toDomain.replace(/\./g, '\\.');

        return {
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

        // 复杂模式的反向规则
        const reverseRule: Omit<Rule, 'id'> = {
            name: reverseName,
            fromPattern: rule.toPattern.replace(/\$(\d+)/g, '___$$$1___'),
            toPattern: rule.fromPattern.replace(/\(([^)]+)\)/g, '$$$1'),
            priority: rule.priority,
            enabled: rule.enabled
        };

        // 修复正则表达式中的替换模式
        reverseRule.fromPattern = reverseRule.fromPattern.replace(/___\$(\d+)___/g, '$$$1');

        return reverseRule;
    }
}; 