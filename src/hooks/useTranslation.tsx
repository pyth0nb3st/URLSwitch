import { useState, useEffect, useCallback } from 'react';
import { LanguageCode } from '../types';
import { getMessage, getCurrentLanguage, saveLanguagePreference } from '../utils/i18n';

export function useTranslation() {
    const [currentLanguage] = useState<LanguageCode>(getCurrentLanguage());
    const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(getCurrentLanguage());

    // Initialize settings from storage
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { settings } = await chrome.storage.sync.get('settings');
                if (settings && settings.language) {
                    setPreferredLanguage(settings.language);
                }
            } catch (error) {
                console.error('Error loading settings for translations:', error);
            }
        };

        loadSettings();

        // Listen for settings changes
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (changes.settings) {
                const newSettings = changes.settings.newValue;
                if (newSettings?.language) {
                    setPreferredLanguage(newSettings.language);
                }
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    // Translation function
    const t = useCallback((key: string, substitutions?: string | string[]) => {
        return getMessage(key, substitutions);
    }, []);

    // Language preference change function
    const changeLanguage = useCallback(async (language: LanguageCode) => {
        setPreferredLanguage(language); // Update immediately for UI responsiveness
        await saveLanguagePreference(language);
    }, []);

    return {
        t,
        changeLanguage,
        currentLanguage,
        preferredLanguage
    };
} 