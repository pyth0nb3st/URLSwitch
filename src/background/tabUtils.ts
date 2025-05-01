import { MultiRuleMatches } from '../types';
import { findMatchingRule, findAllMatchingRules } from './ruleMatching';

// Get redirect info for current tab
export async function getCurrentTabRedirect(): Promise<{ hasRedirect: boolean, targetUrl?: string }> {
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
export async function getAllTabRedirects(): Promise<MultiRuleMatches> {
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