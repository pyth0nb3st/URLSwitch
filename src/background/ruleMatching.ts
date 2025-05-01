import { RuleGroup, RuleMatch } from '../types';

// Process URL with applicable rules
export function findMatchingRule(url: string, ruleGroups: RuleGroup[]): RuleMatch | null {
    // Get all enabled rules sorted by priority
    const rules = ruleGroups
        .filter(group => group.enabled)
        .flatMap(group => group.rules.filter(rule => rule.enabled))
        .sort((a, b) => a.priority - b.priority);

    // Find first matching rule
    for (const rule of rules) {
        const regex = new RegExp(rule.fromPattern);
        const match = url.match(regex);

        if (match) {
            // Create target URL by replacing captured groups
            let targetUrl = rule.toPattern;

            // Replace capture groups if any
            for (let i = 1; i < match.length; i++) {
                targetUrl = targetUrl.replace(`$${i}`, match[i] || '');
            }

            return { rule, targetUrl };
        }
    }

    return null;
}

// Find all matching rules for a URL
export function findAllMatchingRules(url: string, ruleGroups: RuleGroup[]): RuleMatch[] {
    // Get all enabled rules sorted by priority
    const rules = ruleGroups
        .filter(group => group.enabled)
        .flatMap(group => group.rules.filter(rule => rule.enabled))
        .sort((a, b) => a.priority - b.priority);

    const matches: RuleMatch[] = [];

    for (const rule of rules) {
        const regex = new RegExp(rule.fromPattern);
        const match = url.match(regex);

        if (match) {
            // Create target URL by replacing captured groups
            let targetUrl = rule.toPattern;

            // Replace capture groups if any
            for (let i = 1; i < match.length; i++) {
                targetUrl = targetUrl.replace(`$${i}`, match[i] || '');
            }

            matches.push({ rule, targetUrl });
        }
    }

    return matches;
} 