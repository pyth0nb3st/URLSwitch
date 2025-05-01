// import { Rule, RuleGroup, RuleMatch, Settings } from '../types';
import { RuleGroup, RuleMatch, Settings, MultiRuleMatches } from '../types';

// Default settings
const DEFAULT_SETTINGS: Settings = {
    enabled: true,
    autoRedirect: false,
    redirectDelay: 1000,
};

// Default rule groups
const DEFAULT_RULE_GROUPS: RuleGroup[] = [
    {
        id: 'github',
        name: 'GitHub',
        enabled: true,
        rules: [
            {
                id: 'github-to-github-dev',
                name: 'GitHub to GitHub Dev',
                enabled: true,
                fromPattern: '^https?://github\\.com/([^/]+/[^/]+)(?:/.*)?$',
                toPattern: 'https://github.dev/$1',
                priority: 1,
            },
            {
                id: 'github-dev-to-github',
                name: 'GitHub Dev to GitHub',
                enabled: true,
                fromPattern: '^https?://github\\.dev/([^/]+/[^/]+)(?:/.*)?$',
                toPattern: 'https://github.com/$1',
                priority: 1,
            },
        ],
    },
    {
        id: 'stackoverflow',
        name: 'Stack Overflow',
        enabled: true,
        rules: [
            {
                id: 'stackoverflow-to-dev',
                name: 'Stack Overflow to Dev.to',
                enabled: true,
                fromPattern: '^https?://stackoverflow\\.com/questions/([\\d]+)/([\\w-]+)(?:\\?.*)?$',
                toPattern: 'https://dev.to/search?q=$2',
                priority: 1,
            },
        ],
    },
];

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        await chrome.storage.sync.set({
            settings: DEFAULT_SETTINGS,
            ruleGroups: DEFAULT_RULE_GROUPS,
        });
        console.log('URL Switch extension installed with default settings and rules');
    }
});

// Listen for tab updates to apply rules
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete' || !tab.url) return;

    const { settings, ruleGroups } = await chrome.storage.sync.get(['settings', 'ruleGroups']);

    // Check if extension is enabled
    if (!settings?.enabled) return;

    // Process URL with rules
    const match = findMatchingRule(tab.url, ruleGroups || []);
    if (match) {
        const { rule, targetUrl } = match;
        console.log(rule);
        // Handle redirect based on settings
        if (settings.autoRedirect) {
            setTimeout(() => {
                chrome.tabs.update(tabId, { url: targetUrl });
            }, settings.redirectDelay);
        } else {
            // Update extension badge to indicate available redirect
            chrome.action.setBadgeText({
                text: '↔️',
                tabId,
            });
            chrome.action.setBadgeBackgroundColor({
                color: '#4CAF50',
                tabId,
            });
        }
    } else {
        // Clear the badge if no rules match
        chrome.action.setBadgeText({
            text: '',
            tabId,
        });
    }
});

// Process URL with applicable rules
function findMatchingRule(url: string, ruleGroups: RuleGroup[]): RuleMatch | null {
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
function findAllMatchingRules(url: string, ruleGroups: RuleGroup[]): RuleMatch[] {
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

// Handle popup message requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender);
    if (message.action === 'getRedirectForCurrentTab') {
        getCurrentTabRedirect().then(sendResponse);
        return true; // Indicates async response
    }

    if (message.action === 'getAllRedirectsForCurrentTab') {
        getAllTabRedirects().then(sendResponse);
        return true; // Indicates async response
    }

    if (message.action === 'performRedirect' && message.targetUrl) {
        chrome.tabs.update({ url: message.targetUrl });
    }
});

// Get redirect info for current tab
async function getCurrentTabRedirect(): Promise<{ hasRedirect: boolean, targetUrl?: string }> {
    try {
        // Get active tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs[0]?.url) return { hasRedirect: false };

        // Get rules and check for match
        const { ruleGroups } = await chrome.storage.sync.get('ruleGroups');
        const match = findMatchingRule(tabs[0].url, ruleGroups || []);

        if (match) {
            return {
                hasRedirect: true,
                targetUrl: match.targetUrl,
            };
        }

        return { hasRedirect: false };
    } catch (error) {
        console.error('Error getting redirect for current tab:', error);
        return { hasRedirect: false };
    }
}

// Get all redirect matches for current tab
async function getAllTabRedirects(): Promise<MultiRuleMatches> {
    try {
        // Get active tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs[0]?.url) return { matches: [], currentUrl: '' };

        // Get rules and check for all matches
        const { ruleGroups } = await chrome.storage.sync.get('ruleGroups');
        const matches = findAllMatchingRules(tabs[0].url, ruleGroups || []);

        return {
            matches,
            currentUrl: tabs[0].url
        };
    } catch (error) {
        console.error('Error getting all redirects for current tab:', error);
        return { matches: [], currentUrl: '' };
    }
} 