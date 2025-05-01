// Rule definition
export interface Rule {
    id: string;
    name: string;
    enabled: boolean;
    fromPattern: string;
    toPattern: string;
    priority: number;
}

// Group of related rules
export interface RuleGroup {
    id: string;
    name: string;
    enabled: boolean;
    rules: Rule[];
}

// Global settings for the extension
export interface Settings {
    enabled: boolean;
    autoRedirect: boolean;
    redirectDelay: number;
}

// Result of matching a URL against rules
export interface RuleMatch {
    rule: Rule;
    targetUrl: string;
}

// Multiple rule matches for a URL
export interface MultiRuleMatches {
    matches: RuleMatch[];
    currentUrl: string;
}

// Message types for communication between extension components
export type MessageAction =
    | { action: 'getRedirectForCurrentTab' }
    | { action: 'getAllRedirectsForCurrentTab' }
    | { action: 'performRedirect', targetUrl: string }
    | { action: 'toggleExtension', enabled: boolean }
    | { action: 'toggleRuleGroup', groupId: string, enabled: boolean }
    | { action: 'toggleRule', groupId: string, ruleId: string, enabled: boolean }
    | { action: 'updateSettings', settings: Partial<Settings> }
    | { action: 'addRule', groupId: string, rule: Omit<Rule, 'id'> }
    | { action: 'updateRule', groupId: string, rule: Rule }
    | { action: 'deleteRule', groupId: string, ruleId: string }
    | { action: 'addRuleGroup', group: Omit<RuleGroup, 'id' | 'rules'> }
    | { action: 'updateRuleGroup', group: Pick<RuleGroup, 'id' | 'name'> }
    | { action: 'deleteRuleGroup', groupId: string }
    | { action: 'importRules', ruleGroups: RuleGroup[] }
    | { action: 'exportRules' }; 