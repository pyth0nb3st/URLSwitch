import React from 'react';

export type TabType = 'general' | 'rules' | 'import';

interface TabNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

interface TabItemProps {
    label: string;
    value: TabType;
    active: boolean;
    onClick: (tab: TabType) => void;
}

const TabItem: React.FC<TabItemProps> = ({ label, value, active, onClick }) => {
    return (
        <button
            onClick={() => onClick(value)}
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${active
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
        >
            {label}
        </button>
    );
};

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="mb-6">
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                    <TabItem
                        label="General Settings"
                        value="general"
                        active={activeTab === 'general'}
                        onClick={onTabChange}
                    />
                    <TabItem
                        label="Rules Management"
                        value="rules"
                        active={activeTab === 'rules'}
                        onClick={onTabChange}
                    />
                    <TabItem
                        label="Import/Export"
                        value="import"
                        active={activeTab === 'import'}
                        onClick={onTabChange}
                    />
                </nav>
            </div>
        </div>
    );
};

export default TabNav; 