import { RuleGroup, Settings } from '../types';

// Default settings
export const DEFAULT_SETTINGS: Settings = {
    enabled: true,
    autoRedirect: false,
    redirectDelay: 1000,
};

export const DEFAULT_RULE_GROUPS: RuleGroup[] = [
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
            {
                id: 'github-to-deepwiki',
                name: 'github.com → deepwiki.com',
                enabled: true,
                fromPattern: '^https?://github\\.com/(.*)$',
                toPattern: 'https://deepwiki.com/$1',
                priority: 1,
            },
            {
                id: 'deepwiki-to-github',
                name: 'deepwiki.com → github.com',
                enabled: true,
                fromPattern: '^https?://deepwiki\\.com/(.*)$',
                toPattern: 'https://github.com/$1',
                priority: 1,
            },
            {
                id: 'github-to-github1s',
                name: 'github.com → github1s.com',
                enabled: true,
                fromPattern: '^https?://github\\.com/(.*)$',
                toPattern: 'https://github1s.com/$1',
                priority: 1,
            },
            {
                id: 'github1s-to-github',
                name: 'github1s.com → github.com',
                enabled: true,
                fromPattern: '^https?://github1s\\.com/(.*)$',
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