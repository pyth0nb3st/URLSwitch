import { findMatchingRule } from './ruleMatching';
import { DEFAULT_SETTINGS, DEFAULT_RULE_GROUPS } from './defaults';
import { setupMessageListeners } from './messageHandlers';

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
        console.log('Rule matched:', rule);
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

// Set up message handlers
setupMessageListeners(); 