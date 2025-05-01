import { getCurrentTabRedirect, getAllTabRedirects } from './tabUtils';

// Set up message handlers
export function setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Message received:', message, 'from:', sender);

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
} 