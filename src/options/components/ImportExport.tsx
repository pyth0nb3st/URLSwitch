import React from 'react';

interface ImportExportProps {
    onExportRules: () => void;
    onImportRules: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImportExport: React.FC<ImportExportProps> = ({ onExportRules, onImportRules }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Import/Export Rules</h2>
            
            <div className="mb-6 p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Export Rules</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Export all your rule groups to a JSON file for backup or sharing
                </p>
                <button 
                    onClick={onExportRules}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Export Rules
                </button>
            </div>
            
            <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Import Rules</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Import rule groups from a previously exported JSON file
                </p>
                <label className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer">
                    Import Rules
                    <input
                        type="file"
                        accept=".json"
                        onChange={onImportRules}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    );
};

export default ImportExport; 