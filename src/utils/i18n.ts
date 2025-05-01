import { LanguageCode } from '../types';

/**
 * Gets the message from the i18n system
 * @param messageName - The name of the message to retrieve
 * @param substitutions - Optional substitutions for placeholders
 * @returns The translated message string
 */
export function getMessage(messageName: string, substitutions?: string | string[]): string {
    // Use Chrome's i18n API directly
    return chrome.i18n.getMessage(messageName, substitutions) || messageName;
}

/**
 * Gets the current language from Chrome
 * @returns The detected language code
 */
export function getCurrentLanguage(): LanguageCode {
    // In Chrome extensions, we can get the current locale from the i18n API
    const locale = chrome.i18n.getUILanguage();

    // Check if it's Chinese
    if (locale.startsWith('zh')) {
        return 'zh_CN';
    }

    // Default to English
    return 'en';
}

/**
 * Updates the stored language preference
 * Note: In Chrome extensions, the actual display language is controlled by the browser,
 * but we can store the user preference and notify them to change browser language settings
 * @param languageCode - The language code preference to save
 */
export async function saveLanguagePreference(languageCode: LanguageCode): Promise<void> {
    const { settings } = await chrome.storage.sync.get('settings');

    if (settings) {
        const updatedSettings = {
            ...settings,
            language: languageCode
        };

        await chrome.storage.sync.set({ settings: updatedSettings });

        // Show language change instructions message
        alert(chrome.i18n.getMessage('languageChangeInstructions'));
    }
} 