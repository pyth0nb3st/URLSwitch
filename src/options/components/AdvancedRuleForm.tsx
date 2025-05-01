import React from 'react';

interface AdvancedRuleFormProps {
    name: string;
    fromPattern: string;
    toPattern: string;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFromPatternChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToPatternChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdvancedRuleForm: React.FC<AdvancedRuleFormProps> = ({
    name,
    fromPattern,
    toPattern,
    onNameChange,
    onFromPatternChange,
    onToPatternChange
}) => {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">规则名称</label>
                <input
                    type="text"
                    value={name}
                    onChange={onNameChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="例如：GitHub到GitHub Dev"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    源模式 (正则表达式)
                    <span className="ml-2 text-xs text-gray-500">用于匹配URL</span>
                </label>
                <input
                    type="text"
                    value={fromPattern}
                    onChange={onFromPatternChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="例如：^https?://github\.com/([^/]+/[^/]+)(?:/.*)?$"
                />
                <div className="mt-1 text-xs text-gray-500">
                    <p>使用正则表达式捕获组 () 来捕获URL中的部分，以便在目标URL中使用</p>
                    <p>例如：<code>^https?://([^/]+)/(.*)$</code> 可以捕获域名和路径</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    目标模式
                    <span className="ml-2 text-xs text-gray-500">用于构建重定向URL</span>
                </label>
                <input
                    type="text"
                    value={toPattern}
                    onChange={onToPatternChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="例如：https://github.dev/$1"
                />
                <div className="mt-1 text-xs text-gray-500">
                    <p>使用 $1, $2 等引用源模式中的捕获组</p>
                    <p>例如：<code>https://newdomain.com/$2</code> 将使用源URL的路径</p>
                </div>
            </div>
        </>
    );
};

export default AdvancedRuleForm; 